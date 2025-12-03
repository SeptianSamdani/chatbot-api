# Chatbot API - AdonisJS v6

REST API untuk sistem chatbot menggunakan AdonisJS v6 dan PostgreSQL.

## Features
- ✅ Kirim pertanyaan ke chatbot eksternal
- ✅ Simpan conversation & messages
- ✅ List semua conversations dengan pagination
- ✅ Detail conversation dengan messages
- ✅ Delete conversation & messages
- ✅ Validasi input
- ✅ Basic Authorization
- ✅ Filter & Pagination

## Tech Stack
- AdonisJS v6
- PostgreSQL
- Axios
- VineJS (Validation)

## Installation

### 1. Clone & Install
```bash
git clone <repo-url>
cd chatbot-api
npm install
```

### 2. Setup Database
```bash
# Buat database PostgreSQL
createdb chatbot_db

# Copy .env
cp .env.example .env

# Generate APP_KEY
node ace generate:key
```

### 3. Konfigurasi .env
```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=chatbot_db
```

### 4. Run Migration
```bash
node ace migration:run
```

### 5. Start Server
```bash
npm run dev
```

## API Endpoints

### 1. Send Question
**POST** `/questions`

Request:
```json
{
  "question": "ada layanan apa di majadigi?",
  "session_id": "optional-session-id"
}
```

Response:
```json
{
  "session_id": "031153f2-e4e4-4c45-aff6-a7cb3e35ee54",
  "question": "ada layanan apa di majadigi?",
  "answer": "...",
  "conversation_id": 1
}
```

### 2. Get All Conversations
**GET** `/conversations?page=1&limit=10&session_id=xxx`

Headers:
```
Authorization: Bearer secret-token-123
```

Response:
```json
{
  "meta": {...},
  "data": [...]
}
```

### 3. Get Conversation Detail
**GET** `/conversations/:id`

Headers:
```
Authorization: Bearer secret-token-123
```

### 4. Delete Conversation
**DELETE** `/conversations/:id`

Headers:
```
Authorization: Bearer secret-token-123
```

### 5. Delete Message
**DELETE** `/conversations/:id/messages/:messageId`

Headers:
```
Authorization: Bearer secret-token-123
```

## Database Schema

### Conversations
- id (primary key)
- session_id (unique)
- last_message
- created_at
- updated_at

### Messages
- id (primary key)
- conversation_id (foreign key)
- sender_type (enum: 'user', 'bot')
- message
- created_at
- updated_at

## Testing

Test dengan Postman/Thunder Client:
1. POST /questions - tidak perlu auth
2. GET /conversations - perlu auth header
3. GET /conversations/1 - perlu auth header
4. DELETE /conversations/1 - perlu auth header

## Author
Septian Samdani