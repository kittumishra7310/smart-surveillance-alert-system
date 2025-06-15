
"""Helper functions, logging, smoothing, and fallbacks."""

import logging

def get_logger(name):
    logging.basicConfig(
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        level=logging.INFO
    )
    return logging.getLogger(name)

def smooth_detections(detections, alpha=0.5):
    """Basic exponential smoothing for detection confidence, reduces jitter."""
    if not detections:
        return []
    smoothed = [detections[0]]
    for d in detections[1:]:
        prev = smoothed[-1]
        smoothed.append(alpha * d + (1 - alpha) * prev)
    return smoothed

def fallback_on_error(func):
    """Decorator to fallback gracefully on error."""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            get_logger(func.__name__).error(f"Fallback triggered: {str(e)}")
            return None
    return wrapper
