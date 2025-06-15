
"""
Configuration and Environment Variables

Edit this file to configure DB, secret keys, model paths, alerting, etc.
"""

import os

class Config:
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost:5432/suspicious_activity")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Secret keys (for auth, JWT, etc.)
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
    JWT_SECRET = os.getenv("JWT_SECRET", "your-jwt-secret")
    
    # Model/ML paths
    MODEL_PATH = os.getenv("MODEL_PATH", "models/suspicious_activity_model.pkl")
    # Email/SMS config, add as needed:
    EMAIL_SENDER = os.getenv("EMAIL_SENDER", "security@yourdomain.com")
    TWILIO_SID = os.getenv("TWILIO_SID", "")
    TWILIO_TOKEN = os.getenv("TWILIO_TOKEN", "")
    TWILIO_PHONE = os.getenv("TWILIO_PHONE", "")

config = Config()
