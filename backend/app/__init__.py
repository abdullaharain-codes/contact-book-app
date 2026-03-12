from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from dotenv import load_dotenv
import os

db = SQLAlchemy()
migrate = Migrate()
ma = Marshmallow()

def create_app(config_object=None):
    load_dotenv()
    app = Flask(__name__)

    if config_object:
        app.config.from_object(config_object)
    else:
        app.config.from_object('app.config.DevelopmentConfig')

    db.init_app(app)
    migrate.init_app(app, db)
    ma.init_app(app)

    CORS(app, resources={
        r"/api/*": {
            "origins": app.config.get('FRONTEND_URL', 'http://localhost:3000'),
            "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    from app.routes.contacts import contacts_bp
    app.register_blueprint(contacts_bp, url_prefix='/api/contacts')

    upload_folder = app.config.get('UPLOAD_FOLDER', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)

    # ✅ Import models so Alembic detects them during migrations
    with app.app_context():
        from app.models.contact import Contact  # noqa: F401

    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'Contact Book API is running'}

    return app