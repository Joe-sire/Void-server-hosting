# API Contracts & Integration Plan

## Overview
This document outlines the API contracts between frontend and backend for the Minecraft Server Hosting platform.

## Mock Data to Backend Migration

### Current Mock Data (in `/app/frontend/src/mock.js`):
- `mockPlans` - Server hosting plans
- `mockFeatures` - Platform features
- `mockTestimonials` - Customer testimonials (will remain frontend-only)
- `mockFAQs` - FAQ items
- `mockServers` - User servers
- `mockConsoleLogs` - Server logs (will be mocked initially)
- `mockUser` / `mockAdmin` - User data

### Data to Move to Backend:
1. **Plans** - Store in MongoDB, editable by admins
2. **Features** - Store in MongoDB, editable by admins
3. **FAQs** - Store in MongoDB, editable by admins
4. **SiteContent** - Store hero section content in MongoDB
5. **Servers** - User's Minecraft servers
6. **Users** - User accounts with Google OAuth

---

## Database Models

### 1. User Model
```python
{
  _id: ObjectId,
  google_id: str,  # From Google OAuth
  email: str,
  name: str,
  avatar: str,  # Avatar initials or URL
  role: str,  # 'user' or 'admin'
  created_at: datetime,
  updated_at: datetime
}
```

### 2. Server Model
```python
{
  _id: ObjectId,
  user_id: ObjectId,  # Reference to User
  name: str,
  status: str,  # 'running', 'stopped', 'restarting'
  plan: str,  # Plan name
  players: str,  # e.g., "12/50"
  uptime: str,  # e.g., "99.9%"
  ip: str,
  port: str,
  version: str,
  created_at: datetime,
  updated_at: datetime
}
```

### 3. Plan Model
```python
{
  _id: ObjectId,
  name: str,
  description: str,
  price: float,
  ram: str,
  storage: str,
  slots: str,
  cpu: str,
  backups: str,
  support: str,
  featured: bool,
  order: int,  # Display order
  created_at: datetime,
  updated_at: datetime
}
```

### 4. Feature Model
```python
{
  _id: ObjectId,
  icon: str,  # Lucide icon name
  title: str,
  description: str,
  order: int,
  created_at: datetime,
  updated_at: datetime
}
```

### 5. FAQ Model
```python
{
  _id: ObjectId,
  question: str,
  answer: str,
  order: int,
  created_at: datetime,
  updated_at: datetime
}
```

### 6. SiteContent Model
```python
{
  _id: ObjectId,
  key: str,  # 'hero_title', 'hero_subtitle', 'hero_description'
  value: str,
  created_at: datetime,
  updated_at: datetime
}
```

---

## API Endpoints

### Authentication (Emergent Google OAuth)

#### POST `/api/auth/google`
- **Description**: Handle Google OAuth callback
- **Request Body**: `{ code: str, redirect_uri: str }`
- **Response**: `{ user: User, token: str }`
- **Frontend Usage**: After Google OAuth redirect

#### GET `/api/auth/me`
- **Description**: Get current authenticated user
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ user: User }`
- **Frontend Usage**: Check auth status on app load

#### POST `/api/auth/logout`
- **Description**: Logout user
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: str }`
- **Frontend Usage**: Logout button

---

### Public Endpoints

#### GET `/api/plans`
- **Description**: Get all server plans
- **Response**: `{ plans: [Plan] }`
- **Frontend Usage**: Landing page pricing section

#### GET `/api/features`
- **Description**: Get all features
- **Response**: `{ features: [Feature] }`
- **Frontend Usage**: Landing page features section

#### GET `/api/faqs`
- **Description**: Get all FAQs
- **Response**: `{ faqs: [FAQ] }`
- **Frontend Usage**: Landing page FAQ section

#### GET `/api/content`
- **Description**: Get site content
- **Response**: `{ content: {hero_title: str, hero_subtitle: str, hero_description: str} }`
- **Frontend Usage**: Landing page hero section

---

### User Endpoints (Authenticated)

#### GET `/api/servers`
- **Description**: Get user's servers
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ servers: [Server] }`
- **Frontend Usage**: Dashboard server list

#### POST `/api/servers`
- **Description**: Create new server
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{ name: str, plan: str, version: str }`
- **Response**: `{ server: Server }`
- **Frontend Usage**: Create server form

#### GET `/api/servers/:id`
- **Description**: Get server details
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ server: Server }`
- **Frontend Usage**: Server detail page

#### PUT `/api/servers/:id`
- **Description**: Update server settings
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{ name?: str, max_players?: int, game_mode?: str, difficulty?: str }`
- **Response**: `{ server: Server }`
- **Frontend Usage**: Server settings form

#### POST `/api/servers/:id/start`
- **Description**: Start server
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ server: Server }`
- **Frontend Usage**: Start button

#### POST `/api/servers/:id/stop`
- **Description**: Stop server
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ server: Server }`
- **Frontend Usage**: Stop button

#### POST `/api/servers/:id/restart`
- **Description**: Restart server
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ server: Server }`
- **Frontend Usage**: Restart button

#### GET `/api/servers/:id/console`
- **Description**: Get console logs
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ logs: [str] }`
- **Frontend Usage**: Console tab (mocked for now)

#### DELETE `/api/servers/:id`
- **Description**: Delete server
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: str }`
- **Frontend Usage**: Delete server button

---

### Admin Endpoints (Admin Only)

#### PUT `/api/admin/plans/:id`
- **Description**: Update plan
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{ name?: str, description?: str, price?: float, ... }`
- **Response**: `{ plan: Plan }`
- **Frontend Usage**: Admin panel plan editor

#### POST `/api/admin/plans`
- **Description**: Create plan
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{ name: str, description: str, price: float, ... }`
- **Response**: `{ plan: Plan }`
- **Frontend Usage**: Admin panel create plan

#### DELETE `/api/admin/plans/:id`
- **Description**: Delete plan
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: str }`
- **Frontend Usage**: Admin panel delete plan

#### PUT `/api/admin/features/:id`
- **Description**: Update feature
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{ title?: str, description?: str, icon?: str }`
- **Response**: `{ feature: Feature }`
- **Frontend Usage**: Admin panel feature editor

#### PUT `/api/admin/faqs/:id`
- **Description**: Update FAQ
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{ question?: str, answer?: str }`
- **Response**: `{ faq: FAQ }`
- **Frontend Usage**: Admin panel FAQ editor

#### POST `/api/admin/faqs`
- **Description**: Create FAQ
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{ question: str, answer: str }`
- **Response**: `{ faq: FAQ }`
- **Frontend Usage**: Admin panel add FAQ

#### DELETE `/api/admin/faqs/:id`
- **Description**: Delete FAQ
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ message: str }`
- **Frontend Usage**: Admin panel delete FAQ

#### PUT `/api/admin/content`
- **Description**: Update site content
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{ hero_title?: str, hero_subtitle?: str, hero_description?: str }`
- **Response**: `{ content: SiteContent }`
- **Frontend Usage**: Admin panel content editor

---

## Frontend Integration Steps

### 1. Authentication Flow
- Remove mock login
- Integrate Emergent Google OAuth
- Store JWT token in localStorage
- Add Authorization header to all authenticated requests
- Create axios instance with interceptors

### 2. Landing Page
- Fetch plans from `/api/plans`
- Fetch features from `/api/features`
- Fetch FAQs from `/api/faqs`
- Fetch hero content from `/api/content`

### 3. Dashboard
- Fetch servers from `/api/servers`
- Implement server controls (start/stop/restart)
- Fetch console logs (mocked initially)
- Update server settings

### 4. Admin Panel
- Fetch and update plans
- Fetch and update features
- Fetch, create, update, delete FAQs
- Update site content

### 5. Remove Mock Data
- Delete mock.js imports after backend integration
- Replace localStorage operations with API calls
- Add proper error handling and loading states

---

## Error Handling

All API endpoints should return consistent error format:
```json
{
  "error": "Error message",
  "details": "Additional details (optional)"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## Testing Checklist

### Backend:
- [ ] All CRUD endpoints working
- [ ] Authentication middleware working
- [ ] Admin-only routes protected
- [ ] Database models created
- [ ] Seed data populated

### Frontend:
- [ ] Remove mock.js imports
- [ ] Auth flow working
- [ ] Landing page fetches real data
- [ ] Dashboard server management working
- [ ] Admin panel CRUD operations working
- [ ] Error handling implemented
- [ ] Loading states added

---

## Notes

- Testimonials will remain frontend-only (no backend needed)
- Console logs will be mocked initially (real implementation requires actual server integration)
- Server actions (start/stop/restart) will update status in DB but won't control real servers yet
- Emergent Google OAuth will be used for authentication
