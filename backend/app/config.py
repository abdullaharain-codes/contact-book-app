import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration — all shared settings live here."""

    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER      = os.getenv('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    FRONTEND_URL       = os.getenv('FRONTEND_URL', 'http://localhost:3000')

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    """Local development — uses MySQL via .env file."""
    DEBUG   = True
    TESTING = False

    DB_HOST     = os.getenv('DB_HOST', 'localhost')
    DB_PORT     = os.getenv('DB_PORT', '3306')
    DB_NAME     = os.getenv('DB_NAME', 'contact_book')
    DB_USER     = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{os.getenv('DB_USER', 'root')}:"
        f"{os.getenv('DB_PASSWORD', '')}@"
        f"{os.getenv('DB_HOST', 'localhost')}:"
        f"{os.getenv('DB_PORT', '3306')}/"
        f"{os.getenv('DB_NAME', 'contact_book')}"
    )


class ProductionConfig(Config):
    """Production — uses PostgreSQL DATABASE_URL from Render."""
    DEBUG   = False
    TESTING = False

    # Render provides DATABASE_URL — fix legacy postgres:// prefix
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', '').replace(
        'postgres://', 'postgresql://'
    )

    FRONTEND_URL = os.getenv('FRONTEND_URL', '*')

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)


class TestingConfig(Config):
    """Testing — uses in-memory SQLite."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


# ── Config map used by create_app() ───────────────────────
config = {
    'development': DevelopmentConfig,
    'production':  ProductionConfig,
    'testing':     TestingConfig,
    'default':     DevelopmentConfig,
}