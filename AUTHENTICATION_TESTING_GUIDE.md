# Authentication System Testing Guide

## Quick Setup & Testing

### 1. Start the Backend Server
```bash
cd "e:\SaaS\P12-class-based-ts-CRUD"
npm run dev
```

### 2. Start the Frontend Application
```bash
cd "e:\SaaS\React-Typescript-Practice"
npm run dev
```

### 3. Test Authentication Flow

#### Registration Test
1. Navigate to `http://localhost:5173/register`
2. Fill out the registration form with:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. Click "Register"
4. Should automatically redirect to dashboard upon success

#### Login Test
1. Navigate to `http://localhost:5173/login`
2. Use the credentials from registration:
   - Email: test@example.com
   - Password: password123
3. Click "Login"
4. Should redirect to dashboard with API test result

#### API Authentication Test
1. After logging in, check the dashboard
2. You should see either:
   - ✅ API Connected! Found X tasks (success)
   - ❌ API Error: ... (shows what's wrong)

### 4. Common Issues & Solutions

#### 401 Unauthorized Error
- **Cause**: JWT token not being sent or expired
- **Solution**: Check if `localStorage.getItem('accessToken')` has a valid token
- **Debug**: Open browser dev tools > Application > Local Storage > check for `accessToken`

#### CORS Errors
- **Cause**: Backend CORS not configured properly
- **Solution**: Ensure backend `.env` has `FRONTEND_URL=http://localhost:5173`

#### Connection Refused
- **Cause**: Backend server not running
- **Solution**: Start backend server with `npm run dev` in P12-class-based-ts-CRUD directory

#### MongoDB Connection Issues
- **Cause**: MongoDB not running or wrong connection string
- **Solution**: 
  - Start MongoDB service
  - Check `.env` file: `MONGO_URI=mongodb://localhost:27017/TaskSync`

### 5. Testing API Endpoints Manually

#### Get User Profile (Authenticated)
```bash
# First login to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Use the token from login response
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Get Tasks (Authenticated)
```bash
curl -X GET http://localhost:3000/api/task \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Debugging Tips

#### Check Authentication State
1. Open browser dev tools
2. Go to Application > Local Storage
3. Look for:
   - `accessToken`: Should contain JWT token
   - `refreshToken`: Should contain refresh token
   - `user`: Should contain user data

#### Check Network Requests
1. Open dev tools > Network tab
2. Try to login/register
3. Check if requests include `Authorization: Bearer ...` header
4. Look at response status codes and error messages

#### Check Console Errors
1. Open dev tools > Console
2. Look for authentication-related errors
3. Common errors:
   - "Failed to fetch" = Backend not running
   - "401 Unauthorized" = Token issues
   - "CORS error" = Backend CORS configuration

### 7. Working Flow Verification

1. ✅ Backend server starts without errors
2. ✅ Frontend connects to `http://localhost:5173`
3. ✅ Registration creates new user and returns tokens
4. ✅ Login returns valid tokens and user data
5. ✅ Dashboard shows API connection success
6. ✅ Protected routes redirect to login when not authenticated
7. ✅ API calls include Authorization headers automatically
8. ✅ Token refresh works when access token expires

### 8. Environment Configuration

#### Backend `.env` (P12-class-based-ts-CRUD)
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/TaskSync
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

#### Frontend `.env` (React-Typescript-Practice)
```env
VITE_API_URL=http://localhost:3000
VITE_API_BASE_PATH=/api
```

### 9. Success Indicators

When everything is working correctly, you should see:
- ✅ Backend console shows "Server is running on http://localhost:3000"
- ✅ MongoDB connection successful
- ✅ Frontend loads without console errors
- ✅ Authentication flows complete successfully
- ✅ Dashboard shows "API Connected!" message
- ✅ All API calls work with proper authentication
- ✅ Protected routes work correctly

### 10. Next Steps

Once authentication is working:
1. Test all CRUD operations for tasks
2. Test profile management features
3. Test password change functionality
4. Test account deletion
5. Test logout functionality
6. Test token refresh mechanism

The authentication system is now fully integrated and ready for production use!
