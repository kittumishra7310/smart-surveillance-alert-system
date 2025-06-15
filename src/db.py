
"""
Database Connection and ORM Models
----------------------------------
SQLAlchemy models and session setup.
"""

from sqlalchemy import create_engine, Column, Integer, String, Boolean, Float, Text, JSON, ForeignKey, TIMESTAMP
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from .config import config

Base = declarative_base()
engine = create_engine(config.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- USERS ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(32), unique=True, nullable=False)
    email = Column(String(64), unique=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    role = Column(String(16), default="viewer")

# --- CAMERA FEEDS ---
class CameraFeed(Base):
    __tablename__ = "camera_feeds"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(32), nullable=False)
    stream_url = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)

# --- DETECTIONS ---
class Detection(Base):
    __tablename__ = "detections"
    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(Integer, ForeignKey("camera_feeds.id"))
    timestamp = Column(TIMESTAMP, nullable=False)
    frame_path = Column(Text)
    label = Column(String(32))
    confidence = Column(Float)
    details = Column(JSON)

    camera = relationship("CameraFeed")

# --- ALERTS ---
class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    detection_id = Column(Integer, ForeignKey("detections.id"))
    alert_time = Column(TIMESTAMP)
    alert_type = Column(String(16))  # 'email' or 'sms'
    status = Column(String(16))      # 'sent', 'pending', etc
    recipient = Column(String(64))

    detection = relationship("Detection")

# Helper to create DB schema/tables if needed
def init_db():
    Base.metadata.create_all(bind=engine)
