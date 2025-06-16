
"""
Suspicious Activity Detection Logic
----------------------------------
Handles file/camera input, runs ML inference, annotates and stores detection results.
"""

import streamlit as st
import numpy as np
import cv2
from src import db, utils

logger = utils.get_logger("detection")

def run_detection(input_source, user, is_stream=False):
    """
    Main entry for running detection—either on file upload or live stream.

    Args:
        input_source: File-like object or camera_id.
        user: dict representing the logged-in user.
        is_stream: True if the input_source is a camera feed.
    """
    logger.info(f"User {user['username']} started detection. Stream: {is_stream}")
    if is_stream:
        st.warning("Camera stream detection is a stub. (Integration needed for live video streams.)")
        st.info("Live stream handling will appear here when implemented.")
        return

    # File upload flow
    if input_source is None:
        st.info("Please upload a video or image file to begin detection.")
        return

    # Check if uploaded file is an image or video
    file_extension = input_source.name.split('.')[-1].lower()
    is_image = file_extension in ['jpg', 'jpeg', 'png', 'gif', 'bmp']
    
    # Save upload to a temp file and process with OpenCV
    import tempfile
    suffix = '.' + file_extension
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        temp_file.write(input_source.read())
        temp_path = temp_file.name

    if is_image:
        # Process single image
        st.image(temp_path, caption="Uploaded Image", use_column_width=True)
        st.write("Processing image for detection...")
        
        # Read image with OpenCV
        frame = cv2.imread(temp_path)
        if frame is None:
            st.error("Could not read the image file.")
            return
            
        # Dummy detection for demo
        detections = []
        h, w, _ = frame.shape
        detections.append({"box": [int(w*0.1), int(h*0.1), int(w*0.4), int(h*0.5)],
                          "label": "suspicious", "confidence": 0.87})
        
        annotated = annotate_frame(frame, detections)
        
        # Convert to RGB for Streamlit display (OpenCV is BGR)
        annotated = cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB)
        st.image(annotated, caption="Detection Results", use_column_width=True)
        st.success("Image detection complete (demo - replace with model inference).")
        
    else:
        # Process video file (existing logic)
        st.video(temp_path)
        st.write("Processing frames for detection...")

        video = cv2.VideoCapture(temp_path)
        frame_count = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
        idx = 0
        progress = st.progress(0, text="Running detection (stub)...")
        frame_placeholder = st.empty()

        while True:
            ret, frame = video.read()
            if not ret:
                break
            idx += 1

            # Dummy detection (draw rectangle every 20 frames for demo)
            detections = []
            if idx % 20 == 0:
                h, w, _ = frame.shape
                detections.append({"box": [int(w*0.1), int(h*0.1), int(w*0.4), int(h*0.5)],
                                   "label": "suspicious", "confidence": 0.92})

            annotated = annotate_frame(frame, detections)

            # Convert to RGB for Streamlit display (OpenCV is BGR)
            annotated = cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB)
            frame_placeholder.image(annotated, channels="RGB", caption=f"Frame {idx}/{frame_count}", use_column_width=True)
            progress.progress(min(idx / frame_count, 1.0), text=f"Frame {idx}/{frame_count}")

            # For demo, make update visible (limit to first 100 frames for speed)
            if idx > 100:
                st.info("Early stopping after 100 frames (demo limit).")
                break

        video.release()
        st.success("Detection complete (demo - replace with model inference).")

def annotate_frame(frame, detections):
    """
    Draw bounding boxes/labels on the frame.
    Args:
        frame (np.ndarray): Input video frame.
        detections (list[dict]): List of detection dicts.
    Returns:
        np.ndarray: Annotated frame.
    """
    annotated = frame.copy()
    for det in detections:
        box = det.get("box", [])
        label = det.get("label", "object")
        confidence = det.get("confidence", 0.99)
        if len(box) == 4:
            x, y, x2, y2 = box
            color = (0, 0, 255)  # Red box for suspicious
            cv2.rectangle(annotated, (x, y), (x2, y2), color, 2)
            text = f"{label} ({int(confidence*100)}%)"
            cv2.putText(annotated, text, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
    return annotated

# ... keep existing code (other functions, stubs) the same ...
