# 🚀 SOPO Frontend - Setup & Installation

## 📋 المتطلبات

- Node.js 18+ 
- npm أو yarn
- Visual Studio Code (اختياري)

---

## ✅ خطوات التثبيت

### 1. تثبيت المكتبات الأساسية
```bash
npm install
# أو
yarn install
```

### 2. تثبيت Axios (إذا لم يكن مثبتاً)
```bash
npm install axios
# أو
yarn add axios
```

### 3. التحقق من ملف البيئة

تأكد من وجود ملف `.env.local` في جذر المشروع:

```bash
# .env.local
NEXT_PUBLIC_BACKEND_URL=https://sopo-backend-ebbe5030f148.hosted.ghaymah.systems
NEXT_PUBLIC_AUTH_SERVICE_URL=https://hasura-auth-b78edbdcfb75.hosted.ghaymah.systems

# للـ Local Development:
# NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
# NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:4002
```

### 4. تشغيل خادم التطوير
```bash
npm run dev
# أو
yarn dev
```

الموقع سيكون متاحاً على: `http://localhost:3000`

---

## 📝 ملفات مهمة

### الملفات الجديدة المضافة:
```
sopo-frontend/
├── lib/
│   └── api-client.ts              ← API Client مع دعم cookies
├── hooks/
│   └── useAuth.ts                 ← Hook للمصادقة
├── .env.local                     ← متغيرات البيئة
└── INTEGRATION_GUIDE.md           ← دليل التكامل
```

### الملفات المعدلة:
```
sopo-frontend/
├── components/auth/
│   ├── LoginForm.tsx              ← ربط مع Backend
│   └── SignupForm.tsx             ← ربط مع Backend
└── app/(dashboard)/settings/
    ├── general/page.tsx           ← عرض بيانات المستخدم الحقيقية
    └── security/page.tsx          ← تغيير كلمة المرور و 2FA
```

---

## 🔍 التحقق من الربط

### 1. افتح متصفح وانتقل لـ:
```
http://localhost:3000/signin
```

### 2. جرب تسجيل الدخول بحسابك:
- Email: `abdotony9999@gmail.com`
- Password: كلمة المرور الخاصة بك

### 3. تحقق من:
- ✅ هل تم التوجيه لـ Dashboard بعد النجاح؟
- ✅ هل ظهرت بيانات المستخدم في Settings؟
- ✅ هل يتم حفظ Access Token في localStorage؟

### 4. افتح DevTools (F12):
```
# في Console تحقق من:
localStorage.getItem("sopo_access_token")  // يجب أن يظهر الـ token

# في Network tab تحقق من:
# كل request يجب أن يحتوي على:
Authorization: Bearer <token>
```

---

## 🐛 حل المشاكل الشائعة

### مشكلة 1: خطأ "Cannot find module 'axios'"
**الحل:**
```bash
npm install axios
```

### مشكلة 2: Backend URL غير صحيح
**الحل:** تحقق من ملف `.env.local`:
```
# تأكد من وجود هذا السطر:
NEXT_PUBLIC_BACKEND_URL=https://sopo-backend-ebbe5030f148.hosted.ghaymah.systems
```

### مشكلة 3: CORS Error
**الحل:** تأكد أن Backend يسمح بـ CORS:
```
# Backend يجب أن يرد بـ headers:
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
```

### مشكلة 4: Token غير صحيح
**الحل:** حاول تسجيل الخروج والدخول مرة أخرى:
```javascript
// في Console:
localStorage.removeItem("sopo_access_token")
location.reload()
```

---

## 🧪 اختبار الـ Features

### تسجيل الدخول:
1. انتقل لـ `/signin`
2. أدخل بيانات الدخول
3. يجب أن يتم التوجيه لـ `/dashboard`

### عرض الملف:
1. انتقل لـ `/settings/general`
2. يجب أن تظهر بيانات المستخدم الحقيقية من API

### تغيير كلمة المرور:
1. انتقل لـ `/settings/security`
2. أدخل كلمة المرور الحالية والجديدة
3. اضغط "Update Password"

### تسجيل الخروج:
1. اضغط على صورة الملف في Navbar
2. اختر "Logout"
3. يجب أن يتم التوجيه لـ `/signin`

---

## 📊 الـ Files Structure

```
sopo-frontend/
├── app/
│   ├── (dashboard)/
│   │   └── settings/
│   │       ├── general/page.tsx     (✅ updated)
│   │       └── security/page.tsx    (✅ updated)
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│   └── layout.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx            (✅ updated)
│   │   └── SignupForm.tsx           (✅ updated)
│   └── ...
├── hooks/
│   ├── useAuth.ts                   (✨ new)
│   └── ...
├── lib/
│   ├── api-client.ts                (✨ new)
│   └── ...
├── .env.local                       (✨ new)
└── INTEGRATION_GUIDE.md             (✨ new)
```

---

## 🔒 Security Notes

### ✅ الممارسات الجيدة:
- ✅ Access Token يُخزّن في localStorage (سهل الوصول للـ JavaScript)
- ✅ Refresh Token يُخزّن في HTTP-only cookies (محمي من XSS)
- ✅ كل request يُرسل مع Authorization header
- ✅ Token يُحدّث تلقائياً عند انتهاء الصلاحية

### ⚠️ لا تفعل:
- ❌ لا تُخزّن كلمة المرور في localStorage
- ❌ لا تُرسل كلمة المرور مع كل request
- ❌ لا تُعرّض sensitive data في الـ console logs (في production)
- ❌ لا تُحفظ بيانات المستخدم الحساسة في localStorage بدون encryption

---

## 🚢 الإطلاق إلى الإنتاج

### 1. بناء المشروع:
```bash
npm run build
```

### 2. اختبر البناء محلياً:
```bash
npm run start
```

### 3. تأكد من متغيرات البيئة:
```bash
# تأكد أن متغيرات الإنتاج مضبوطة:
NEXT_PUBLIC_BACKEND_URL=https://sopo-backend-ebbe5030f148.hosted.ghaymah.systems
NEXT_PUBLIC_AUTH_SERVICE_URL=https://hasura-auth-b78edbdcfb75.hosted.ghaymah.systems
```

### 4. انشر على Vercel (أو الاستضافة الخاصة بك):
```bash
# إذا كنت تستخدم Vercel:
vercel deploy
```

---

## 📚 مراجع إضافية

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Axios Documentation](https://axios-http.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## 💬 الدعم

إذا واجهت مشاكل:
1. تحقق من رسائل الخطأ في Console
2. افتح DevTools (F12) وتحقق من Network tab
3. تأكد من أن Backend يعمل بشكل صحيح
4. تحقق من ملف `.env.local` 

**Happy Coding! 🎉**
