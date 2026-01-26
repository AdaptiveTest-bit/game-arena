
# Game Arena - Authentication System Setup

## Overview
A complete session-based authentication system using JWT tokens stored in HTTP-only cookies, built with Next.js App Router, Zustand, and the `jose` library for Edge compatibility.

## Features
- ✅ **Student ID + Password Login**
- ✅ **User Registration** with avatar selection
- ✅ **Session-based Authentication** with HTTP-only cookies
- ✅ **Protected Routes** (middleware)
- ✅ **Persistent Sessions** (24-hour expiry)
- ✅ **Zustand Store** for client-side auth state
- ✅ **Edge-compatible** (works in Vercel Edge Runtime)

## Quick Start

### 1. Start the Development Server
```bash
cd /Users/gauravsingh/game-arena
npm run dev
```

### 2. Access the Application
Open: http://localhost:3000

### 3. Demo Credentials
```
Student ID: student001
Password: demo123
```

Or register a new account at: http://localhost:3000/register

## File Structure

```
game-arena/
├── lib/
│   ├── auth-edge.ts        # Core auth logic (JWT, cookies)
│   └── users.ts            # User storage & validation
├── app/
│   ├── api/auth/
│   │   ├── login/route.ts      # POST /api/auth/login
│   │   ├── logout/route.ts     # POST /api/auth/logout
│   │   ├── register/route.ts   # POST /api/auth/register
│   │   └── session/route.ts    # GET /api/auth/session
│   ├── login/
│   │   └── page.tsx        # Login page
│   ├── register/
│   │   └── page.tsx        # Registration page
│   ├── components/auth/
│   │   ├── AuthProvider.tsx    # Auth state wrapper
│   │   └── LogoutButton.tsx    # Logout component
│   └── store/
│       └── useAuthStore.ts     # Zustand auth store
├── middleware.ts           # Route protection
├── TODO_AUTH.md            # Implementation plan
└── AUTHENTICATION_ANALYSIS.md  # Analysis document
```

## API Endpoints

### POST /api/auth/login
```json
{
  "studentId": "student001",
  "password": "demo123"
}
```
Returns: User object and sets auth cookie

### POST /api/auth/logout
Clears the auth cookie

### GET /api/auth/session
Returns: Current session info
```json
{
  "authenticated": true,
  "user": {
    "id": "...",
    "studentId": "...",
    "name": "...",
    "class": "5",
    "avatar": "🦊"
  }
}
```

### POST /api/auth/register
```json
{
  "studentId": "newuser",
  "name": "John Doe",
  "class": "5",
  "password": "password123",
  "avatar": "🦊"
}
```

## Security Features

1. **HTTP-only Cookies**: Tokens cannot be accessed by JavaScript (XSS protection)
2. **Secure Cookies**: Only sent over HTTPS in production
3. **SameSite Protection**: Prevents CSRF attacks
4. **Password Hashing**: Uses bcrypt (10 rounds)
5. **JWT Expiry**: Sessions expire after 24 hours

## Current Limitations & Next Steps

### In-Memory User Storage ⚠️
The current implementation uses in-memory storage, which:
- ❌ Resets when the server restarts
- ❌ Doesn't scale beyond one server
- ❌ Loses data on deployment

### To Make Production Ready:

#### Option 1: Add PostgreSQL (Recommended)
```bash
# Install Prisma
npm install prisma @prisma/client

# Initialize Prisma
npx prisma init

# Update lib/users.ts to use Prisma
```

#### Option 2: Add Redis for Sessions
```bash
npm install ioredis
```

#### Option 3: Use a Database Service
- **Supabase** (PostgreSQL)
- **PlanetScale** (MySQL)
- **Neon** (PostgreSQL)

## Environment Variables

Create a `.env.local` file:
```env
# Required for production
NEXTAUTH_SECRET=your-super-secret-key-at-least-32-chars

# Optional: Database URL (when adding persistence)
DATABASE_URL="postgresql://..."
```

## Testing Checklist

- [ ] Registration works with validation
- [ ] Login works with correct credentials
- [ ] Login fails with incorrect credentials
- [ ] Session persists after page refresh
- [ ] Logout clears session
- [ ] Logged-in users redirected from /login
- [ ] Unauthenticated users see login prompt on home

## Customization

### Change Session Duration
Edit `lib/auth-edge.ts`:
```typescript
const JWT_EXPIRY = '24h'; // Change to '7d', etc.
```

### Add More Validation
Edit `app/api/auth/register/route.ts`:
```typescript
// Add password strength requirements
if (password.length < 8) {
  return NextResponse.json({ error: "Password too short" }, { status: 400 });
}
```

## Troubleshooting

### "User already exists" on registration
The student ID must be unique. Try a different one.

### "Invalid credentials" on login
1. Ensure you're using the correct Student ID (not email)
2. Check caps lock
3. Demo account: `student001` / `demo123`

### Session not persisting
1. Check browser cookies are enabled
2. Check browser console for errors
3. Clear cookies and login again

## Performance Notes

- JWT verification is fast (O(1))
- Session check is synchronous
- No database calls on every request (for current in-memory storage)
- Ready for database integration when needed

---

**Built with ❤️ for educational gaming! 🎮**

