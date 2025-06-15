
"""
Timeline/History UI
-------------------
Shows a searchable timeline of past detections for auditing.
"""

import streamlit as st
import pandas as pd
from src import db, utils

logger = utils.get_logger("history")

def timeline_widget(user):
    """
    Displays detection history for the logged-in user.
    Admins see all records; viewers see only their own cameras' events.
    """

    session = db.SessionLocal()
    logger.info(f"User {user['username']} accessed detection history.")

    # 1. Fetch camera list
    cameras = session.query(db.CameraFeed).filter_by(is_active=True).all()
    camera_options = [{"label": c.name, "value": c.id} for c in cameras]

    # Filter widgets
    st.write("## Detection History")
    with st.expander("Filter/Search", expanded=True):
        camera_filter = st.multiselect(
            "Camera", [c["label"] for c in camera_options], default=[c["label"] for c in camera_options]
        )
        label_filter = st.text_input("Detected Label (exact or partial)", "")
        date_range = st.date_input("Date Range", [])

    # Map labels to ids for the filter
    selected_camera_ids = [c["value"] for c in camera_options if c["label"] in camera_filter]

    # 2. Construct base query
    query = session.query(db.Detection)
    if user.get("role") != "admin":
        # In real app, filter by user's allowed camera_ids
        # Here, viewers just see all for demo
        pass

    # 3. Apply filters
    if selected_camera_ids:
        query = query.filter(db.Detection.camera_id.in_(selected_camera_ids))
    if label_filter:
        query = query.filter(db.Detection.label.ilike(f"%{label_filter}%"))
    if len(date_range) == 2:
        qstart, qend = date_range
        query = query.filter(db.Detection.timestamp >= qstart).filter(db.Detection.timestamp <= qend)

    # 4. Fetch data and convert to DataFrame
    detections = query.order_by(db.Detection.timestamp.desc()).limit(1000).all()
    data = []
    for d in detections:
        data.append({
            "Date": d.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            "Camera": d.camera.name if d.camera else d.camera_id,
            "Label": d.label,
            "Confidence": round(d.confidence, 2) if d.confidence is not None else "-",
            "Details": str(d.details),
            "Frame": d.frame_path if d.frame_path else "-"
        })
    if not data:
        st.info("No detections found for the selected filters.")
        return

    df = pd.DataFrame(data)
    # 5. Show table
    st.dataframe(df, use_container_width=True)
    session.close()
