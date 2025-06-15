
# Suspicious Human Activity Detection

## Overview
A scalable, production-ready system for computer vision-based suspicious activity detection in security/surveillance settings.

---

## 📁 Folder Structure

```
project-root/
│
├── src/                    # Source code for Streamlit app and backend logic
│   ├── __init__.py
│   ├── app.py              # Main Streamlit app entry
│   ├── detection.py        # Computer vision/ML pipeline
│   ├── history.py          # Timeline/history features
│   ├── auth.py             # Role-based access control
│   ├── alerting.py         # Email/SMS alert logic
│   ├── camera.py           # Multi-stream camera management
│   ├── db.py               # Database connection and models
│   ├── config.py           # Config and settings
│   └── utils.py            # Helper functions (logging, smoothing, etc)
│
├── models/                 # ML models/data & related utils
│   ├── suspicious_activity_model.pkl
│   └── ... (any other models)
│
├── data/                   # Example datasets, videos for demo
│   ├── example_video.mp4
│   └── ...
│
├── docker/
│   ├── Dockerfile          # For Streamlit app
│   └── docker-compose.yaml # Compose file for app+db
│
├── requirements.txt        # Python dependencies
├── setup.sh                # Quick setup script
├── README.md               # This documentation
└── schema.md               # Database schema and ER diagram
```

---

## Database Schema

**Tables:**

- **users**: id (PK), username, email, password_hash, role
- **camera_feeds**: id (PK), name, stream_url, is_active
- **detections**: id (PK), camera_id (FK), timestamp, frame_path, label, confidence, details
- **alerts**: id (PK), detection_id (FK), alert_time, alert_type (sms/email), status, recipient

See [schema.md](./schema.md) for a detailed breakdown.

---

## ER Diagram

See **schema.md** for an entity relationship diagram (textual).

---

## Installation

```bash
git clone https://github.com/SHAURYABA05/Suspicious-Human-Activity-Detection.git
cd Suspicious-Human-Activity-Detection
bash setup.sh
```

Or, for manual setup:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Set up .env with DB credentials as needed
```

---

## Running (Locally)

```bash
# For Streamlit App
cd src
streamlit run app.py
```

---

## Dockerized Deployment

See [docker/docker-compose.yaml](./docker/docker-compose.yaml) and [docker/Dockerfile](./docker/Dockerfile) for the easiest deployment.

```bash
docker-compose -f docker/docker-compose.yaml up --build
```

---

## Key Features

- File upload or camera feed for live detection
- Annotated outputs with confidence scores
- Detection timeline/history view
- Role-based access control
- Robust detection pipeline (smoothing, fallback logic)
- Real-time multi-streaming
- Alerting (SMS/email)

---

## Documentation

- **src/**: All business logic, UI, and backend code.
- **models/**: Store trained models.
- **data/**: Demo datasets/videos for testing.
- **docker/**: Deployment configs.
- **README.md**: This walkthrough.
- **schema.md**: Database and ERD.

---

## Logging

All important operations are logged with Python’s built-in logging module (see `src/utils.py`).

---

## Next Steps

Follow the files in the `src/` directory. All functions/classes are commented for clarity.  
If you need further guidance (API docs, frontend extensions, etc.) check back here or ask your assistant!

