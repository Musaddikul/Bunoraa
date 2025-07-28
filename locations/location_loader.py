# locations/location_loader.py
import os
import json
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def load_json_file(filename, key):
    """
    Loads a JSON file from /static/data and returns the extracted list by key.
    Example: load_json_file("bd-divisions.json", "divisions")
    """
    file_path = os.path.join(settings.BASE_DIR, 'static', 'data', filename)
    
    try:
        with open(file_path, encoding='utf-8') as f:
            data = json.load(f)
            return json.dumps(data.get(key, []))
    except FileNotFoundError:
        logger.warning(f"File not found: {file_path}")
    except json.JSONDecodeError:
        logger.error(f"Invalid JSON in {file_path}")
    except Exception as e:
        logger.exception(f"Unexpected error loading {file_path}: {str(e)}")

    return '[]'  # Always return a safe empty JSON array
