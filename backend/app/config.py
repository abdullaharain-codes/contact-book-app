import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY         = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_SECRET_KEY     = os.getenv('JWT_SECRET_KEY', os.getenv('SECRET_KEY', 'jwt-secret-key'))
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER      = os.getenv('UPLOAD_FOLDER', 'uploads')
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16 * 1024 * 1024))
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    FRONTEND_URL       = os.getenv('FRONTEND_URL', 'http://localhost:3000')

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
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
    DEBUG   = False
    TESTING = False

    @staticmethod
    def _build_db_uri():
        mysql_url = os.getenv('MYSQL_URL') or os.getenv('MYSQL_PUBLIC_URL')
        if mysql_url:
            return mysql_url.replace('mysql://', 'mysql+pymysql://', 1)
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
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


config = {
    'development': DevelopmentConfig,
    'production':  ProductionConfig,
    'testing':     TestingConfig,
    'default':     DevelopmentConfig,
}