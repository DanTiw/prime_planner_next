# Frontend Integration Guide

## 🚀 Overview
This document outlines the complete integration between the Next.js frontend and Spring Boot backend for PrimePlanner.

## 📁 Project Structure

```
prime_frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout with AuthProvider
│   │   ├── page.tsx              # Landing page
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── register/
│   │   │   └── page.tsx          # Registration page
│   │   └── todos/
│   │       └── page.tsx          # Todo dashboard (protected)
│   ├── components/
│   │   ├── Navbar.tsx            # Navigation component
│   │   ├── Toast.tsx             # Toast notifications
│   │   └── LoadingSpinner.tsx   # Loading states
│   ├── context/
│   │   └── AuthContext.tsx       # Authentication context & hooks
│   └── lib/
│       └── api.ts                # API utilities & TypeScript types
├── .env.local                    # Environment variables
└── package.json
```

## 🔧 Setup Instructions

### 1. Install Dependencies
```bash
cd prime_frontend
pnpm install
```

### 2. Configure Environment
Create `.env.local` in the frontend root:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Start Development Servers

**Backend:**
```bash
cd PrimePlanner
./mvnw spring-boot:run
```

**Frontend:**
```bash
cd prime_frontend
pnpm dev
```

Access the application at `http://localhost:3000`

## 🔐 Authentication Flow

### User Registration
1. User submits registration form at `/register`
2. Frontend sends POST to `/api/auth/register`
3. Backend creates user and returns JWT token + user data
4. Frontend stores token in localStorage
5. User redirected to `/todos` dashboard

### User Login
1. User submits credentials at `/login`
2. Frontend sends POST to `/api/auth/login`
3. Backend validates credentials and returns JWT + user data
4. Frontend stores token and redirects to `/todos`

### Protected Routes
- All API requests include `Authorization: Bearer <token>` header
- 401 responses automatically clear auth state and redirect to login
- `useAuth` hook provides authentication state throughout the app

### Logout
- Clears localStorage (token + user data)
- Redirects to `/login`

## 🛠️ API Integration

### API Helper (`lib/api.ts`)

**Features:**
- Axios instance with base URL configuration
- Automatic JWT token attachment via request interceptor
- Global error handling via response interceptor
- TypeScript types for all entities and requests
- Structured error message extraction

**Available APIs:**

```typescript
// Authentication
authApi.login(credentials)      // Login user
authApi.register(userData)       // Register new user
authApi.getCurrentUser()         // Get current user details

// Todos
todoApi.getAll()                // Get all user's todos
todoApi.create(todoRequest)     // Create new todo
todoApi.toggleComplete(id)      // Toggle todo completion
todoApi.delete(id)              // Delete todo
```

### TypeScript Types

All backend entities are typed on the frontend:
- `User` - User entity with profile info
- `Todo` - Todo entity with title, description, priority, complete status
- `AuthenticationRequest` - Login credentials
- `RegisterRequest` - Registration data
- `TodoRequest` - Todo creation/update data
- `ApiError` - Structured error response from backend

## 🎨 UI Components

### Toast Notifications
- Auto-dismissing notifications (3s default)
- Types: success, error, info
- Displays API errors and success messages

### Loading States
- `LoadingSpinner` - Inline spinner for buttons
- `FullPageLoader` - Full screen loading indicator

### Navbar
- Dynamic display based on authentication state
- Shows user name when logged in
- Login/Register buttons for guests
- Logout button for authenticated users

## 🔒 Security Features

1. **Token Storage**: JWT stored in localStorage
2. **Auto-logout**: 401 responses clear auth state
3. **Protected Routes**: Redirect to login if not authenticated
4. **CSRF Protection**: Stateless JWT authentication
5. **XSS Protection**: React's built-in escaping

## 📱 Pages Overview

### Landing Page (`/`)
- Hero section with app description
- Call-to-action buttons (Get Started, Sign In)
- Feature highlights

### Login Page (`/login`)
- Email and password fields
- Form validation
- Error handling with toast notifications
- Link to registration

### Register Page (`/register`)
- First name, last name, email, password fields
- Password confirmation validation
- Client-side validation before submission
- Auto-login after successful registration

### Todos Dashboard (`/todos`)
- Protected route (requires authentication)
- List all user's todos
- Create new todo with priority selection
- Toggle todo completion
- Delete todos with confirmation
- Priority badges (Low/Medium/High)
- Empty state with call-to-action

## 🎯 Key Features

### Todo Management
- **Create**: Form with title, description, priority (1-3)
- **Read**: Display all todos with visual indicators
- **Update**: Toggle completion status
- **Delete**: Remove todo with confirmation

### Priority System
- **Low (1)**: Green badge
- **Medium (2)**: Yellow badge
- **High (3)**: Red badge

### UX Enhancements
- Loading states during API calls
- Error handling with user-friendly messages
- Success notifications for actions
- Responsive design (mobile-friendly)
- Smooth transitions and hover effects

## 🐛 Error Handling

### API Errors
- Axios interceptor catches all API errors
- Structured error extraction from backend format
- Toast notifications display error messages
- 401 errors trigger automatic logout

### Form Validation
- Required field validation
- Email format validation
- Password strength requirements
- Password confirmation matching

## 🚀 Performance Optimizations

1. **Code Splitting**: Next.js automatic route-based splitting
2. **Client-Side Navigation**: SPA-like navigation with Next.js router
3. **Optimistic Updates**: Immediate UI updates, reverting on error
4. **Local State Management**: Context API for authentication state

## 📝 Testing the Integration

### Manual Testing Steps

1. **Start both servers** (backend on 8080, frontend on 3000)
2. **Register a new user**
   - Navigate to `/register`
   - Fill form and submit
   - Verify redirect to `/todos`
3. **Create todos**
   - Click "Add Todo"
   - Fill form with various priorities
   - Verify todos appear in list
4. **Update todos**
   - Click checkbox to mark complete
   - Verify visual update (strikethrough, opacity)
5. **Delete todos**
   - Click delete icon
   - Confirm deletion
   - Verify todo removed from list
6. **Logout and Login**
   - Click logout
   - Verify redirect to login
   - Login with credentials
   - Verify todos persist

## 🔄 Future Enhancements

Potential improvements:
- Edit existing todos
- Filter/sort todos by priority or completion
- Search functionality
- Drag-and-drop reordering
- Due dates and reminders
- Categories/tags
- Dark mode toggle
- Pagination for large todo lists
- Bulk operations (delete multiple, mark all complete)
- Export todos to PDF/CSV

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
- Backend API: `http://localhost:8080/docs` (Swagger UI)
