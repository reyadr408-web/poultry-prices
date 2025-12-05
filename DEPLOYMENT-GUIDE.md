# 📦 رفع الموقع على Cloudflare Pages

## 🎯 الخطوات الكاملة

### 1️⃣ رفع الملفات على GitHub

#### الطريقة الأولى: Upload مباشر (الأسهل)
1. اذهب إلى: https://github.com/new
2. اسم الـ Repository: `poultry-prices`
3. اختر **Public**
4. اضغط **Create repository**
5. اضغط **uploading an existing file**
6. اسحب كل الملفات من `C:\Users\007\website` (ما عدا `.git` إن وُجد)
7. اضغط **Commit changes**

#### الطريقة الثانية: بالأوامر (إذا عندك Git)
```powershell
cd C:\Users\007\website
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/poultry-prices.git
git push -u origin main
```

---

### 2️⃣ رفع على Cloudflare Pages

1. **اذهب إلى**: https://dash.cloudflare.com
2. **سجل دخول** أو **أنشئ حساب** (مجاني)
3. من القائمة الجانبية، اختر **Workers & Pages**
4. اضغط **Create application**
5. اختر تبويب **Pages**
6. اضغط **Connect to Git**
7. اختر **GitHub** وامنح الصلاحيات
8. اختر repository: `poultry-prices`
9. في الإعدادات:
   - **Production branch**: `main`
   - **Build command**: اتركه فارغاً
   - **Build output directory**: `/`
10. اضغط **Save and Deploy**
11. انتظر الـ deployment (دقيقة واحدة تقريباً)

---

### 3️⃣ إنشاء Cloudflare Worker للـ API

1. من نفس الصفحة، اضغط **Create** → **Create Worker**
2. اسمه: `poultry-api`
3. اضغط **Deploy**
4. اضغط **Edit code**
5. **احذف كل الكود** والصق محتوى ملف `worker.js`:

```javascript
// (انسخ محتوى worker.js من المجلد)
```

6. اضغط **Save and deploy**

---

### 4️⃣ إنشاء KV Namespace (قاعدة البيانات)

1. من القائمة الجانبية، اختر **Workers & Pages** → **KV**
2. اضغط **Create a namespace**
3. اسمه: `POULTRY_DATA`
4. اضغط **Add**
5. ارجع للـ Worker (`poultry-api`)
6. اضغط **Settings** → **Variables**
7. في قسم **KV Namespace Bindings**:
   - **Variable name**: `POULTRY_DATA`
   - **KV namespace**: اختر `POULTRY_DATA`
8. اضغط **Save**

---

### 5️⃣ ربط Worker بـ Pages (Routes)

1. اذهب لمشروع Pages الخاص بك
2. اضغط **Settings** → **Functions**
3. في **Routes**، أضف:
   ```
   /api/*
   ```
4. اختر Worker: `poultry-api`
5. اضغط **Save**

**أو** استخدم ملف `_routes.json`:

أنشئ ملف جديد في المجلد الرئيسي:

**📁 `_routes.json`**
```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/api/*"]
}
```

---

### 6️⃣ تحميل البيانات الأولية

1. افتح لوحة التحكم: `https://YOUR-PROJECT.pages.dev/admin/dashboard-full.html`
2. سيتم تحميل البيانات من `full-data.json` تلقائياً
3. اضغط **حفظ البيانات**
4. الآن البيانات محفوظة في Cloudflare KV!

---

### 7️⃣ ربط الدومين الخاص بك

1. من صفحة Pages project
2. اضغط **Custom domains**
3. اضغط **Set up a custom domain**
4. اكتب دومينك: `example.com`
5. اتبع التعليمات:
   - إذا الدومين على Cloudflare: سيتم الربط تلقائياً
   - إذا خارجي: أضف CNAME record يشير لـ `YOUR-PROJECT.pages.dev`

---

## ✅ كيف يعمل النظام؟

### لوحة التحكم (Dashboard):
1. تفتح: `yourdomain.com/admin/dashboard-full.html`
2. تعدل الأسعار
3. تضغط **حفظ**
4. البيانات تُحفظ في **Cloudflare KV**

### الموقع الرئيسي:
1. الزائر يفتح: `yourdomain.com`
2. السكريبت `auto-update.js` يشتغل تلقائياً
3. يقرأ البيانات من **Cloudflare KV**
4. يحدث الأسعار في الصفحة **فوراً**

---

## 🔒 حماية لوحة التحكم (اختياري)

### الطريقة 1: Cloudflare Access (مجاني)
1. من Cloudflare Dashboard → **Zero Trust**
2. **Access** → **Applications**
3. **Add an application**
4. **Self-hosted**
5. Application domain: `yourdomain.com`
6. Path: `/admin/*`
7. أضف Policy: Email = your@email.com
8. **Save**

### الطريقة 2: باسورد بسيط في الكود
أضف في أول `dashboard-full.html`:

```javascript
<script>
const correctPassword = 'YOUR_STRONG_PASSWORD';
const enteredPassword = prompt('🔒 أدخل كلمة المرور:');
if (enteredPassword !== correctPassword) {
    document.body.innerHTML = '<h1 style="text-align:center;margin-top:50px;">❌ كلمة مرور خاطئة</h1>';
    throw new Error('Access denied');
}
</script>
```

---

## 🎉 النتيجة النهائية

✅ **الموقع**: `yourdomain.com` (سريع، مجاني، SSL)  
✅ **لوحة التحكم**: `yourdomain.com/admin/dashboard-full.html`  
✅ **التحديث التلقائي**: عند التعديل يتحدث الموقع فوراً  
✅ **بدون تكلفة**: 100% مجاني على Cloudflare  

---

## 📞 ملاحظات مهمة

1. **الصور**: عند رفع شعار جديد في لوحة التحكم، سيتم تحميله محلياً. ارفعه يدوياً للمجلد الرئيسي على GitHub ثم commit + push
2. **السرعة**: Cloudflare KV سريع جداً (< 100ms)
3. **الحدود المجانية**:
   - 100,000 قراءة/يوم (كافية لآلاف الزوار)
   - 1,000 كتابة/يوم (أكثر من كافية)
4. **Backup**: KV يحتفظ بالنسخ الاحتياطية لمدة 7 أيام تلقائياً

---

## 🆘 مشاكل شائعة

### المشكلة: "API not found"
**الحل**: تأكد من ربط Worker بـ Pages في الخطوة 5

### المشكلة: "KV is not defined"
**الحل**: تأكد من إضافة KV binding في إعدادات Worker (الخطوة 4-7)

### المشكلة: البيانات لا تتحدث
**الحل**: 
1. افتح Console في المتصفح (F12)
2. شوف الأخطاء
3. تأكد من رفع ملف `auto-update.js`

---

**🎊 مبروك! موقعك الآن على الإنترنت بشكل احترافي!**
