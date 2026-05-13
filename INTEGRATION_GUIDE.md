# 🔗 SOPO Frontend - Backend Integration Guide

## ✅ التعديلات المنجزة

### 1. **API Client** (`lib/api-client.ts`)
- ✅ دعم HTTP Cookies تلقائي
- ✅ إدارة Access Token في localStorage
- ✅ Request interceptors لإضافة Authorization header
- ✅ Response interceptors لمعالجة 401 و refresh token
- ✅ جميع endpoints المصادقة

### 2. **Authentication Hook** (`hooks/useAuth.ts`)
- ✅ `login()` - تسجيل الدخول
- ✅ `signup()` - إنشاء حساب
- ✅ `logout()` - تسجيل الخروج
- ✅ `getProfile()` - جلب بيانات المستخدم
- ✅ `updateProfile()` - تحديث بيانات المستخدم
- ✅ `changePassword()` - تغيير كلمة المرور

### 3. **Sign In & Sign Up Pages**
- ✅ ربط مع Backend API
- ✅ Error handling شامل
- ✅ Loading states
- ✅ OAuth buttons محدثة لاستخدام env variables

### 4. **Settings Pages**
- ✅ General Settings - عرض بيانات المستخدم الحقيقية
- ✅ Security Settings - تغيير كلمة المرور و 2FA

### 5. **Environment Variables** (`.env.local`)
```
NEXT_PUBLIC_BACKEND_URL=https://sopo-backend-ebbe5030f148.hosted.ghaymah.systems
NEXT_PUBLIC_AUTH_SERVICE_URL=https://hasura-auth-b78edbdcfb75.hosted.ghaymah.systems
```

---

## 🚀 البدء السريع

### 1. تثبيت Axios (إذا لم تكن مثبتة)
```bash
npm install axios
```

### 2. استخدام useAuth Hook في أي component
```typescript
import { useAuth } from "@/hooks/useAuth";

export default function MyComponent() {
  const { user, isLoading, login, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login("email@example.com", "password")}>
          Login
        </button>
      )}
    </div>
  );
}
```

### 3. استخدام API Client مباشرة
```typescript
import { apiClient } from "@/lib/api-client";

// جلب ملف المستخدم
const user = await apiClient.getProfile();

// تحديث الملف
await apiClient.updateProfile({ displayName: "New Name" });

// تغيير كلمة المرور
await apiClient.changePassword("oldPassword", "newPassword");

// أي طلب عام
const data = await apiClient.get("/api/routes");
```

---

## 📊 Response من Backend

### Login Response
```json
{
  "session": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "accessTokenExpiresIn": 900,
    "user": {
      "id": "6f03aea7-01cb-4026-9f03-0fe5b1b5a802",
      "email": "abdotony9999@gmail.com",
      "displayName": "Abdo Tony",
      "avatarUrl": "https://www.gravatar.com/avatar/...",
      "emailVerified": true,
      "roles": ["me", "user"],
      "defaultRole": "user",
      "metadata": {
        "firstName": "Abdelrahman",
        "lastName": "Tony"
      }
    }
  }
}
```

---

## 🔐 Cookie Handling

### السيناريو الحالي:
1. **Access Token**: يُخزّن في `localStorage` ويُرسل مع كل request في header:
   ```
   Authorization: Bearer <accessToken>
   ```

2. **Refresh Token**: يُخزّن تلقائياً في HTTP-only cookie من الـ Response:
   ```
   Set-Cookie: sopo_refresh_token=...; HttpOnly; Secure; SameSite=Strict
   ```

3. **الفائدة**: 
   - ✅ Refresh token محمي (HttpOnly = لا يمكن الوصول له من JS)
   - ✅ Access token سهل الإدارة
   - ✅ يُرسل الـ refresh token تلقائياً مع كل request بسبب `withCredentials: true`

---

## 🛠️ التخصيص والتوسع

### إضافة endpoint جديد للـ API Client
```typescript
// في lib/api-client.ts
async generatePAT(displayName: string): Promise<{ token: string }> {
  try {
    const response = await this.client.post("/auth/pat", {
      displayName,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to generate PAT");
  }
}
```

### استخدام API method جديد في useAuth
```typescript
// في hooks/useAuth.ts
const generatePAT = useCallback(
  async (displayName: string) => {
    try {
      const result = await apiClient.generatePAT(displayName);
      toast({ title: "Success", description: "PAT generated" });
      return result;
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      throw error;
    }
  },
  []
);

return {
  // ... existing methods
  generatePAT,
};
```

---

## ⚠️ ملاحظات هامة

### 1. CORS Configuration
تأكد أن الـ Backend يسمح بـ CORS من الـ Frontend:
```
Origin: http://localhost:3000 (dev) أو https://sopo.dev (prod)
Credentials: include
```

### 2. HTTP-Only Cookies
- لا تحاول الوصول لـ refresh token من localStorage
- هو محمي تلقائياً في cookies
- يُرسل تلقائياً مع كل request

### 3. Token Expiration
- Access token ينتهي بعد 15 دقيقة (900 ثانية)
- API client يحاول تجديده تلقائياً
- إذا فشل التجديد → يُعيد توجيه للـ login

### 4. Development vs Production
للـ development local:
```
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:4002
```

للـ production:
```
# قيم البيئة الموجودة بالفعل
NEXT_PUBLIC_BACKEND_URL=https://sopo-backend-ebbe5030f148.hosted.ghaymah.systems
NEXT_PUBLIC_AUTH_SERVICE_URL=https://hasura-auth-b78edbdcfb75.hosted.ghaymah.systems
```

---

## 🧪 اختبار التكامل

### 1. تسجيل الدخول
```bash
curl -X POST http://localhost:3001/auth/signin/email-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "abdotony9999@gmail.com",
    "password": "your-password"
  }'
```

### 2. جلب الملف
```bash
curl -X GET http://localhost:3001/auth/user \
  -H "Authorization: Bearer <accessToken>"
```

### 3. تحديث الملف
```bash
curl -X PUT http://localhost:3001/auth/user \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "New Name"
  }'
```

---

## 📝 الـ Flow الكامل

```
User Type Email & Password
         ↓
   SignIn Form
         ↓
   useAuth.login()
         ↓
   apiClient.login()
         ↓
   Backend: POST /auth/signin/email-password
         ↓
Backend Return:
├─ accessToken (JWT)
├─ accessTokenExpiresIn
├─ user object
└─ Set-Cookie: sopo_refresh_token (HttpOnly)
         ↓
Client Store:
├─ accessToken → localStorage
├─ user → Context state
└─ refresh_token (auto in cookies)
         ↓
Redirect to Dashboard
         ↓
Every API Request:
├─ GET Authorization header
├─ Check if token expired
└─ If expired → refresh automatically
```

---

## ✨ التحسينات القادمة

- [ ] تحديث Users Management page
- [ ] إضافة WebSocket لـ real-time data
- [ ] Error Boundary للـ auth errors
- [ ] Session timeout warning
- [ ] Remember me functionality
- [ ] Social login callbacks
