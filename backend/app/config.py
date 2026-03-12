import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration — all shared settings live here."""

    SECRET_KEY         = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
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

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{os.getenv('DB_USER', 'root')}:"
        f"{os.getenv('DB_PASSWORD', '')}@"
        f"{os.getenv('DB_HOST', 'localhost')}:"
        f"{os.getenv('DB_PORT', '3306')}/"
        f"{os.getenv('DB_NAME', 'contact_book')}"
    )


class ProductionConfig(Config):
    """Production — uses Railway MySQL env vars."""
    DEBUG   = False
    TESTING = False

    # Railway provides MYSQL_URL directly — use it if available,
    # otherwise fall back to individual variables
    @staticmethod
    def _build_db_uri():
        # Option 1: full URL from Railway
        mysql_url = os.getenv('MYSQL_URL') or os.getenv('MYSQL_PUBLIC_URL')
        if mysql_url:
            return mysql_url.replace('mysql://', 'mysql+pymysql://', 1)

        # Option 2: individual Railway variables
        host     = os.getenv('MYSQLHOST', '')
        port     = os.getenv('MYSQLPORT', '3306')
        user     = os.getenv('MYSQLUSER', '')
        password = os.getenv('MYSQLPASSWORD', '')
        database = os.getenv('MYSQLDATABASE', '')
        return f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}"

    SQLALCHEMY_DATABASE_URI = _build_db_uri.__func__()
    FRONTEND_URL = os.getenv('FRONTEND_URL', '*')

    @classmethod
    def init_app(cls, app):
        Config.init_app(app)


class TestingConfig(Config):
    """Testing — uses in-memory SQLite."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


config = {
    'development': DevelopmentConfig,
    'production':  ProductionConfig,
    'testing':     TestingConfig,
    'default':     DevelopmentConfig,
}