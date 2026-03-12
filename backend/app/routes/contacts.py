from flask import Blueprint, jsonify, request, current_app, send_from_directory
from app import db
from app.models.contact import Contact
from app.schemas.contact_schema import contact_schema, contacts_schema
from app.utils.helpers import (
    allowed_file, save_profile_picture,
    delete_profile_picture, paginate_query
)
import os

# Blueprint registered in app/__init__.py with url_prefix='/api/contacts'
contacts_bp = Blueprint('contacts', __name__)

# Valid group values — must match database values
VALID_GROUPS = ['family', 'friends', 'work', 'other']


# ── Helper Functions ───────────────────────────────────────────────────────────

def validate_group(group_name):
    return group_name in VALID_GROUPS


def validate_email_unique(email, exclude_id=None):
    if not email:
        return True
    query = Contact.query.filter_by(email=email)
    if exclude_id:
        query = query.filter(Contact.id != exclude_id)
    return query.first() is None


def handle_profile_picture_upload(request_files, old_filename=None):
    if 'profile_picture' not in request_files:
        return old_filename
    file = request_files['profile_picture']
    if file.filename == '':
        return old_filename
    if file and allowed_file(file.filename):
        if old_filename:
            delete_profile_picture(old_filename, current_app._get_current_object())
        return save_profile_picture(file, current_app._get_current_object())
    return old_filename


def get_sorting_params():
    sort_by = request.args.get('sort_by', 'first_name')
    order   = request.args.get('order', 'asc').lower()
    valid_sort_fields = ['first_name', 'last_name', 'email', 'company', 'created_at']
    if sort_by not in valid_sort_fields:
        sort_by = 'first_name'
    if order not in ['asc', 'desc']:
        order = 'asc'
    return sort_by, order


def apply_sorting(query, sort_by, order):
    column = getattr(Contact, sort_by)
    return query.order_by(column.desc() if order == 'desc' else column.asc())


def build_paginated_response(query, page, per_page):
    paginated = paginate_query(query, page, per_page)
    return {
        'contacts': contacts_schema.dump(paginated['items']),
        'pagination': {
            'total':        paginated['total'],
            'pages':        paginated['pages'],
            'current_page': paginated['current_page'],
            'per_page':     paginated['per_page'],
            'has_next':     paginated['has_next'],
            'has_prev':     paginated['has_prev'],
        }
    }


# ── Static File Serving ────────────────────────────────────────────────────────

@contacts_bp.route('/uploads/<filename>', methods=['GET'])
def get_uploaded_file(filename):
    try:
        upload_folder = os.path.abspath(
            current_app.config.get('UPLOAD_FOLDER', 'uploads')
        )
        return send_from_directory(upload_folder, filename)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ── GET /api/contacts/stats ────────────────────────────────────────────────────
# ⚠️ MUST be defined BEFORE /<int:contact_id> routes to avoid route conflicts

@contacts_bp.route('/stats', methods=['GET'])
def get_contact_stats():
    try:
        total_contacts  = Contact.query.count()
        total_favorites = Contact.query.filter_by(is_favorite=True).count()
        groups = {
            g: Contact.query.filter_by(group=g).count()
            for g in VALID_GROUPS
        }
        return jsonify({
            'total_contacts':  total_contacts,
            'total_favorites': total_favorites,
            'groups':          groups
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ── GET /api/contacts/search ───────────────────────────────────────────────────
# ⚠️ MUST be defined BEFORE /<int:contact_id> routes

@contacts_bp.route('/search', methods=['GET'])
def search_contacts():
    try:
        search_term = request.args.get('q', '').strip()
        page        = int(request.args.get('page', 1))
        per_page    = int(request.args.get('per_page', 10))

        if not search_term:
            return jsonify({
                'contacts': [],
                'pagination': {
                    'total': 0, 'pages': 0,
                    'current_page': page, 'per_page': per_page,
                    'has_next': False, 'has_prev': False
                }
            }), 200

        query = Contact.search(search_term)
        return jsonify(build_paginated_response(query, page, per_page)), 200

    except ValueError:
        return jsonify({'error': 'Invalid pagination parameters'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ── GET /api/contacts/favorites ───────────────────────────────────────────────
# ⚠️ MUST be defined BEFORE /<int:contact_id> routes

@contacts_bp.route('/favorites', methods=['GET'])
def get_favorites():
    try:
        page     = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        query    = Contact.get_favorites()
        return jsonify(build_paginated_response(query, page, per_page)), 200
    except ValueError:
        return jsonify({'error': 'Invalid pagination parameters'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ── GET /api/contacts/groups/<group_name> ─────────────────────────────────────
# ⚠️ MUST be defined BEFORE /<int:contact_id> routes

@contacts_bp.route('/groups/<string:group_name>', methods=['GET'])
def get_contacts_by_group(group_name):
    try:
        group_name = group_name.lower().strip()
        if not validate_group(group_name):
            return jsonify({
                'error': f'Invalid group. Must be one of: {", ".join(VALID_GROUPS)}'
            }), 400

        page     = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        query    = Contact.get_by_group(group_name)
        return jsonify(build_paginated_response(query, page, per_page)), 200

    except ValueError:
        return jsonify({'error': 'Invalid pagination parameters'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ── GET /api/contacts/ ─────────────────────────────────────────────────────────

@contacts_bp.route('/', methods=['GET'])
def get_all_contacts():
    try:
        page     = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        sort_by, order = get_sorting_params()
        query = apply_sorting(Contact.query, sort_by, order)
        return jsonify(build_paginated_response(query, page, per_page)), 200
    except ValueError:
        return jsonify({'error': 'Invalid pagination parameters'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ── POST /api/contacts/ ────────────────────────────────────────────────────────

@contacts_bp.route('/', methods=['POST'])
def create_contact():
    try:
        first_name = request.form.get('first_name', '').strip()
        if not first_name:
            return jsonify({'error': 'first_name is required'}), 400
        if len(first_name) > 50:
            return jsonify({'error': 'first_name must be 50 characters or less'}), 400

        email = request.form.get('email', '').strip() or None
        if email:
            if '@' not in email:
                return jsonify({'error': 'Invalid email format'}), 400
            if not validate_email_unique(email):
                return jsonify({'error': 'Email already exists'}), 409

        phone = request.form.get('phone', '').strip() or None
        if phone and len(phone) > 20:
            return jsonify({'error': 'phone must be 20 characters or less'}), 400

        group = request.form.get('group', 'other').strip().lower()
        if group not in VALID_GROUPS:
            return jsonify({
                'error': f'group must be one of: {", ".join(VALID_GROUPS)}'
            }), 400

        profile_picture = handle_profile_picture_upload(request.files)

        contact = Contact(
            first_name      = first_name,
            last_name       = request.form.get('last_name', '').strip() or None,
            email           = email,
            phone           = phone,
            address         = request.form.get('address', '').strip() or None,
            company         = request.form.get('company', '').strip() or None,
            job_title       = request.form.get('job_title', '').strip() or None,
            profile_picture = profile_picture,
            is_favorite     = request.form.get('is_favorite', 'false').lower() == 'true',
            group           = group,
            notes           = request.form.get('notes', '').strip() or None,
        )

        db.session.add(contact)
        db.session.commit()

        return jsonify({
            'message': 'Contact created successfully',
            'contact': contact_schema.dump(contact)
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ── GET /api/contacts/<id> ─────────────────────────────────────────────────────

@contacts_bp.route('/<int:contact_id>', methods=['GET'])
def get_contact(contact_id):
    try:
        contact = db.session.get(Contact, contact_id)
        if not contact:
            return jsonify({'error': 'Contact not found'}), 404
        return jsonify(contact_schema.dump(contact)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ── PUT /api/contacts/<id> ─────────────────────────────────────────────────────

@contacts_bp.route('/<int:contact_id>', methods=['PUT'])
def update_contact(contact_id):
    try:
        contact = db.session.get(Contact, contact_id)
        if not contact:
            return jsonify({'error': 'Contact not found'}), 404

        email = request.form.get('email', '').strip() or None
        if email and email != contact.email:
            if '@' not in email:
                return jsonify({'error': 'Invalid email format'}), 400
            if not validate_email_unique(email, contact_id):
                return jsonify({'error': 'Email already exists'}), 409

        phone = request.form.get('phone', '').strip() or None
        if phone and len(phone) > 20:
            return jsonify({'error': 'phone must be 20 characters or less'}), 400

        group = request.form.get('group', '').strip().lower() or None
        if group and group not in VALID_GROUPS:
            return jsonify({
                'error': f'group must be one of: {", ".join(VALID_GROUPS)}'
            }), 400

        contact.profile_picture = handle_profile_picture_upload(
            request.files, contact.profile_picture
        )

        if 'first_name' in request.form:
            first_name = request.form.get('first_name', '').strip()
            if not first_name:
                return jsonify({'error': 'first_name cannot be empty'}), 400
            contact.first_name = first_name

        if 'last_name'  in request.form: contact.last_name  = request.form.get('last_name',  '').strip() or None
        if email        is not None:      contact.email      = email
        if phone        is not None:      contact.phone      = phone
        if 'address'    in request.form: contact.address    = request.form.get('address',    '').strip() or None
        if 'company'    in request.form: contact.company    = request.form.get('company',    '').strip() or None
        if 'job_title'  in request.form: contact.job_title  = request.form.get('job_title',  '').strip() or None
        if 'notes'      in request.form: contact.notes      = request.form.get('notes',      '').strip() or None
        if group        is not None:      contact.group      = group
        if 'is_favorite' in request.form:
            contact.is_favorite = request.form.get('is_favorite').lower() == 'true'

        db.session.commit()

        return jsonify({
            'message': 'Contact updated successfully',
            'contact': contact_schema.dump(contact)
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ── DELETE /api/contacts/<id> ──────────────────────────────────────────────────

@contacts_bp.route('/<int:contact_id>', methods=['DELETE'])
def delete_contact(contact_id):
    try:
        contact = db.session.get(Contact, contact_id)
        if not contact:
            return jsonify({'error': 'Contact not found'}), 404

        if contact.profile_picture:
            delete_profile_picture(
                contact.profile_picture,
                current_app._get_current_object()
            )

        db.session.delete(contact)
        db.session.commit()

        return jsonify({'message': 'Contact deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ── PATCH /api/contacts/<id>/favorite ─────────────────────────────────────────
# ✅ FIXED: uses contact_schema.dump() instead of contact.to_dict()
#    contact.to_dict() does not exist — that caused the 500 error

@contacts_bp.route('/<int:contact_id>/favorite', methods=['PATCH'])
def toggle_favorite(contact_id):
    try:
        contact = db.session.get(Contact, contact_id)
        if not contact:
            return jsonify({'error': 'Contact not found'}), 404

        contact.is_favorite = not contact.is_favorite
        db.session.commit()

        return jsonify({
            'message': 'Added to favorites' if contact.is_favorite else 'Removed from favorites',
            'contact': contact_schema.dump(contact)   # ✅ schema.dump, not to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ── Blueprint Error Handlers ───────────────────────────────────────────────────

@contacts_bp.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@contacts_bp.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500