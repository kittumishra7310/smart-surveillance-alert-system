
"""
Camera Feed Management
---------------------
Handles registration, listing, and configuration of camera streams.
"""

from src import db, utils

logger = utils.get_logger("camera")

def list_active_ids():
    """
    Returns list of active camera feed IDs (for dropdowns etc).
    """
    # Query db.SessionLocal for active feeds.
    session = db.SessionLocal()
    ids = [
        cam.id
        for cam in session.query(db.CameraFeed).filter_by(is_active=True).all()
    ]
    session.close()
    return ids if ids else []

def config_widget():
    """
    Streamlit UI component for admin to add/edit/remove camera feeds.
    """
    import streamlit as st

    session = db.SessionLocal()

    st.subheader("Manage Camera Feeds")
    cams = session.query(db.CameraFeed).all()
    if not cams:
        st.info("No camera feeds registered. Add one below.")

    # List cameras
    for c in cams:
        col1, col2, col3, col4 = st.columns([4, 4, 4, 1])
        with col1:
            st.write(f"**{c.name}**")
        with col2:
            st.write(f"URL: {c.stream_url}")
        with col3:
            st.write("Active" if c.is_active else "Inactive")
        with col4:
            if st.button("Delete", key=f"del_cam_{c.id}"):
                # STUB: real delete would be session.delete(c)
                st.warning(f"(STUB) Camera '{c.name}' would be deleted.")
                logger.info(f"Camera {c.id} delete requested (stub).")

    st.write("---")
    st.subheader("Add New Camera Feed")
    with st.form("add_camera_form"):
        new_name = st.text_input("Camera Name")
        new_url = st.text_input("Stream URL (RTSP/HTTP/Filepath)")
        new_active = st.checkbox("Active?", value=True)
        submitted = st.form_submit_button("Add Camera")
        if submitted:
            # STUB: add new CameraFeed to DB here.
            st.success(f"(STUB) Camera '{new_name}' would be added.")
            logger.info(f"Camera add requested: name={new_name}, url={new_url}, active={new_active} (stub)")

    session.close()
