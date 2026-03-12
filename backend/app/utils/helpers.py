import os
from werkzeug.utils import secure_filename
from uuid import uuid4
from typing import Union, Dict, Any
from flask import current_app

# Allowed file extensions for profile pictures
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename: str) -> bool:
    """
    Check if the uploaded file has an allowed extension
    
    Args:
        filename: Name of the uploaded file
    
    Returns:
        True if file extension is allowed, False otherwise
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_profile_picture(file, app=None) -> Union[str, None]:
    """
    Save a profile picture to the upload folder
    
    Args:
        file: The uploaded file object
        app: Flask application instance (uses current_app if None)
    
    Returns:
        The saved filename or None if save failed
    """
    if not file:
        return None
    
    # Get the application instance
    app = app or current_app
    
    # Secure the filename and generate unique name
    original_filename = secure_filename(file.filename)
    file_extension = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else ''
    
    # Generate unique filename using UUID
    unique_filename = f"{uuid4().hex}.{file_extension}" if file_extension else uuid4().hex
    
    # Build full save path
    upload_folder = app.config.get('UPLOAD_FOLDER', 'uploads')
    save_path = os.path.join(upload_folder, unique_filename)
    
    try:
        # Save the file
        file.save(save_path)
        return unique_filename
    except Exception as e:
        print(f"Error saving file: {e}")
        return None

def delete_profile_picture(filename: str, app=None) -> bool:
    """
    Delete a profile picture from the upload folder
    
    Args:
        filename: Name of the file to delete
        app: Flask application instance (uses current_app if None)
    
    Returns:
        True if file was deleted or doesn't exist, False on error
    """
    if not filename:
        return True
    
    # Get the application instance
    app = app or current_app
    
    # Build full file path
    upload_folder = app.config.get('UPLOAD_FOLDER', 'uploads')
    file_path = os.path.join(upload_folder, filename)
    
    try:
        # Check if file exists before attempting to delete
        if os.path.exists(file_path):
            os.remove(file_path)
        return True
    except Exception as e:
        print(f"Error deleting file: {e}")
        return False

def paginate_query(query, page: int = 1, per_page: int = 10) -> Dict[str, Any]:
    """
    Paginate a SQLAlchemy query and return pagination metadata
    
    Args:
        query: SQLAlchemy query object
        page: Current page number (1-indexed)
        per_page: Number of items per page
    
    Returns:
        Dictionary containing:
        - items: List of items for current page
        - total: Total number of items
        - pages: Total number of pages
        - current_page: Current page number
        - per_page: Items per page
        - has_next: Whether there is a next page
        - has_prev: Whether there is a previous page
    """
    # Ensure page and per_page are positive integers
    page = max(1, int(page))
    per_page = max(1, min(100, int(per_page)))  # Cap at 100 items per page
    
    # Get paginated results
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return {
        'items': paginated.items,
        'total': paginated.total,
        'pages': paginated.pages,
        'current_page': paginated.page,
        'per_page': paginated.per_page,
        'has_next': paginated.has_next,
        'has_prev': paginated.has_prev
    }