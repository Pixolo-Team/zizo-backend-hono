# Zizo Database Schema Documentation

This document describes the backend database structure used by **Zizo**.

It is designed to help developers and AI agents understand:

- Tables
- Relationships
- Foreign keys
- Data structure
- Functional intent of each entity

---

# Database Overview

The Zizo database manages:

- Users
- Organisations
- Members
- Players
- Guardians
- Training batches
- Training sessions
- Attendance tracking

Primary concepts:

- **Users authenticate through Supabase Auth**
- **Organisations contain members and players**
- **Players may or may not have user accounts**
- **Sessions are created from templates**
- **Attendance is tracked for both players and staff**

---

# Tables

---

# 1. Users

Represents authenticated users from Supabase Auth.

| Column            | Type               | Description                             |
| ----------------- | ------------------ | --------------------------------------- |
| auth_id           | FK (Supabase Auth) | Unique user identifier                  |
| first_name        | text               | User first name                         |
| last_name         | text               | User last name                          |
| phone_number      | text               | User Phone Number                       |
| profile_photo_url | text               | Profile image URL                       |
| is_active         | boolean            | Indicates if the user account is active |

---

# 2. Organisations

Represents clubs, academies, or schools.

| Column   | Type | Description             |
| -------- | ---- | ----------------------- |
| id       | PK   | Unique organisation ID  |
| name     | text | Organisation name       |
| org_type | enum | club / academy / school |

---

# 3. Organisation_Members

Represents users that belong to an organisation.

| Column          | Type                  | Description                     |
| --------------- | --------------------- | ------------------------------- |
| id              | PK                    | Organisation member ID          |
| organization_id | FK → Organisations.id | Organisation reference          |
| auth_id         | FK → Users.auth_id    | User reference                  |
| is_active       | boolean               | Active membership status        |
| created_on      | timestamp             | Date the membership was created |

---

# 4. Organisation_Member_Role

Stores roles assigned to organisation members.

| Column                 | Type                         | Description                                        |
| ---------------------- | ---------------------------- | -------------------------------------------------- |
| organisation_member_id | FK → Organisation_Members.id | Member reference                                   |
| role                   | text                         | Role within organisation (coach, admin, staff etc) |
| is_primary             | boolean                      | Indicates primary role                             |

---

# 5. Players

Represents players participating in training.

Players **may or may not have a user account**.

Examples:

- Child player registered by parent
- Adult player with their own login

| Column            | Type                                    | Description                 |
| ----------------- | --------------------------------------- | --------------------------- |
| id                | PK                                      | Player ID                   |
| auth_id           | FK → Users.auth_id (nullable)           | Player user account         |
| org_member_id     | FK → Organisation_Members.id (nullable) | Player who is also a member |
| first_name        | text                                    | Player first name           |
| last_name         | text                                    | Player last name            |
| profile_photo_url | text                                    | Profile image               |
| created_on        | timestamp                               | Creation date               |
| is_active         | boolean                                 | Player active status        |

---

# 6. Player_Guardians

Defines guardian relationships for players.

Used when **players do not own a phone or account**.

| Column    | Type               | Description      |
| --------- | ------------------ | ---------------- |
| player_id | FK → Players.id    | Player reference |
| auth_id   | FK → Users.auth_id | Guardian user    |

A player may have **multiple guardians**.

---

# 7. Organisation_Player

Links players to organisations.

| Column                | Type                  | Description                              |
| --------------------- | --------------------- | ---------------------------------------- |
| id                    | PK                    | Unique mapping ID                        |
| organisation_id       | FK → Organisations.id | Organisation                             |
| player_id             | FK → Players.id       | Player                                   |
| is_active             | boolean               | Active status                            |
| identification_number | text                  | Organisation specific ID / jersey number |

---

# 8. Sessions_Template

Defines recurring session schedules.

| Column               | Type    | Description      |
| -------------------- | ------- | ---------------- |
| id                   | PK      | Template ID      |
| start_date           | date    | Start date       |
| end_date             | date    | End date         |
| recurrence_days      | array   | Days of week     |
| recurrence_frequency | integer | Frequency value  |
| frequency_type       | enum    | weekly / monthly |

---

# 9. Batches

Represents training groups within an organisation.

| Column          | Type                  | Description       |
| --------------- | --------------------- | ----------------- |
| id              | PK                    | Batch ID          |
| organization_id | FK → Organisations.id | Organisation      |
| name            | text                  | Batch name        |
| description     | text                  | Batch description |

---

# 10. Batch_Player

Maps players to batches.

| Column     | Type            | Description |
| ---------- | --------------- | ----------- |
| batch_id   | FK → Batches.id | Batch       |
| player_id  | FK → Players.id | Player      |
| start_date | date            | Batch start |
| end_date   | date            | Batch end   |

---

# 11. Batch_Member

Maps organisation staff members to batches.

| Column                 | Type                         | Description                          |
| ---------------------- | ---------------------------- | ------------------------------------ |
| batch_id               | FK → Batches.id              | Batch                                |
| organization_member_id | FK → Organisation_Members.id |
| auth_id                | FK → Users.auth_id           |
| role                   | text                         | Role in batch (coach, assistant etc) |

---

# 12. Sessions

Represents individual training sessions.

Sessions may be created manually or from a template.

| Column              | Type                      | Description                       |
| ------------------- | ------------------------- | --------------------------------- |
| id                  | PK                        | Session ID                        |
| name                | text                      | Session name                      |
| date                | date                      | Session date                      |
| start_time          | time                      | Session start                     |
| end_time            | time                      | Session end                       |
| reporting_time      | time                      | Reporting time                    |
| venue_id            | FK                        | Venue reference                   |
| status              | enum                      | scheduled / completed / cancelled |
| session_type        | text                      | Type of session                   |
| session_template_id | FK → Sessions_Template.id | Template reference                |
| created_at          | timestamp                 | Created timestamp                 |
| updated_at          | timestamp                 | Last updated                      |

---

# 13. Session_Member

Defines staff members assigned to sessions.

| Column                 | Type                         | Description     |
| ---------------------- | ---------------------------- | --------------- |
| session_id             | FK → Sessions.id             | Session         |
| organization_member_id | FK → Organisation_Members.id |
| auth_id                | FK → Users.auth_id           |
| session_role           | text                         | Role in session |

Examples:

- Coach
- Assistant Coach
- Physio

---

# 14. Session_Player_Attendance

Tracks player attendance.

| Column     | Type               | Description             |
| ---------- | ------------------ | ----------------------- |
| session_id | FK → Sessions.id   |
| player_id  | FK → Players.id    |
| status     | enum               | present / absent / late |
| marked_by  | FK → Users.auth_id |

---

# 15. Session_Member_Attendance

Tracks attendance for organisation staff.

| Column                 | Type                         | Description      |
| ---------------------- | ---------------------------- | ---------------- |
| session_id             | FK → Sessions.id             |
| organization_member_id | FK → Organisation_Members.id |
| auth_id                | FK → Users.auth_id           |
| clock_in_time          | timestamp                    |
| clock_in_location      | text                         |
| clock_out_time         | timestamp                    |
| clock_out_location     | text                         |
| status                 | enum                         | present / absent |

---
