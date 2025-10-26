# Quick Start Guide - PrimePlanner Frontend

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- Node.js 18+ and pnpm installed
- Backend running on `http://localhost:8080`

### Steps

1. **Install dependencies**
   ```bash
   cd prime_frontend
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   ```

3. **Open browser**
   Navigate to `http://localhost:3000`

## 📋 Quick Test Checklist

- [ ] Register new user at `/register`
- [ ] Auto-login and redirect to `/todos`
- [ ] Create a low priority todo
- [ ] Create a high priority todo
- [ ] Mark a todo as complete
- [ ] Delete a todo
- [ ] Logout from navbar
- [ ] Login again at `/login`
- [ ] Verify todos persisted

## 🔑 Key Files to Know

| File | Purpose |
|------|---------|
| `src/lib/api.ts` | API calls & TypeScript types |
| `src/context/AuthContext.tsx` | Authentication state management |
| `src/app/todos/page.tsx` | Main todo dashboard |
| `src/components/Navbar.tsx` | Navigation with auth state |
| `.env.local` | Backend API URL configuration |

## 🎨 Styling Guidelines

This project uses **TailwindCSS** with these conventions:

- **Colors**: Blue for primary actions (`bg-blue-600`, `hover:bg-blue-700`)
- **Spacing**: Use consistent spacing scale (`px-4`, `py-2`, `gap-4`)
- **Shadows**: `shadow-md` for cards, `shadow-lg` on hover
- **Transitions**: Always add `transition-colors` or `transition-shadow`
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints

## 🐛 Common Issues

### "Network Error" when logging in
- **Cause**: Backend not running
- **Fix**: Start backend with `./mvnw spring-boot:run` from `PrimePlanner/`

### "CORS Error"
- **Cause**: Backend CORS not configured for frontend origin
- **Fix**: Backend should allow `http://localhost:3000` in CORS config

### Token expired
- **Behavior**: Auto-logout and redirect to login
- **Expected**: Backend JWT expires after 15 minutes (900000ms)

### "Invalid credentials"
- **Cause**: Wrong email/password or user doesn't exist
- **Fix**: Register new user or check credentials

## 📦 Project Dependencies

```json
{
  "axios": "^1.12.2",        // HTTP client
  "next": "16.0.0",          // React framework
  "react": "19.2.0",         // UI library
  "tailwindcss": "^4"        // Styling
}
```

## 🔐 Authentication Tokens

**Storage**: localStorage (keys: `token`, `user`)

**Access token in code**:
```typescript
const { user, isAuthenticated, logout } = useAuth();
```

**Manual token check**:
```javascript
localStorage.getItem('token')
```

## 🛣️ Route Map

| Route | Auth Required | Description |
|-------|---------------|-------------|
| `/` | No | Landing page |
| `/login` | No | Login form |
| `/register` | No | Registration form |
| `/todos` | Yes | Todo dashboard |

## 📡 API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create todo |
| PUT | `/api/todos/:id` | Toggle complete |
| DELETE | `/api/todos/:id` | Delete todo |

## 💡 Tips for Development

1. **Hot Reload**: Changes auto-refresh in browser
2. **Console Errors**: Check browser console for API errors
3. **Network Tab**: Inspect API calls in DevTools
4. **React DevTools**: Install extension for component debugging
5. **Swagger UI**: Use `http://localhost:8080/docs` to test backend APIs

## 🎯 Next Steps

After basic integration works, consider:

1. Add todo editing functionality
2. Implement todo filtering (all/active/completed)
3. Add search functionality
4. Implement pagination
5. Add due dates to todos
6. Create todo categories
7. Add user profile page
8. Implement password reset flow
