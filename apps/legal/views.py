"""Frontend legal document views."""
from django.views.generic import TemplateView
from django.utils.functional import cached_property
from .models import LegalDocument


class LegalDocumentView(TemplateView):
    """Base TemplateView for published legal documents."""

    template_name = 'legal/document.html'
    document_type = None
    fallback_title = 'Legal Information'
    fallback_content = (
        'This legal document is being prepared. Please check back soon or contact support '
        'if you need immediate assistance.'
    )

    @cached_property
    def document(self):
        if not self.document_type:
            return None
        return (
            LegalDocument.objects.filter(document_type=self.document_type, is_published=True)
            .order_by('-effective_date', '-updated_at')
            .first()
        )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['document'] = self.document
        context['page_title'] = self.get_page_title()
        context['fallback_content'] = self.fallback_content
        return context

    def get_page_title(self):
        if self.document:
            return self.document.title
        return self.fallback_title


class TermsView(LegalDocumentView):
    document_type = 'terms'
    fallback_title = 'Terms of Service'
    fallback_content = (
        'Our latest Terms of Service are coming soon. In the meantime, by using Bunoraa you agree to '
        'behave respectfully, comply with applicable laws, and reach out to support@bunoraa.com '
        'if you have any policy questions.'
    )


class PrivacyView(LegalDocumentView):
    document_type = 'privacy'
    fallback_title = 'Privacy Policy'
    fallback_content = (
        'We are finalizing our Privacy Policy to better explain how Bunoraa collects, stores, and '
        'protects your information. Until then, we only use data to run your account and will never '
        'sell your personal information.'
    )
