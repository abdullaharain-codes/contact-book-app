from app import db
from datetime import datetime
import enum


class ContactGroup(str, enum.Enum):
    FAMILY  = 'family'
    FRIENDS = 'friends'
    WORK    = 'work'
    OTHER   = 'other'


class Contact(db.Model):
    """Contact model — maps to the 'contacts' table in MySQL."""

    __tablename__ = 'contacts'

    # ── Primary Key ───────────────────────────────────────────
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # ── Foreign Key — which user owns this contact ────────────
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('users.id', ondelete='CASCADE'),
        nullable=False,
        index=True
    )

    # ── Personal Info ─────────────────────────────────────────
    first_name = db.Column(db.String(50),  nullable=False)
    last_name  = db.Column(db.String(50),  nullable=True)
    email      = db.Column(db.String(120), nullable=True)
    phone      = db.Column(db.String(20),  nullable=True)
    address    = db.Column(db.String(200), nullable=True)

    # ── Professional Info ─────────────────────────────────────
    company   = db.Column(db.String(100), nullable=True)
    job_title = db.Column(db.String(100), nullable=True)

    # ── Profile Picture (stores filename only) ────────────────
    profile_picture = db.Column(db.String(255), nullable=True)

    # ── Preferences ───────────────────────────────────────────
    is_favorite = db.Column(db.Boolean, nullable=False, default=False)

    # Store as plain VARCHAR string — avoids MySQL enum migration issues
    group = db.Column(db.String(20), nullable=False, default='other')

    # ── Notes ─────────────────────────────────────────────────
    notes = db.Column(db.Text, nullable=True)

    # ── Timestamps ────────────────────────────────────────────
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow,
                           onupdate=datetime.utcnow)

    def __repr__(self):
        return f'<Contact {self.first_name} {self.last_name or ""}>'

    def to_dict(self):
        return {
            'id':              self.id,
            'user_id':         self.user_id,
            'first_name':      self.first_name,
            'last_name':       self.last_name,
            'email':           self.email,
            'phone':           self.phone,
            'address':         self.address,
            'company':         self.company,
            'job_title':       self.job_title,
            'profile_picture': self.profile_picture,
            'is_favorite':     self.is_favorite,
            'group':           self.group,
            'notes':           self.notes,
            'created_at':      self.created_at.isoformat() if self.created_at else None,
            'updated_at':      self.updated_at.isoformat() if self.updated_at else None,
        }

    @classmethod
    def get_by_group(cls, group: str, user_id: int):
        return cls.query.filter_by(group=group.lower(), user_id=user_id)

    @classmethod
    def get_favorites(cls, user_id: int):
        return cls.query.filter_by(is_favorite=True, user_id=user_id)

    @classmethod
    def search(cls, query: str, user_id: int):
        if not query:
            return cls.query.filter_by(user_id=user_id)
        term = f'%{query}%'
        return cls.query.filter(
            cls.user_id == user_id,
            db.or_(
                cls.first_name.like(term),
                cls.last_name.like(term),
                cls.email.like(term),
                cls.phone.like(term),
                cls.company.like(term),
            )
        )