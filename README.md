# PrimePlanner - Frontend

A modern, responsive todo application built with Next.js 16, React 19, and TailwindCSS 4.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Backend server running on `http://localhost:8080`

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS 4
- **HTTP Client**: Axios
- **Language**: TypeScript
- **State Management**: React Context API

## 📁 Project Structure

```
src/
├── app/              # Next.js pages (App Router)
│   ├── layout.tsx    # Root layout with AuthProvider
│   ├── page.tsx      # Landing page
│   ├── login/        # Login page
│   ├── register/     # Registration page
│   └── todos/        # Todo dashboard
├── components/       # Reusable React components
├── context/          # React Context providers
└── lib/              # Utilities and API layer
```

## ✨ Features

- 🔐 JWT-based authentication
- ✅ Create, read, update, delete todos
- 🎯 Priority management (Low/Medium/High)
- 📱 Responsive design
- 🎨 Modern UI with TailwindCSS
- 🔔 Toast notifications
- ⚡ Fast page loads with Next.js

## 📚 Documentation

- [**QUICKSTART.md**](./QUICKSTART.md) - Quick reference guide
- [**INTEGRATION.md**](./INTEGRATION.md) - Full integration documentation
- [**IMPLEMENTATION_SUMMARY.md**](./IMPLEMENTATION_SUMMARY.md) - Implementation details

## 🔧 Available Scripts

```bash
pnpm dev          # Start development server on port 3000
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 🌐 Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## 🧪 Testing the App

1. Ensure backend is running on port 8080
2. Start frontend: `pnpm dev`
3. Navigate to `http://localhost:3000`
4. Register a new account
5. Create and manage todos

## 🎯 API Integration

The frontend integrates with the Spring Boot backend:

- **Base URL**: `http://localhost:8080/api`
- **Authentication**: JWT Bearer tokens
- **Endpoints**: `/auth/*`, `/todos/*`

See [INTEGRATION.md](./INTEGRATION.md) for details.

## 🎨 UI Components

- **Navbar** - Navigation with auth state
- **Toast** - Success/error notifications
- **LoadingSpinner** - Loading indicators
- **Forms** - Styled input components

## 🔐 Authentication Flow

1. User registers/logs in
2. Receives JWT token from backend
3. Token stored in localStorage
4. Automatically included in API requests
5. Auto-logout on token expiration

## 📱 Pages

- `/` - Landing page with features
- `/login` - User authentication
- `/register` - New user signup
- `/todos` - Todo dashboard (protected)

## 🚧 Future Enhancements

- [ ] Edit existing todos
- [ ] Filter/sort functionality
- [ ] Search todos
- [ ] Due dates
- [ ] Categories/tags
- [ ] Dark mode
- [ ] Export todos

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

## 🤝 Related Projects

- **Backend**: `../PrimePlanner/` - Spring Boot REST API

---

Built with ❤️ using Next.js and TailwindCSS
