# SOPO

مشروع واجهة أمامية يعتمد على Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui.  
يوفّر صفحة هبوط متقدّمة مع مكوّنات جاهزة وتحريك باستخدام framer‑motion، وإدارة بيانات عبر TanStack Query، واختبارات عبر Vitest.

## البدء السريع

المتطلبات:
- Node.js 18 أو أحدث.

التثبيت والتشغيل:

```bash
npm install
npm run dev
```

أوامر مهمة:
- التشغيل الإنتاجي: `npm run build` ثم `npm start`
- الفحص البرمجي: `npm run lint`
- الاختبارات: `npm test` أو `npm run test:watch`

## بنية المشروع
- مجلد التطبيق: [app](file:///e:/workWeb/SOPO/app) — مسارات Next (الصفحات والتخطيط العام).
- المكوّنات والدعم: [src/components](file:///e:/workWeb/SOPO/src/components) و[src/lib](file:///e:/workWeb/SOPO/src/lib).
- الأنماط: [src/index.css](file:///e:/workWeb/SOPO/src/index.css) (مستورد داخل [app/layout.tsx](file:///e:/workWeb/SOPO/app/layout.tsx)).
- التهيئة:
  - [package.json](file:///e:/workWeb/SOPO/package.json) — السكربتات والأعتمادات.
  - [tailwind.config.ts](file:///e:/workWeb/SOPO/tailwind.config.ts) و[postcss.config.mjs](file:///e:/workWeb/SOPO/postcss.config.mjs).
  - [tsconfig.json](file:///e:/workWeb/SOPO/tsconfig.json) — المسار alias `@/*` يشير إلى `src/*`.
- الاختبارات: [vitest.config.ts](file:///e:/workWeb/SOPO/vitest.config.ts) و[src/test](file:///e:/workWeb/SOPO/src/test).

## ملاحظات تطوير
- يُنشئ Next مجلد `.next` تلقائيًا أثناء التطوير والبناء — لا حاجة لتتبعه في المستودع.
- تعتمد المكوّنات على shadcn/ui وTailwind؛ عدّل التصميم عبر CSS المتغيّر في `src/index.css`.

## النشر
- أي منصة تدعم Next.js (Vercel، Netlify، Docker…)؛ استخدم `npm run build` ثم تشغيل الخادم.
