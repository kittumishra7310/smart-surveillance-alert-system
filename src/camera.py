
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
    # TODO: Query db.SessionLocal for active feeds. Stub with [1, 2, 3]:
    return [1, 2, 3]

def config_widget():
    """
    Streamlit UI component for admin to add/edit/remove camera feeds.
    """
    import streamlit as st
    st.write("Camera feed configuration UI stub.")

