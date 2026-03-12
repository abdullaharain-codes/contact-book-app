import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration — all shared settings live here."""

    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')

    DB_HOST     = os.getenv('DB_HOST', 'localhost')
    DB_PORT     = os.getenv('DB_PORT', '3306')
    DB_NAME     = os.getenv('DB_NAME', 'contact_book')
    DB_USER     = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
        f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    UPLOAD_FOLDER      = os.getenv('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    FRONTEND_URL       = os.getenv('FRONTEND_URL', 'http://localhost:3000')


class DevelopmentConfig(Config):
    DEBUG   = True
    TESTING = False


class ProductionConfig(Config):
    DEBUG   = False
    TESTING = False


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'