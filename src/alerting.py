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
    import pandas as pd

    session = db.SessionLocal()
    logger.info("Admin accessed all-sent-alerts panel.")

    st.write("## Sent Alerts (Admin)")
    alerts = (
        session.query(db.Alert)
        .order_by(db.Alert.alert_time.desc())
        .limit(200)
        .all()
    )
    data = []
    for a in alerts:
        detection = a.detection
        detection_str = (
            f"[{detection.timestamp.strftime('%Y-%m-%d %H:%M:%S')}] {detection.label} (Cam {detection.camera_id})"
            if detection is not None else f"Detection {a.detection_id}"
        )
        data.append({
            "Alert Time": a.alert_time.strftime("%Y-%m-%d %H:%M:%S") if a.alert_time else "-",
            "Type": a.alert_type,
            "Recipient": a.recipient or "-",
            "Status": a.status or "-",
            "Detection": detection_str,
        })

    if not data:
        st.info("No alerts sent yet.")
        session.close()
        return

    df = pd.DataFrame(data)
    st.dataframe(df, use_container_width=True)

    session.close()
