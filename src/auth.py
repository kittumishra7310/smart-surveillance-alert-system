
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
    st.subheader("User Management")
    session = db.SessionLocal()
    users = session.query(db.User).all()
    # List users
    for u in users:
        col1, col2, col3, col4 = st.columns([4, 4, 4, 1])
        with col1:
            st.write(f"**{u.username}**")
        with col2:
            st.write(u.email)
        with col3:
            st.write(u.role)
        with col4:
            if st.button("Delete", key=f"del_user_{u.id}"):
                # STUB: real delete would be session.delete(u)
                st.warning(f"(STUB) User '{u.username}' would be deleted.")
                logger.info(f"User {u.username} delete requested (stub).")
    st.write("---")
    st.subheader("Add New User")
    with st.form("add_user_form"):
        new_username = st.text_input("Username")
        new_email = st.text_input("Email")
        new_pw = st.text_input("Password", type="password")
        new_role = st.selectbox("Role", ["admin", "viewer"])
        submitted = st.form_submit_button("Add User")
        if submitted:
            # STUB: add new user logic (hash password, etc)
            st.success(f"(STUB) User '{new_username}' would be added with role '{new_role}'.")
            logger.info(f"Add user: {new_username}, email: {new_email}, role: {new_role} (stub)")
    session.close()

