
"""
Streamlit Frontend Main Entry
-----------------------------

This launches the Streamlit UI with login, file/camera input, history, and detection view.

Core features:
- Role-based login
- Upload/camera stream selection
- Real-time detection with annotation
- Timeline/history tab
- Admin: configure camera feeds, view alerts
"""

import streamlit as st
from src import detection, history, auth, alerting, camera, db, utils

st.set_page_config(page_title="Suspicious Human Activity Detection", layout="wide")
logger = utils.get_logger("app")

# ---- DB INIT ----
db.init_db()

# ---- Authentication ----
user = auth.login_widget()
if not user:
    st.stop()  # Block rest of app if not authenticated

st.sidebar.header("Navigation")
nav = st.sidebar.radio(
    "Navigation Menu", 
    ["Live Detection", "History", "Alerts", "Admin"] if user['role']=="admin" else ["Live Detection", "History"],
    label_visibility="collapsed"
)

if nav == "Live Detection":
    st.header("Real-time Suspicious Activity Detection")
    st.write("Upload a file or select a camera stream")
    input_type = st.radio("Input Source", ["File Upload", "Camera Feed"])
    if input_type == "File Upload":
        video_file = st.file_uploader("Upload video or image", type=["mp4", "avi", "jpg", "jpeg", "png", "gif", "bmp"])
        if video_file:
            detection.run_detection(video_file, user)
    else:
        camera_id = st.selectbox("Camera", camera.list_active_ids())
        if camera_id:
            detection.run_detection(camera_id, user, is_stream=True)
elif nav == "History":
    st.header("Detection Timeline / History")
    history.timeline_widget(user)
elif nav == "Alerts" and user["role"] == "admin":
    st.header("Sent Alerts")
    alerting.alerts_admin_panel()
elif nav == "Admin" and user["role"] == "admin":
    st.header("Admin Tools")
    camera.config_widget()
    auth.manage_users_widget()
    st.info("Configure access, add/remove cameras, and more.")
else:
    st.warning("Unauthorized or unknown route.")

# Add logging for user navigation
logger.info(f"User {user['username']} navigated to {nav}")
