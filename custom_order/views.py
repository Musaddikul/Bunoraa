# custom_order/views.py
import logging
from django.db import transaction
from django.shortcuts import render, redirect
from django.http import JsonResponse, Http404
from django.urls import reverse_lazy
from django.views.generic import CreateView, DetailView, UpdateView, ListView
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.mixins import LoginRequiredMixin
from django.forms import inlineformset_factory
from django.contrib import messages
from django.conf import settings
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.forms.utils import ErrorList

from .models import CustomOrder, DesignImage, CustomerItemImage, OrderStatusUpdate
from .forms import CustomOrderForm, DesignImageFormSet, CustomerItemImageFormSet
from promotions.services import CouponService # Import CouponService
from .services import finalize_pricing
from .selectors import get_order

logger = logging.getLogger(__name__)

class CustomOrderCreateView(LoginRequiredMixin, CreateView):
    """
    View for creating a new custom order.
    Handles form submission and image uploads using formsets.
    """
    model = CustomOrder
    form_class = CustomOrderForm
    template_name = 'custom_order/create.html'
    success_url = reverse_lazy('custom_order:list')

    def get_form_kwargs(self):
        """
        Passes the current user to the form.
        """
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def get_context_data(self, **kwargs):
        """
        Adds formsets for design images and customer item images to the context.
        """
        context = super().get_context_data(**kwargs)
        if self.request.POST:
            context['design_formset'] = DesignImageFormSet(
                self.request.POST, self.request.FILES,
                prefix='design_images',
                instance=self.object
            )
            context['item_formset'] = CustomerItemImageFormSet(
                self.request.POST, self.request.FILES,
                prefix='customer_item_images',
                instance=self.object
            )
        else:
            context['design_formset'] = DesignImageFormSet(
                prefix='design_images',
                instance=self.object
            )
            context['item_formset'] = CustomerItemImageFormSet(
                prefix='customer_item_images',
                instance=self.object
            )
        return context

    def form_valid(self, form):
        """
        Handles valid form submission, saves order and associated images,
        calculates pricing, and applies coupon if provided.
        """
        context = self.get_context_data()
        design_formset = context['design_formset']
        item_formset = context['item_formset']

        with transaction.atomic():
            self.object = form.save(commit=False)
            self.object.user = self.request.user

            # Set initial status based on is_draft from the form
            if self.object.is_draft:
                self.object.status = CustomOrder.Status.DRAFT
                logger.debug(f"CustomOrderCreateView: Setting initial status to DRAFT for new order {self.object.order_id if self.object.pk else 'new'}.")
            else:
                # For non-drafts, initial status can be default, finalize_pricing will set it to PENDING
                logger.debug(f"CustomOrderCreateView: New order is NOT a draft. Initial status will be handled by finalize_pricing.")


            self.object.save() # Save the order first to get a primary key for inlines

            if design_formset.is_valid():
                design_formset.instance = self.object
                design_formset.save()
            else:
                logger.error(f"CustomOrderCreateView: Design formset invalid: {design_formset.errors}")
                return self.form_invalid(form)

            if item_formset.is_valid():
                item_formset.instance = self.object
                item_formset.save()
            else:
                logger.error(f"CustomOrderCreateView: Item formset invalid: {item_formset.errors}")
                return self.form_invalid(form)

            # Handle coupon application if provided (should be before finalize_pricing if it affects base price)
            coupon_code = form.cleaned_data.get('coupon_code') # Get from cleaned_data
            if coupon_code:
                try:
                    # Apply coupon to get discount amount and new total
                    # Use a temporary amount for calculation before full pricing is finalized
                    temp_total_for_coupon = Decimal('0.00') # Will be updated by finalize_pricing
                    coupon_application_result = CouponService.apply_coupon(
                        coupon_code, temp_total_for_coupon, self.request.user
                    )
                    self.object.coupon = coupon_application_result['coupon']
                    self.object.discount_amount = coupon_application_result['discount_amount']
                    messages.success(self.request, f"Coupon '{coupon_code}' applied successfully!")
                    logger.info(f"CustomOrderCreateView: Coupon '{coupon_code}' applied for order {self.object.order_id}.")
                except ValidationError as e:
                    messages.error(self.request, f"Coupon Error: {e.message}")
                    self.object.coupon = None
                    self.object.discount_amount = Decimal('0.00')
                    logger.warning(f"CustomOrderCreateView: Coupon '{coupon_code}' validation failed: {e.message}")
                except Exception as e:
                    logger.exception(f"CustomOrderCreateView: Unexpected error applying coupon {coupon_code}: {e}")
                    messages.error(self.request, "An unexpected error occurred while applying the coupon.")
                    self.object.coupon = None
                    self.object.discount_amount = Decimal('0.00')

            # Recalculate pricing after all order details and images are saved, and coupon is set
            try:
                finalize_pricing(self.object)
                logger.info(f"CustomOrderCreateView: Pricing finalized for new order {self.object.order_id}")
            except Exception as e:
                logger.error(f"CustomOrderCreateView: Error finalizing pricing for new order {self.object.order_id}: {e}", exc_info=True)
                messages.error(self.request, _("An error occurred while calculating order pricing."))


            # If the order is not a draft, set its status to PENDING
            # This logic is already handled by create_order_from_draft if it's called.
            # However, for traditional views, if it's not a draft, we explicitly set it here.
            if not self.object.is_draft and self.object.status != CustomOrder.Status.PENDING:
                self.object.status = CustomOrder.Status.PENDING
                logger.debug(f"CustomOrderCreateView: Order {self.object.order_id} is not a draft, setting status to PENDING.")
            elif self.object.is_draft and self.object.status != CustomOrder.Status.DRAFT:
                self.object.status = CustomOrder.Status.DRAFT
                logger.debug(f"CustomOrderCreateView: Order {self.object.order_id} is a draft, ensuring status is DRAFT.")


            # Final save to ensure all calculated fields and status are persisted
            self.object.save(update_fields=['status', 'base_price', 'shipping_cost', 'vat_amount', 'discount_amount', 'total_amount', 'coupon', 'is_draft'])
            logger.debug(f"CustomOrderCreateView: Final save for order {self.object.order_id}. Status: {self.object.status}, Is Draft: {self.object.is_draft}, VAT: {self.object.vat_amount}, Discount: {self.object.discount_amount}")


        messages.success(self.request, "Custom order submitted successfully! We will review your request and get back to you soon.")

        if self.request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({
                'status': 'success',
                'message': 'Order created successfully!',
                'redirect_url': reverse_lazy('custom_order:thank_you', kwargs={'order_id': self.object.order_id})
            })

        return super().form_valid(form)

    def form_invalid(self, form):
        """
        Handles invalid form submission, logs errors, and displays messages.
        Returns JSON response for AJAX requests.
        """
        context = self.get_context_data(form=form)

        design_images_errors_list = []
        for f in context['design_formset']:
            if isinstance(f.errors, ErrorList):
                design_images_errors_list.append(f.errors.as_json())
            else:
                design_images_errors_list.append(JsonResponse(f.errors).content.decode('utf-8'))

        customer_item_images_errors_list = []
        for f in context['item_formset']:
            if isinstance(f.errors, ErrorList):
                customer_item_images_errors_list.append(f.errors.as_json())
            else:
                customer_item_images_errors_list.append(JsonResponse(f.errors).content.decode('utf-8'))

        errors = {
            'form_errors': form.errors.as_json(),
            'design_images_errors': design_images_errors_list,
            'customer_item_images_errors': customer_item_images_errors_list,
            'design_formset_non_form_errors': context['design_formset'].non_form_errors().as_json(),
            'customer_item_images_formset_non_form_errors': context['item_formset'].non_form_errors().as_json(),
            'non_field_errors': form.non_field_errors().as_json(),
        }

        logger.warning(f"Custom order form invalid: {form.errors.as_json()}")
        messages.error(self.request, "There was an error with your submission. Please correct the errors below.")

        if form.errors:
            for field, field_errors in form.errors.items():
                for error in field_errors:
                    messages.error(self.request, f"{field.replace('_', ' ').capitalize()}: {error}")

        if context['design_formset'].errors:
            for i, form_in_formset in enumerate(context['design_formset']):
                if form_in_formset.errors:
                    for field, field_errors in form_in_formset.errors.items():
                        for error in field_errors:
                            messages.error(self.request, f"Design Image #{i+1} - {field.replace('_', ' ').capitalize()}: {error}")
            if context['design_formset'].non_form_errors():
                for error in context['design_formset'].non_form_errors():
                    messages.error(self.request, f"Design Images (General): {error}")

        if context['item_formset'].errors:
            for i, form_in_formset in enumerate(context['item_formset']):
                if form_in_formset.errors:
                    for field, field_errors in form_in_formset.errors.items():
                        for error in field_errors:
                            messages.error(self.request, f"Customer Item Image #{i+1} - {field.replace('_', ' ').capitalize()}: {error}")
            if context['item_formset'].non_form_errors():
                for error in context['item_formset'].non_form_errors():
                    messages.error(self.request, f"Customer Item Images (General): {error}")

        if self.request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'status': 'error', 'message': 'Validation failed. Please check your input.', 'errors': errors}, status=400)
        else:
            return self.render_to_response(context)


class CustomOrderDetailView(LoginRequiredMixin, DetailView):
    """
    View for displaying details of a custom order.
    """
    model = CustomOrder
    template_name = 'custom_order/detail.html'
    context_object_name = 'order'
    slug_field = 'order_id'
    slug_url_kwarg = 'order_id'

    def get_queryset(self):
        """
        Ensure users can only view their own custom orders.
        Prefetch related data for efficiency.
        """
        return CustomOrder.objects.filter(user=self.request.user).prefetch_related(
            'design_images', 'customer_item_images', 'status_updates'
        )

    def get_context_data(self, **kwargs):
        """
        Adds progress updates to the context and logs pricing details.
        """
        context = super().get_context_data(**kwargs)
        context['progress_updates'] = self.object.status_updates.all().order_by('-created_at')
        
        # Add logging for pricing fields to debug detail.html display
        logger.debug(f"CustomOrderDetailView: Order {self.object.order_id} details for template:")
        logger.debug(f"  is_draft: {self.object.is_draft}, status: {self.object.status}")
        logger.debug(f"  base_price: {self.object.base_price}, vat_amount: {self.object.vat_amount}")
        logger.debug(f"  discount_amount: {self.object.discount_amount}, shipping_cost: {self.object.shipping_cost}")
        logger.debug(f"  total_amount: {self.object.total_amount}")
        logger.debug(f"  coupon: {self.object.coupon.code if self.object.coupon else 'N/A'}")

        return context

class CustomOrderUpdateView(LoginRequiredMixin, UpdateView):
    """
    View for updating an existing custom order.
    Only allows the customer to update if the order is still in 'pending' or 'draft' status.
    """
    model = CustomOrder
    form_class = CustomOrderForm
    template_name = 'custom_order/create.html'
    context_object_name = 'order'
    slug_field = 'order_id'
    slug_url_kwarg = 'order_id'

    def get_form_kwargs(self):
        """
        Passes the current user to the form.
        """
        kwargs = super().get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs

    def get_queryset(self):
        """
        Customer can only update their own pending or draft orders.
        """
        return CustomOrder.objects.filter(
            user=self.request.user,
            status__in=[CustomOrder.Status.PENDING, CustomOrder.Status.DRAFT]
        )

    def get_context_data(self, **kwargs):
        """
        Adds formsets for design images and customer item images to the context.
        """
        context = super().get_context_data(**kwargs)
        if self.request.POST:
            context['design_formset'] = DesignImageFormSet(
                self.request.POST, self.request.FILES,
                instance=self.object, prefix='design_images'
            )
            context['item_formset'] = CustomerItemImageFormSet(
                self.request.POST, self.request.FILES,
                instance=self.object, prefix='customer_item_images'
            )
        else:
            context['design_formset'] = DesignImageFormSet(
                instance=self.object, prefix='design_images'
            )
            context['item_formset'] = CustomerItemImageFormSet(
                instance=self.object, prefix='customer_item_images'
            )
        return context

    def form_valid(self, form):
        """
        Handles valid form submission, saves order and associated images,
        calculates pricing, and applies coupon if provided.
        """
        context = self.get_context_data()
        design_formset = context['design_formset']
        item_formset = context['item_formset']

        with transaction.atomic():
            self.object = form.save(commit=False)
            
            # Handle is_draft transition for status
            # If it was a draft and is now being submitted as non-draft
            was_draft = CustomOrder.objects.get(pk=self.object.pk).is_draft # Get original state
            if was_draft and not self.object.is_draft:
                self.object.status = CustomOrder.Status.PENDING
                logger.debug(f"CustomOrderUpdateView: Order {self.object.order_id} transitioning from DRAFT to PENDING.")
            elif not was_draft and self.object.is_draft:
                self.object.status = CustomOrder.Status.DRAFT
                logger.debug(f"CustomOrderUpdateView: Order {self.object.order_id} transitioning from non-DRAFT to DRAFT.")
            elif self.object.is_draft: # Still a draft
                self.object.status = CustomOrder.Status.DRAFT
                logger.debug(f"CustomOrderUpdateView: Order {self.object.order_id} remains DRAFT.")
            # If not a draft and not transitioning to draft, status remains as is (e.g., PENDING)


            self.object.save()

            if design_formset.is_valid():
                design_formset.instance = self.object
                design_formset.save()
            else:
                logger.error(f"CustomOrderUpdateView: Design formset invalid: {design_formset.errors}")
                return self.form_invalid(form)

            if item_formset.is_valid():
                item_formset.instance = self.object
                item_formset.save()
            else:
                logger.error(f"CustomOrderUpdateView: Item formset invalid: {item_formset.errors}")
                return self.form_invalid(form)

            # Handle coupon application if provided (similar to create view)
            coupon_code = form.cleaned_data.get('coupon_code')
            if coupon_code:
                try:
                    temp_total_for_coupon = Decimal('0.00')
                    coupon_application_result = CouponService.apply_coupon(
                        coupon_code, temp_total_for_coupon, self.request.user
                    )
                    self.object.coupon = coupon_application_result['coupon']
                    self.object.discount_amount = coupon_application_result['discount_amount']
                    messages.success(self.request, f"Coupon '{coupon_code}' applied successfully!")
                    logger.info(f"CustomOrderUpdateView: Coupon '{coupon_code}' applied for order {self.object.order_id}.")
                except ValidationError as e:
                    messages.error(self.request, f"Coupon Error: {e.message}")
                    self.object.coupon = None
                    self.object.discount_amount = Decimal('0.00')
                    logger.warning(f"CustomOrderUpdateView: Coupon '{coupon_code}' validation failed: {e.message}")
                except Exception as e:
                    logger.exception(f"CustomOrderUpdateView: Unexpected error applying coupon {coupon_code}: {e}")
                    messages.error(self.request, "An unexpected error occurred while applying the coupon.")
                    self.object.coupon = None
                    self.object.discount_amount = Decimal('0.00')

            # Recalculate pricing after all order details and images are saved, and coupon is set
            try:
                finalize_pricing(self.object)
                logger.info(f"CustomOrderUpdateView: Pricing finalized for updated order {self.object.order_id}")
            except Exception as e:
                logger.error(f"CustomOrderUpdateView: Error finalizing pricing for updated order {self.object.order_id}: {e}", exc_info=True)
                messages.error(self.request, _("An error occurred while calculating order pricing."))

            # Final save to ensure all calculated fields and status are persisted
            self.object.save(update_fields=['status', 'base_price', 'shipping_cost', 'vat_amount', 'discount_amount', 'total_amount', 'coupon', 'is_draft'])
            logger.debug(f"CustomOrderUpdateView: Final save for order {self.object.order_id}. Status: {self.object.status}, Is Draft: {self.object.is_draft}, VAT: {self.object.vat_amount}, Discount: {self.object.discount_amount}")


        messages.success(self.request, "Custom order updated successfully!")

        if self.request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({
                'status': 'success',
                'message': 'Order updated successfully!',
                'redirect_url': reverse_lazy('custom_order:detail', kwargs={'order_id': self.object.order_id})
            })

        return super().form_valid(form)

    def form_invalid(self, form):
        """
        Handles invalid form submission, logs errors, and displays messages.
        Returns JSON response for AJAX requests.
        """
        context = self.get_context_data(form=form)

        design_images_errors_list = []
        for f in context['design_formset']:
            if isinstance(f.errors, ErrorList):
                design_images_errors_list.append(f.errors.as_json())
            else:
                design_images_errors_list.append(JsonResponse(f.errors).content.decode('utf-8'))

        customer_item_images_errors_list = []
        for f in context['item_formset']:
            if isinstance(f.errors, ErrorList):
                customer_item_images_errors_list.append(f.errors.as_json())
            else:
                customer_item_images_errors_list.append(JsonResponse(f.errors).content.decode('utf-8'))

        errors = {
            'form_errors': form.errors.as_json(),
            'design_images_errors': design_images_errors_list,
            'customer_item_images_errors': customer_item_images_errors_list,
            'design_formset_non_form_errors': context['design_formset'].non_form_errors().as_json(),
            'customer_item_images_formset_non_form_errors': context['item_formset'].non_form_errors().as_json(),
            'non_field_errors': form.non_field_errors().as_json(),
        }

        logger.warning(f"Custom order form invalid: {form.errors.as_json()}")
        messages.error(self.request, "There was an error with your submission. Please correct the errors below.")

        if form.errors:
            for field, field_errors in form.errors.items():
                for error in field_errors:
                    messages.error(self.request, f"{field.replace('_', ' ').capitalize()}: {error}")

        if context['design_formset'].errors:
            for i, form_in_formset in enumerate(context['design_formset']):
                if form_in_formset.errors:
                    for field, field_errors in form_in_formset.errors.items():
                        for error in field_errors:
                            messages.error(self.request, f"Design Image #{i+1} - {field.replace('_', ' ').capitalize()}: {error}")
            if context['design_formset'].non_form_errors():
                for error in context['design_formset'].non_form_errors():
                    messages.error(self.request, f"Design Images (General): {error}")

        if context['item_formset'].errors:
            for i, form_in_formset in enumerate(context['item_formset']):
                if form_in_formset.errors:
                    for field, field_errors in form_in_formset.errors.items():
                        for error in field_errors:
                            messages.error(self.request, f"Customer Item Image #{i+1} - {field.replace('_', ' ').capitalize()}: {error}")
            if context['item_formset'].non_form_errors():
                for error in context['item_formset'].non_form_errors():
                    messages.error(self.request, f"Customer Item Images (General): {error}")

        if self.request.headers.get('x-requested-with') == 'XMLHttpRequest':
            return JsonResponse({'status': 'error', 'message': 'Validation failed. Please check your input.', 'errors': errors}, status=400)
        else:
            return self.render_to_response(context)


class CustomOrderListView(LoginRequiredMixin, ListView):
    """
    View for listing a user's custom orders.
    """
    model = CustomOrder
    template_name = 'custom_order/list.html'
    context_object_name = 'orders'
    paginate_by = 10

    def get_queryset(self):
        """
        Returns custom orders filtered by the current user, ordered by creation date.
        """
        return CustomOrder.objects.filter(user=self.request.user).order_by('-created_at')

class ProgressUpdateCreateView(LoginRequiredMixin, CreateView):
    """
    View for creating a new progress update for a custom order (admin-facing).
    """
    model = OrderStatusUpdate
    # Assuming you have an OrderStatusUpdateForm
    # from .forms import OrderStatusUpdateForm
    # form_class = OrderStatusUpdateForm
    template_name = 'custom_order/progressupdate_form.html'

    def form_valid(self, form):
        """
        Saves the progress update, associating it with the correct order and user.
        """
        order_id = self.kwargs.get('order_id')
        try:
            custom_order = CustomOrder.objects.get(order_id=order_id)
        except CustomOrder.DoesNotExist:
            raise Http404("Custom Order not found.")

        form.instance.order = custom_order
        form.instance.updated_by = self.request.user
        messages.success(self.request, "Progress update added successfully!")
        return super().form_valid(form)

    def get_success_url(self):
        """
        Redirects to the custom order detail page after successful update.
        """
        return reverse_lazy('custom_order:detail', kwargs={'order_id': self.kwargs.get('order_id')})

def thank_you(request, order_id):
    """
    Renders a thank you page after order submission.
    """
    order = get_order(order_id)
    if not order or (request.user.is_authenticated and order.user != request.user):
        raise Http404("Order not found")

    context = {
        'order': order,
        'contact_methods': {
            'whatsapp': 'https://wa.me/8801701922629',
            'messenger': 'https://m.me/bunoraa',
            'email': 'mailto:musaddikul.amin@gmail.com',
        }
    }
    return render(request, 'custom_order/thank_you.html', context)
