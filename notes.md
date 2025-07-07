Login/Register:
Confirmed password and password validations (number & simbol checks) will be made in the frontend.


# Frontend JWT Implementation Guide

## 🔑 Token System Overview

### Access Token (15 min)
- **Purpose**: Authorize API requests
- **Storage**: HTTP-only cookie (automatic)
- **Usage**: Sent automatically with every request
- **Expiration**: Short-lived for security

### Refresh Token (7 days)
- **Purpose**: Generate new Access Tokens
- **Storage**: HTTP-only cookie (automatic)
- **Usage**: Only for `/auth/refresh` endpoint
- **Expiration**: Long-lived for UX

## 🔄 Authentication Flow

### 1. Login/Register
```javascript
// POST /auth/login or /auth/register
const response = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // Include cookies
  body: JSON.stringify({ identifier, password })
});
```
**Result**: Tokens automatically stored in HTTP-only cookies

### 2. Protected Requests
```javascript
// Any protected endpoint
const response = await fetch('/api/protected', {
  credentials: 'include' // Always include cookies
});
```
**Result**: Access token sent automatically

### 3. Token Expired Response
```javascript
// Server response when token expires
{
  success: false,
  message: "Access token expired",
  code: "TOKEN_EXPIRED"
}
```

### 4. Automatic Refresh
```javascript
// Axios interceptor example
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && 
        error.response?.data?.code === "TOKEN_EXPIRED") {
      
      try {
        // Refresh tokens
        await axios.post('/auth/refresh', {}, { credentials: 'include' });
        
        // Retry original request
        return axios(error.config);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

## 🛡️ Error Codes to Handle

| Code | Meaning | Action |
|------|---------|--------|
| `NO_TOKEN` | No access token | Redirect to login |
| `INVALID_TOKEN` | Malformed token | Redirect to login |
| `TOKEN_EXPIRED` | Access token expired | Call `/auth/refresh` |
| `USER_NOT_FOUND` | User deleted | Redirect to login |
| `REFRESH_TOKEN_EXPIRED` | Refresh token expired | Redirect to login |

## 📋 Frontend Implementation Checklist

### ✅ Required Settings
- [ ] `credentials: 'include'` in all fetch/axios requests
- [ ] Response interceptor for automatic token refresh
- [ ] Error handling for all auth error codes
- [ ] Redirect to login on refresh failure

### ✅ DON'Ts
- [ ] ❌ Don't use localStorage for tokens
- [ ] ❌ Don't manually manage tokens
- [ ] ❌ Don't store tokens in JavaScript variables
- [ ] ❌ Don't forget `credentials: 'include'`

### ✅ DOs
- [ ] ✅ Use HTTP-only cookies (automatic)
- [ ] ✅ Handle token refresh transparently
- [ ] ✅ Include credentials in all requests
- [ ] ✅ Implement proper error handling

## 🔧 Quick Setup (Axios)

```javascript
// axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Always include cookies
});

// Auto-refresh interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && 
        error.response?.data?.code === "TOKEN_EXPIRED") {
      
      try {
        await api.post('/auth/refresh');
        return api(error.config);
      } catch {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 🚀 Usage Examples

### Login
```javascript
try {
  const response = await api.post('/auth/login', { identifier, password });
  // Tokens automatically stored, user logged in
  setUser(response.data.user);
} catch (error) {
  setError(error.response.data.message);
}
```

### Protected Request
```javascript
try {
  const response = await api.get('/user/profile');
  // Token automatically included and refreshed if needed
  setProfile(response.data);
} catch (error) {
  // Handle error (user might be redirected to login)
}
```

### Logout
```javascript
try {
  await api.post('/auth/logout');
  // Cookies automatically cleared
  setUser(null);
} catch (error) {
  console.error('Logout error:', error);
}
```

## 💡 Key Points

1. **Automatic**: Tokens are managed automatically via cookies
2. **Transparent**: Token refresh happens behind the scenes
3. **Secure**: HTTP-only cookies prevent XSS attacks
4. **Simple**: Just remember `credentials: 'include'`
5. **Robust**: Proper error handling ensures smooth UX

## 🎯 Remember

- **Always include credentials** in requests
- **Never manually handle tokens** - let cookies do the work
- **Handle TOKEN_EXPIRED** with automatic refresh
- **Redirect to login** when refresh fails
- **Test the flow** thoroughly