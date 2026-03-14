"""Fresh start with users and contacts

Revision ID: ad9008286dc8
Revises: f22b8a43b0f7
Create Date: 2026-03-14 18:18:59.776710

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector


# revision identifiers, used by Alembic.
revision = 'ad9008286dc8'
down_revision = 'f22b8a43b0f7'
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = Inspector.from_engine(bind)
    existing_tables = inspector.get_table_names()

    # ── Drop old contacts table if it exists (old schema, no user_id) ──
    if 'contacts' in existing_tables:
        # Check if user_id column exists
        columns = [c['name'] for c in inspector.get_columns('contacts')]
        if 'user_id' not in columns:
            # Old schema — drop and recreate
            op.execute('SET FOREIGN_KEY_CHECKS = 0')
            op.drop_table('contacts')
            op.execute('SET FOREIGN_KEY_CHECKS = 1')
            existing_tables.remove('contacts')

    # ── Create users table if not exists ──────────────────
    if 'users' not in existing_tables:
        op.create_table('users',
            sa.Column('id', sa.Integer(), nullable=False, autoincrement=True),
            sa.Column('name', sa.String(length=100), nullable=False),
            sa.Column('email', sa.String(length=120), nullable=False),
            sa.Column('password_hash', sa.String(length=255), nullable=False),
            sa.Column('created_at', sa.DateTime(), nullable=True),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # ── Create contacts table if not exists ───────────────
    if 'contacts' not in existing_tables:
        op.create_table('contacts',
            sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
            sa.Column('user_id', sa.Integer(), nullable=False),
            sa.Column('first_name', sa.String(length=50), nullable=False),
            sa.Column('last_name', sa.String(length=50), nullable=True),
            sa.Column('email', sa.String(length=120), nullable=True),
            sa.Column('phone', sa.String(length=20), nullable=True),
            sa.Column('address', sa.String(length=200), nullable=True),
            sa.Column('company', sa.String(length=100), nullable=True),
            sa.Column('job_title', sa.String(length=100), nullable=True),
            sa.Column('profile_picture', sa.String(length=255), nullable=True),
            sa.Column('is_favorite', sa.Boolean(), nullable=False),
            sa.Column('group', sa.String(length=20), nullable=False),
            sa.Column('notes', sa.Text(), nullable=True),
            sa.Column('created_at', sa.DateTime(), nullable=False),
            sa.Column('updated_at', sa.DateTime(), nullable=False),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index('ix_contacts_user_id', 'contacts', ['user_id'], unique=False)


def downgrade():
    op.execute('SET FOREIGN_KEY_CHECKS = 0')
    op.drop_table('contacts')
    op.drop_table('users')
    op.execute('SET FOREIGN_KEY_CHECKS = 1')