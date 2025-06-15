
"""
Authentication and User Management
----------------------------------
Login widget, role-based access control, registration.
"""

import streamlit as st
from src import db, utils

logger = utils.get_logger("auth")

def login_widget():
    """
    Shows a login form, returns user dict on success.
    """
    st.sidebar.header("User Login")
    username = st.sidebar.text_input("Username")
    password = st.sidebar.text_input("Password", type="password")
    login_btn = st.sidebar.button("Login")
    if login_btn:
        # TODO: Validate credentials using db. Return user dict with role.
        # This is a stub: always returns admin for demo
        st.success(f"Logged in as {username} (admin, STUB)")
        logger.info(f"User {username} logged in (stub).")
        return {"username": username, "role": "admin"}
    return None

def manage_users_widget():
    """
    Shows admin UI for viewing/adding/removing users.
    """
    st.write("User management stub. Admins can manage users here.")

