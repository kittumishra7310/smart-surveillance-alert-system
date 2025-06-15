
"""
Alerting (Email/SMS/Notifications)
----------------------------------
Handles sending alerts on suspicious detections.
"""

from src import db, utils

logger = utils.get_logger("alerting")

def send_alert(detection_id, alert_type="email", recipient=None):
    """
    Sends an alert (email or SMS) about a detection.
    Args:
        detection_id (int): ID of detection that triggered alert.
        alert_type (str): 'email' or 'sms'
        recipient (str): Target email address or phone number.
    """
    logger.info(f"Triggered {alert_type} alert for detection {detection_id} to {recipient} (stub)")
    # TODO: Integrate with email/SMS sending (Twilio, SMTP, etc.)
    # Stub: simply log and return
    return True

def alerts_admin_panel():
    """
    Admin UI for viewing and managing all alerts sent.
    """
    import streamlit as st
    st.write("Alert admin panel stub.")

