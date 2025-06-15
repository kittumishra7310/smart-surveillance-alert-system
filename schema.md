
# Database Schema

## Table Definitions

### users
| Column        | Type          | Constraints         | Description                  |
|---------------|---------------|---------------------|------------------------------|
| id            | SERIAL        | PRIMARY KEY         | Unique user identifier       |
| username      | VARCHAR(32)   | UNIQUE, NOT NULL    | User login                   |
| email         | VARCHAR(64)   | UNIQUE, NOT NULL    | User email                   |
| password_hash | VARCHAR(128)  | NOT NULL            | Hashed password              |
| role          | VARCHAR(16)   | DEFAULT 'viewer'    | ('admin','viewer')           |

### camera_feeds
| Column      | Type         | Constraints         | Description                   |
|-------------|--------------|---------------------|-------------------------------|
| id          | SERIAL       | PRIMARY KEY         | Feed ID                       |
| name        | VARCHAR(32)  | NOT NULL            | Display name                  |
| stream_url  | TEXT         | NOT NULL            | RTSP/HTTP stream or filepath  |
| is_active   | BOOLEAN      | DEFAULT TRUE        | Feed status                   |

### detections
| Column      | Type         | Constraints         | Description                |
|-------------|--------------|---------------------|----------------------------|
| id          | SERIAL       | PRIMARY KEY         | Detection record ID        |
| camera_id   | INT          | FOREIGN KEY         | References camera_feeds    |
| timestamp   | TIMESTAMP    | NOT NULL            | Detection time             |
| frame_path  | TEXT         |                     | Optional image path        |
| label       | VARCHAR(32)  |                     | Detected activity/class    |
| confidence  | FLOAT        |                     | Model confidence           |
| details     | JSONB        |                     | Extra info/coords/etc      |

### alerts
| Column      | Type         | Constraints         | Description                  |
|-------------|--------------|---------------------|------------------------------|
| id          | SERIAL       | PRIMARY KEY         | Alert ID                     |
| detection_id| INT          | FOREIGN KEY         | References detections        |
| alert_time  | TIMESTAMP    |                     | When alert sent              |
| alert_type  | VARCHAR(16)  |                     | 'email' or 'sms'             |
| status      | VARCHAR(16)  |                     | 'sent', 'pending', 'failed'  |
| recipient   | VARCHAR(64)  |                     | Phone/email                  |

---

## ER Diagram

```
+---------+       +--------------+        +-----------+        +--------+
| users   |       | camera_feeds |        | detections|        | alerts |
+---------+       +--------------+        +-----------+        +--------+
| id (PK) |<--+   | id (PK)      |<--+    | id (PK)   |<--+    | id (PK)|
| ...     |   |   | ...          |   |    | camera_id |   |    | ...    |
+---------+   |   +--------------+   |    | timestamp |   |    +--------+
              |                      |    | ...       |   |
              +----------------------+    +-----------+   |
```
Legend:  
- A user can access multiple camera feeds (not explicitly shown; add access control as needed).
- Each detection is from one camera feed.
- Each alert links to one detection.

---

## Relationships

- **detections.camera_id** → camera_feeds.id
- **alerts.detection_id** → detections.id

---

# Instructions

- Recommended DB: PostgreSQL (for JSONB and relational features)
- See `src/db.py` for ORM/model implementation

