# API Documentation

## Base URL

```
http://localhost:3000
```

## Response Format

All API responses follow a consistent format:

### Success Response

```json
{
  "success": true,
  "message": "Optional message",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### Health Check

#### Get Health Status

```
GET /health
```

**Response**: 200 OK

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "timestamp": "2024-01-30T12:00:00.000Z",
    "uptime": 123.456
  }
}
```

---

### Users

#### Get All Users

```
GET /api/v1/users
```

**Response**: 200 OK

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-30T12:00:00.000Z",
      "updatedAt": "2024-01-30T12:00:00.000Z"
    }
  ]
}
```

#### Get User by ID

```
GET /api/v1/users/:id
```

**Parameters**:

- `id` (path): User UUID

**Response**: 200 OK

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-30T12:00:00.000Z",
    "updatedAt": "2024-01-30T12:00:00.000Z"
  }
}
```

**Error Response**: 404 Not Found

```json
{
  "success": false,
  "error": "Resource not found"
}
```

#### Create User

```
POST /api/v1/users
```

**Request Body**:

```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Validation Rules**:

- `email`: Must be valid email format (required)
- `name`: 2-100 characters (required)

**Response**: 201 Created

```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-30T12:00:00.000Z",
    "updatedAt": "2024-01-30T12:00:00.000Z"
  }
}
```

**Error Response**: 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid email format"
}
```

#### Update User

```
PUT /api/v1/users/:id
```

**Parameters**:

- `id` (path): User UUID

**Request Body**:

```json
{
  "email": "newemail@example.com",
  "name": "Jane Doe"
}
```

**Validation Rules**:

- `email`: Must be valid email format (optional)
- `name`: 2-100 characters (optional)

**Response**: 200 OK

```json
{
  "success": true,
  "message": "Resource updated successfully",
  "data": {
    "id": "uuid",
    "email": "newemail@example.com",
    "name": "Jane Doe",
    "createdAt": "2024-01-30T12:00:00.000Z",
    "updatedAt": "2024-01-30T12:30:00.000Z"
  }
}
```

#### Delete User

```
DELETE /api/v1/users/:id
```

**Parameters**:

- `id` (path): User UUID

**Response**: 204 No Content

```json
{
  "success": true,
  "message": "Resource deleted successfully",
  "data": null
}
```

## Error Codes

| Status Code | Description                              |
| ----------- | ---------------------------------------- |
| 200         | OK - Request successful                  |
| 201         | Created - Resource created               |
| 204         | No Content - Successful deletion         |
| 400         | Bad Request - Invalid input              |
| 401         | Unauthorized - Authentication required   |
| 403         | Forbidden - Insufficient permissions     |
| 404         | Not Found - Resource not found           |
| 422         | Unprocessable Entity - Validation failed |
| 500         | Internal Server Error - Server error     |

## Rate Limiting

To be implemented based on requirements.

## Authentication

To be implemented based on requirements (JWT, OAuth, etc.).
