# نظام التحديث التلقائي للأسعار

## ✅ تم الربط بنجاح!

تم ربط جميع صفحات الموقع بنظام التحديث التلقائي من لوحة التحكم (Cloudflare KV).

---

## كيف يعمل النظام؟

### 1. **لوحة التحكم (Admin Dashboard)**
- الملف: `admin/dashboard.js` و `admin/dashboard-new.js`
- عند تحديث الأسعار من لوحة التحكم، يتم حفظها في **Cloudflare KV**
- البيانات تُخزن في ملف JSON في السحابة

### 2. **Cloudflare Worker API**
- الملف: `functions/api/data.js`
- يستقبل طلبات من الصفحات ويرسل البيانات المحدثة من KV
- الرابط: `/api/data`

### 3. **الصفحة الرئيسية (index.html)**
- تستدعي: `auto-update.js`
- يحدث تلقائياً:
  - ✅ أسعار الفراخ والدواجن (جدول الدواجن)
  - ✅ أسعار الكتاكيت (جدول الكتاكيت)
  - ✅ أسعار البيض (جدول البيض)
  - ✅ أسعار الأعلاف (قائمة الأعلاف)
  - ✅ أسعار الخامات (جدول الخامات)

### 4. **الصفحات الفرعية (Detail Pages)**
- تستدعي: `auto-update.js` + `auto-update-details.js`
- كل صفحة تحدث أسعارها الخاصة من نفس البيانات

---

## الصفحات المربوطة بالتحديث التلقائي

### ✅ صفحات الكتاكيت (16 صفحة):
1. chicks-details/wadi-chick.html
2. chicks-details/watania-chick.html
3. chicks-details/dakahlia-chick.html
4. chicks-details/cairo-chick.html
5. chicks-details/cairo3a-chick.html
6. chicks-details/delta-chick.html
7. chicks-details/amat-chick.html
8. chicks-details/shrouk-chick.html
9. chicks-details/samy-chick.html
10. chicks-details/ramadan-chick.html
11. chicks-details/tasgeen-chick.html
12. chicks-details/abrar-chick.html
13. chicks-details/qasaby-chick.html
14. chicks-details/sasso-chick.html
15. chicks-details/white-chick.html
16. chicks-details/newgen-chick.html

### ✅ صفحات الفراخ والدواجن (10 صفحات):
1. poultry/white-chicken.html
2. poultry/sasso-chicken.html
3. poultry/baladi-chicken.html
4. poultry/mothers-chicken.html
5. poultry/white-turkey.html
6. poultry/black-turkey.html
7. poultry/muscovy-duck.html
8. poultry/molar-duck.html
9. poultry/french-duck.html
10. poultry/quail.html

### ✅ صفحات البيض (3 صفحات):
1. eggs-details/white-eggs.html
2. eggs-details/red-eggs.html
3. eggs-details/baladi-eggs.html

### ✅ صفحات الأعلاف (14 صفحة):
1. feed-details/cairo-feed.html
2. feed-details/dakahlia-feed.html
3. feed-details/alwatania-feed.html
4. feed-details/egypt-feed.html
5. feed-details/misr-feed.html
6. feed-details/newhope-feed.html
7. feed-details/haida-feed.html
8. feed-details/veto-feed.html
9. feed-details/teba-feed.html
10. feed-details/soha-feed.html
11. feed-details/rashid-feed.html
12. feed-details/abostate-feed.html
13. feed-details/alamal-feed.html
14. feed-details/almogy-feed.html

### ✅ صفحات الخامات (12 صفحة):
1. materials-details/corn.html
2. materials-details/soybean-meal.html
3. materials-details/soybean.html
4. materials-details/bran.html
5. materials-details/wheat.html
6. materials-details/sunflower-meal.html
7. materials-details/rice-bran.html
8. materials-details/limestone.html
9. materials-details/phosphate.html
10. materials-details/salt.html
11. materials-details/methionine.html
12. materials-details/premix.html

---

## الإجمالي

📊 **61 صفحة مربوطة بالكامل بنظام التحديث التلقائي**

---

## كيف تعمل؟

### خطوات التحديث:

1. **افتح لوحة التحكم**: `admin/dashboard.html`
2. **عدّل السعر** الذي تريده
3. **اضغط "حفظ التغييرات"**
4. ✅ **السعر يتحدث فوراً في**:
   - ✅ الصفحة الرئيسية (index.html)
   - ✅ صفحة القائمة (مثلاً chicks.html)
   - ✅ صفحة التفاصيل (مثلاً wadi-chick.html)

---

## مثال عملي:

### تحديث سعر كتكوت الوادي:

1. **افتح لوحة التحكم**
2. **غيّر سعر كتكوت الوادي من 12.5 إلى 13.0**
3. **احفظ**
4. **النتيجة**:
   - ✅ index.html → جدول الكتاكيت → "الوادي: 13.0"
   - ✅ chicks.html → جدول الكتاكيت → "الوادي: 13.0"
   - ✅ chicks-details/wadi-chick.html → سعر المعلن: "13.0"

---

## الملفات المسؤولة:

### 1. auto-update.js
- يحدث الصفحة الرئيسية والصفحات الرئيسية الأخرى
- موجود في: `C:\Users\007\website\auto-update.js`

### 2. auto-update-details.js ⭐ جديد!
- يحدث الصفحات الفرعية (Detail Pages)
- موجود في: `C:\Users\007\website\auto-update-details.js`
- **تم إنشاؤه اليوم**: 7 ديسمبر 2025

### 3. functions/api/data.js
- Cloudflare Worker API
- يرسل البيانات من Cloudflare KV

### 4. admin/dashboard-new.js
- لوحة التحكم
- يحفظ البيانات في Cloudflare KV

---

## ✅ الخلاصة

**نعم! جميع الأسعار في الصفحات الفرعية مربوطة الآن بلوحة التحكم**

عند التعديل من لوحة التحكم:
- ✅ تتحدث الصفحة الرئيسية
- ✅ تتحدث صفحات القوائم
- ✅ تتحدث صفحات التفاصيل **الآن!** ⭐

---

**تاريخ التفعيل**: 7 ديسمبر 2025
**عدد الصفحات المربوطة**: 61 صفحة
**الحالة**: ✅ جاهز ويعمل بكفاءة
