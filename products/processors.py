# products/processors.py
import os
import logging
from io import BytesIO
from typing import Optional
from PIL import Image, ImageEnhance, ImageFilter
from django.core.files.base import ContentFile
from django.utils import timezone
from django.conf import settings
from django.db import transaction

from rembg import remove, new_session
from openai import OpenAI

# Separate loggers
image_logger = logging.getLogger("products.image")
openai_logger = logging.getLogger("products.openai")

# OpenAI client
if not getattr(settings, "OPENAI_API_KEY", None):
    openai_logger.warning("OpenAI API key not configured. Content generation will fail.")
    client = None
else:
    client = OpenAI(api_key=settings.OPENAI_API_KEY)


class ProductImageProcessor:
    def __init__(self, product):
        self.product = product
        self.primary_image = product.images.first()

    def process(self) -> bool:
        try:
            self.product.processing_status = "processing"
            self.product.processing_started_at = timezone.now()
            self.product.save(update_fields=["processing_status", "processing_started_at"])

            if not self.primary_image:
                raise ValueError(f"Product ID {self.product.id} has no images.")

            image_logger.info(f"[Product {self.product.id}] Starting image processing...")

            with transaction.atomic():
                processed_image = self._process_image()
                if processed_image:
                    self.product.processed_image.save(
                        f'processed_{os.path.basename(self.primary_image.image.name)}',
                        ContentFile(processed_image),
                        save=False
                    )

                self._generate_content()

                self.product.processing_status = "completed"
                self.product.processing_completed_at = timezone.now()
                self.product.save()

            image_logger.info(f"[Product {self.product.id}] Processing completed successfully.")
            return True

        except Exception as e:
            image_logger.error(f"[Product {self.product.id}] Processing failed: {e}", exc_info=True)
            self.product.processing_status = "failed"
            self.product.processing_completed_at = timezone.now()
            self.product.save(update_fields=["processing_status", "processing_completed_at"])
            raise

    def _process_image(self) -> Optional[bytes]:
        try:
            session = new_session(model_name='isnet-general-use')  # Better edge preservation
            with Image.open(self.primary_image.image) as img:
                img = img.convert("RGBA")

                # Background removal
                img = remove(img, session=session, alpha_matting=True, alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=10)

                # Enhance contrast and sharpen
                img = ImageEnhance.Contrast(img).enhance(1.2)
                img = img.filter(ImageFilter.SHARPEN)

                # Optional mannequin overlay
                mannequin_path = getattr(settings, 'MANNEQUIN_IMAGE_PATH', None)
                if mannequin_path and os.path.exists(mannequin_path):
                    with Image.open(mannequin_path) as mannequin:
                        mannequin = mannequin.convert("RGBA")
                        scaled_img = img.resize((mannequin.width // 2, mannequin.height // 2), Image.LANCZOS)
                        paste_position = (
                            (mannequin.width - scaled_img.width) // 2,
                            (mannequin.height - scaled_img.height) // 2
                        )
                        mannequin.paste(scaled_img, paste_position, scaled_img)
                        img = mannequin

                output = BytesIO()
                img.save(output, format="PNG")
                return output.getvalue()

        except Exception as e:
            image_logger.error(f"[Product {self.product.id}] Image processing error: {e}", exc_info=True)
            raise

    def _generate_content(self):
        if not client:
            return

        try:
            category = self.product.category.name if self.product.category else "General"
            colors = ", ".join([c.name for c in self.product.colors.all()]) or "Various colors"
            fabric = self.product.fabric.name if self.product.fabric else "High-quality fabric"
            name = self.product.name or "Product"

            user_prompt = (
                f"Generate the following for a clothing product:\n\n"
                f"1. Title (max 60 characters)\n"
                f"2. Description (max 160 characters)\n"
                f"3. SEO Meta Title (max 60 characters)\n"
                f"4. SEO Keywords (comma-separated, max 255 chars)\n\n"
                f"Product info:\n"
                f"Category: {category}\n"
                f"Colors: {colors}\n"
                f"Fabric: {fabric}\n"
                f"Name: {name}\n"
                f"Description: {self.product.description[:500]}\n"
            )

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You're a marketing copywriter."},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=400
            )

            if not response.choices or not response.choices[0].message:
                raise ValueError("OpenAI returned no usable content.")

            content = response.choices[0].message.content.strip()
            openai_logger.debug(f"[Product {self.product.id}] OpenAI Response:\n{content}")

            # Extract structured content
            lines = content.splitlines()
            for line in lines:
                if line.lower().startswith("1."):
                    self.product.auto_title = line[2:].strip().strip('"')[:60]
                elif line.lower().startswith("2."):
                    self.product.auto_description = line[2:].strip().strip('"')[:160]
                elif line.lower().startswith("3."):
                    self.product.auto_meta_title = line[2:].strip().strip('"')[:60]
                elif line.lower().startswith("4."):
                    self.product.auto_meta_keywords = line[2:].strip().strip('"')[:255]

        except Exception as e:
            openai_logger.error(
                f"[Product {self.product.id}] OpenAI content generation failed: {e}",
                exc_info=True
            )

