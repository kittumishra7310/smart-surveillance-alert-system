
"""
Timeline/History UI
-------------------
Shows a searchable timeline of past detections for auditing.
"""

import streamlit as st
from src import db, utils

logger = utils.get_logger("history")

def timeline_widget(user):
    """
    Displays detection history for the logged-in user.
    """
    logger.info(f"User {user['username']} accessed detection history.")
    st.write("History UI stub. Display searchable table of detections here.")
    # TODO: Query DB for past detections, implement filtering/search
