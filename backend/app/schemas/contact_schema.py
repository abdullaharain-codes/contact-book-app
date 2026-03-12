from marshmallow import fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from app.models.contact import Contact
from app import db

class ContactSchema(SQLAlchemyAutoSchema):
    """
    Marshmallow schema for Contact serialization/deserialization.
    Used to convert Contact objects to/from JSON.
    """
    class Meta:
        model           = Contact
        load_instance   = True        # deserialize → Contact instance
        sqla_session    = db.session  # needed for load_instance to work
        fields = (
            'id', 'first_name', 'last_name', 'email', 'phone',
            'address', 'company', 'job_title', 'profile_picture',
            'is_favorite', 'group', 'notes', 'created_at', 'updated_at'
        )

    # load_default replaces deprecated missing= in Marshmallow 3
    is_favorite = fields.Boolean(dump_default=False, load_default=False)
    group       = fields.String(dump_default='other', load_default='other')

    # ISO format timestamps
    created_at = fields.DateTime(format='iso', dump_only=True)
    updated_at = fields.DateTime(format='iso', dump_only=True)


# Reusable schema instances
contact_schema  = ContactSchema()
contacts_schema = ContactSchema(many=True)