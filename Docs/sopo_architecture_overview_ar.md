# الفصل: التصميم المعماري والنظرة العامة على نظام Sopo API Gateway

## 1. مقدمة
مشروع **Sopo** هو عبارة عن منصة متكاملة لإدارة دورة حياة واجهات برمجة التطبيقات (Full Lifecycle API Management Platform). تم تصميمه كبنية تحتية سحابية حديثة (Cloud-Native Infrastructure) ليعمل كنقطة دخول موحدة (Single Entry Point) تدير وتوجه حركة المرور (Traffic) بين العميل والخدمات المصغرة الخلفية (Microservices)، مع دعم إعادة التحميل الديناميكي اللحظي (Dynamic Hot-Reload) والمراقبة اللحظية (Observability).

تنقسم الهندسة الداخلية للنظام إلى طبقتين أساسيتين لتطبيق مبدأ فصل الإدارة عن التنفيذ (Separation of Control Plane & Data Plane):

---

## 2. طبقة التحكم والإدارة (Control Plane)
هذه الطبقة مسؤولة عن إدارة المستخدمين (Multi-tenancy)، وعمليات الإضافة والتعديل والحذف (CRUD) الخاصة بالإعدادات والإضافات (Plugins).

* **Hasura & GraphQL:** تمثل المحرك الأساسي لقاعدة البيانات؛ حيث تُعرض من خلالها المخططات (Schemas)، وتُدار البيئة متعددة المستأجرين (Multi-tenancy) بأمان باستخدام رموز **JWT**، حيث يتم حقن `username` أو `slug` داخل الرمز لضمان عزل البيانات بدقة (Isolation).
* **Hasura Event Triggers:** بمجرد حدوث أي تعديل (Insert/Update/Delete) على جداول الإعدادات أو المسارات من قبل المستخدم، تقوم Hasura بإطلاق مشغل حدث (Trigger) لحظي.
* **خادم Nhost (Node.js):** يستقبل الحدث من Hasura، ويقوم فوراً بسحب البيانات الجديدة، وصياغتها ككائن إعدادات (Configuration Object)، ثم ضخها مباشرة إلى وسيط الرسائل.

---

## 3. طبقة معالجة البيانات والتوجيه (Data Plane)
هي القلب النابض للمشروع، وتتكون من **محرك بوابة Go عالي الأداء** (High-Performance Go Gateway Engine)، مستقر وعديم الحالة (Stateless)، يقف في الواجهة لاستقبال الطلبات وتوجيهها.

### 3.1 آلية إعادة التحميل الديناميكي اللحظية (Dynamic Hot-Reload)
1. **وسيط الرسائل (Redis Pub/Sub):** تم استخدام Redis كوسيط رسائل في الذاكرة (In-Memory Message Broker) نظراً لسرعته الفائقة في تمرير الرسائل عبر نمط (Fire & Forget).
2. **الـ Hot-Reload في Go:** خادم Go مشترك (Subscribed) في قناة Redis. أول ما يقوم Nhost بضخ الإعداد الجديد، يلقطه خادم Go عبر خيوط المعالجة الخفيفة (Goroutines) في أجزاء من الملي ثانية.
3. **التحديث الآمن في الذاكرة:** يتم تحويل (Unmarshal) بيانات JSON وتحديث المؤشر (Pointer) الخاص بخريطة التوجيه (Routing Map) محلياً في الذاكرة فوراً دون الحاجة لإعادة تشغيل الخادم (Zero Downtime)، مع تأمين العمليات باستخدام قفل `sync.RWMutex` لمنع أعطال الكتابة المتزامنة.

### 3.2 استراتيجية مقاومة الأعطال (Resiliency & Fallback)
* تجنباً لوجود نقطة فشل مفردة (Single Point of Failure)، عند استقبال إعداد جديد، يقوم الخادم بحفظ نسخة احتياطية محلياً كـ `config.json` ويرفع نسخة إلى **Amazon S3**.
* في حالة حدوث انهيار وسقوط Redis، يقوم خادم Go عند الإقلاع (On Startup) بتفعيل خطة بديلة (Fallback Strategy) والسحب فوراً من S3 أو الملف المحلي ليعود للعمل على آخر حالة مستقرة (Last Known Good State).

---

## 4. طبقة المراقبة والتحليلات (Observability & Logging)
تتبع هذه الطبقة حركة البيانات بدقة مرعبة ودون التأثير على أداء الخادم:

* **التخزين المؤقت للسجلات في الذاكرة (Ticking Buffer):** لحماية الخادم من إرهاق عمليات الإدخال والإخراج للشبكة (Network I/O)، لا يتم كتابة كل سجل منفرداً. يجمع خادم Go السجلات في قناة داخلية، ويتم ترحيلها بشكل غير متزامن (Asynchronous) عبر مجموعة عمال (Worker Pool) بناءً على شرطين: إما عند وصول التخزين المؤقت إلى **1000 سجل**، أو مرور **3 ثوانٍ** عبر مؤقت ذكي (Ticker).
* **قاعدة بيانات ClickHouse:** تستقبل السجلات على هيئة دُفعات (Batch Inserts)، وهي قاعدة البيانات الأقوى عالمياً للتحليلات والتخزين الموجه نحو الأعمدة (Column-oriented storage).
* **الوصول الموحد للسجلات عبر GraphQL:** تم ربط ClickHouse بـ Hasura عن طريق **Hasura Connector**. يسمح هذا الدمج بسحب السجلات وعرضها للمستخدم في لوحة التحكم مباشرة باستخدام نفس رابط GraphQL وعن طريق الـ `slug` المستخرج من JWT لضمان الخصوصية والأمان.

---

## 5. خلاصة تدفق البيانات (Data Flow Architecture)

$$\text{Client Request} \longrightarrow \text{[ Go Gateway ]} \overset{\text{In-Memory Map Lookup}}{\longrightarrow} \text{Target Microservice}$$

$$\text{User Config Change} \longrightarrow \text{Hasura} \longrightarrow \text{Nhost} \overset{\text{Pub/Sub}}{\longrightarrow} \text{Redis} \longrightarrow \text{Go Server (Hot-Reload)}$$

$$\text{Go Gateway Logs} \overset{\text{Batching (3s / 1k)}}{\longrightarrow} \text{ClickHouse} \longrightarrow \text{Hasura Connector} \longrightarrow \text{User Dashboard (GraphQL)}$$

---

## 6. متطلبات التنفيذ (Implementation Chapter Guidelines)
* **تقنيات التصميم والمفاضلات:** فصل طبقة التحكم عن البيانات هو نمط كلاسيكي مأخوذ من الشبكات المعرفة بالبرمجيات (SDN). المفاضلة هنا هي زيادة التعقيد المعماري (الاعتماد على Redis و ClickHouse) مقابل الحصول على أداء عالٍ وتحديثات بدون توقف.
* **فخاخ البرمجة (Coding Traps):** يتطلب نمط Ticking Buffer معالجة دقيقة للإغلاق الآمن (Graceful Shutdown)؛ وإلا ستُفقد السجلات الموجودة في الذاكرة المؤقتة أثناء توقف الخادم. استخدمنا `context` لتفريغ الذاكرة المتبقية عند استلام إشارة SIGTERM.
* **الاختبار والتقييم:** تم التقييم عبر بيانات حية، حيث أثبتت آلية ترحيل السجلات بالدُفعات قدرتها على تحمل آلاف الطلبات في الثانية دون التأثير السلبي على زمن انتقال التوجيه (Routing Latency).
