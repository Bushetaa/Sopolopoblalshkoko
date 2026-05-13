# 🚀 Quick Start Guide

## 5 دقائق لتشغيل كل شيء

### الخطوة 1️⃣: تثبيت Axios
```bash
cd sopo-frontend
npm install axios
```

### الخطوة 2️⃣: إنشاء أو تحديث `.env.local`
```bash
# انسخ هذا في .env.local:

NEXT_PUBLIC_BACKEND_URL=https://sopo-backend-ebbe5030f148.hosted.ghaymah.systems
NEXT_PUBLIC_AUTH_SERVICE_URL=https://hasura-auth-b78edbdcfb75.hosted.ghaymah.systems
```

### الخطوة 3️⃣: تشغيل الخادم
```bash
npm run dev
```

### الخطوة 4️⃣: افتح المتصفح
```
http://localhost:3000/signin
```

### الخطوة 5️⃣: اختبر تسجيل الدخول
- Email: `abdotony9999@gmail.com`
- Password: كلمة المرور الخاصة بك

---

## ✅ التحقق من النجاح

| المميزة | الاختبار | النتيجة |
|---|---|---|
| تسجيل الدخول | اذهب لـ `/signin` | ✅ يتم التوجيه لـ `/dashboard` |
| عرض الملف | اذهب لـ `/settings/general` | ✅ تظهر بيانات المستخدم |
| تغيير كلمة المرور | اذهب لـ `/settings/security` | ✅ يمكن تغيير الكلمة |
| Access Token | افتح DevTools Console | ✅ `localStorage.getItem("sopo_access_token")` |
| تسجيل الخروج | اضغط على الملف ثم Logout | ✅ يتم التوجيه لـ `/signin` |

---

## 🐛 إذا حدث شيء خاطئ

### خطأ: "Cannot find module 'axios'"
```bash
npm install axios
npm run dev  # أعد التشغيل
```

### خطأ: "NEXT_PUBLIC_BACKEND_URL is undefined"
```bash
# تأكد من وجود .env.local
# ثم أعد تشغيل الخادم
npm run dev
```

### Backend connection failed
```bash
# تحقق من:
1. هل Backend يعمل؟
2. هل الـ URL صحيح في .env.local؟
3. افتح DevTools > Network > تحقق من الـ request
```

---

## 📁 الملفات الجديدة

```
✨ lib/api-client.ts          ← API Client مع cookies
✨ hooks/useAuth.ts           ← Authentication hook
✨ .env.local                 ← متغيرات البيئة
✨ .env.example               ← نموذج البيئة
✨ INTEGRATION_GUIDE.md       ← شرح تفصيلي
✨ SETUP.md                   ← دليل التثبيت
✨ CHANGES_SUMMARY.md         ← ملخص التعديلات
```

---

## 📖 المستندات

- **`INTEGRATION_GUIDE.md`** - شرح شامل للتكامل
- **`SETUP.md`** - خطوات التثبيت والتشغيل
- **`CHANGES_SUMMARY.md`** - ملخص كل التعديلات

---

## 🎯 الخطوات التالية

1. ✅ قم بـ npm install axios
2. ✅ تأكد من `.env.local`
3. ✅ شغّل `npm run dev`
4. ✅ اختبر `/signin`
5. 📝 اقرأ `INTEGRATION_GUIDE.md` للمزيد

---

## 💡 نصائح مفيدة

### لـ Local Development:
```
# قم بتحديث .env.local:
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:4002
```

### للـ Debugging:
```javascript
// في DevTools Console:
localStorage.getItem("sopo_access_token")  // اطبع الـ token
```

### للـ Production:
```
# استخدم الـ URLs الفعلية:
NEXT_PUBLIC_BACKEND_URL=https://sopo-backend-ebbe5030f148.hosted.ghaymah.systems
NEXT_PUBLIC_AUTH_SERVICE_URL=https://hasura-auth-b78edbdcfb75.hosted.ghaymah.systems
```

---

**Ready to go! 🎉**

إذا حدثت مشاكل، راجع `SETUP.md` للمزيد من التفاصيل.
