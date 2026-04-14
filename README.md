# ⚡ TechWise Pro - Quick Start Guide

## 🚀 Бързо Стартиране (15 минути)

### Стъпка 1: Инсталация на Dependencies

```bash
# Clone или download проекта
cd techwise-pro

# Инсталирай dependencies
npm install
```

### Стъпка 2: Конфигурация

Създай `.env` файл:

```env
# Claude API
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Affiliate IDs
AMAZON_TAG=yoursite-20
EBAY_CAMPAIGN_ID=your-campaign-id
ALIEXPRESS_AFFILIATE_ID=your-affiliate-id

# Site
SITE_URL=https://yoursite.com
SITE_NAME=TechWise Pro

# AdSense (optional)
ADSENSE_ID=ca-pub-your-id-here
```

### Стъпка 3: Първо Тестово Генериране

```bash
# Генерирай 4 test статии:
npm run generate

# Провери резултата:
ls -la generated-content/
```

### Стъпка 4: Стартирай Автоматизацията

```bash
# За continuous автоматизация (24/7):
npm start

# Или setup cron job за daily генериране:
crontab -e

# Добави:
0 2 * * * cd /path/to/techwise-pro && npm run generate >> logs/cron.log 2>&1
```

---

## 📁 Структура на Файловете

```
techwise-pro/
│
├── auto-revenue-site.html          # Main landing page
├── auto-content-generator.js       # AI content generator (core)
├── package.json                    # Dependencies
├── .env                            # Configuration (create this)
│
├── styles/
│   └── article.css                 # Styling for articles
│
├── generated-content/              # AI-generated articles (auto-created)
│   ├── article-1.html
│   ├── article-2.html
│   └── ...
│
├── wordpress-plugin/               # WordPress integration (optional)
│   └── techwise-auto-publisher.php
│
├── logs/                           # System logs (auto-created)
│   └── cron.log
│
└── SETUP-GUIDE.md                  # Full detailed guide
```

---

## 🔑 Какво Трябва да Имаш

### 1. Claude API Key (**ЗАДЪЛЖИТЕЛНО**)
```
1. Отиди на: https://console.anthropic.com
2. Sign up / Login
3. Add payment method (credit card)
4. Create API Key от Settings
5. Copy key в .env файл
```

**Цена:** ~€15-30/месец за 100-150 статии

### 2. Affiliate Accounts (Препоръчително от Ден 1)

**Amazon Associates:**
- URL: https://affiliate-program.amazon.com
- Free регистрация
- Нужен е сайт (може и този)

**eBay Partner Network:**
- URL: https://partnernetwork.ebay.com
- Free регистрация

**AliExpress (чрез Admitad):**
- URL: https://www.admitad.com
- Free регистрация

### 3. Хостинг (може и по-късно)

За testing: Може да работиш local
За production: VPS или shared hosting (€10-20/месец)

**Препоръки:**
- SiteGround: $3.99/месец (promo)
- DigitalOcean: $6/месец
- Cloudways: $11/месец

---

## ⚙️ Основни Команди

```bash
# Генерирай съдържание веднъж и спри
npm run generate

# Стартирай continuous режим (24/7)
npm start

# Test конфигурацията
node auto-content-generator.js --help
```

---

## 📊 Какво Очаква

### Първо Стартиране:
```
🚀 Стартиране на AI Content Generator...
📅 Дата: 2026-02-10
🎯 Цел: 4 статии

📝 Статия 1/4
📂 Ниша: gaming laptops
🎯 Продукт: Best Budget Gaming Laptops Under 1000

🤖 Генериране на review за: Best Budget Gaming Laptops Under 1000...
✨ Генерирани 1847 думи
🔗 Affiliate линкове: добавени
📊 SEO: оптимизирано

[... repeat for all 4 articles ...]

============================================================
✅ ГОТОВО!
📊 Генерирани статии: 4/4
📁 Локация: ./generated-content
============================================================
```

---

## 🎯 След Генерирането

### 1. Прегледай Статиите
```bash
# Отвори една статия в browser:
open generated-content/[filename].html

# Или виж в text editor
```

### 2. Upload на Сайта
```bash
# Ако имаш хостинг, upload чрез FTP:
# - auto-revenue-site.html → root directory
# - generated-content/ → /articles/
# - styles/ → /styles/
```

### 3. Submit към Google
```
1. Отиди на: https://search.google.com/search-console
2. Add property (твоя домейн)
3. Submit sitemap
4. Изчакай 1-2 седмици за индексиране
```

---

## ❓ FAQ

### Q: Защо моите статии не генерират приход?
A: Нормално е! Трафик идва след 3-6 месеца от Google SEO. Трябва patience.

### Q: Колко струва да работи?
A: 
- Claude API: €15-30/месец
- Хостинг: €10-20/месец (optional първите месеци)
- Домейн: €10/година
- **Total: ~€25-50/месец**

### Q: Може ли без Claude API да работи?
A: Не. AI генерирането е core функционалността. Без API няма automation.

### Q: Трябва ли WordPress?
A: Не е задължително. Може:
- Статичен HTML (това което имаш)
- WordPress (по-лесно за manage)
- Други CMS

### Q: Кога ще започна да печеля?
A: Реалистично:
- Месец 1-3: €0-50
- Месец 4-6: €100-500
- Месец 7+: €500-2,000+

### Q: Колко време отнема поддръжката?
A: 
- Setup: 4-8 часа (веднъж)
- Weekly: 1-2 часа
- Monthly: 2-3 часа

---

## 🆘 Troubleshooting

### "API Error: Invalid API Key"
```bash
# Провери .env файла:
cat .env

# API key трябва да започва с: sk-ant-
# Ако няма такъв файл, създай го
```

### "Module not found: @anthropic-ai/sdk"
```bash
# Инсталирай dependencies:
npm install
```

### "Permission denied"
```bash
# Дай execute права:
chmod +x auto-content-generator.js
```

### Статиите са с лошо качество
```javascript
// В auto-content-generator.js промени:
articlesPerDay: 2,  // Намали на 2 за по-quality съдържание
minWordCount: 2000, // Increase word count
```

---

## 🎓 Учебни Ресурси

**Claude API:**
- Docs: https://docs.anthropic.com
- Examples: https://github.com/anthropics/anthropic-sdk-typescript

**SEO:**
- Google Search Central: https://developers.google.com/search
- Moz Guide: https://moz.com/beginners-guide-to-seo

**Affiliate Marketing:**
- Amazon Associates: https://affiliate-program.amazon.com/help
- Income School (YouTube): Great affiliate tutorials

---

## 📞 Support

**Bug Reports:**
Open issue на GitHub (ако имаш repo)

**Questions:**
Прочети SETUP-GUIDE.md за detailed инструкции

---

## ✅ Next Steps Checklist

- [ ] Инсталирай Node.js
- [ ] Clone/Download проекта
- [ ] `npm install`
- [ ] Създай .env файл с API key
- [ ] Регистрирай affiliate accounts
- [ ] Test: `npm run generate`
- [ ] Прегледай генерираните статии
- [ ] Setup хостинг
- [ ] Upload файловете
- [ ] Setup Google Search Console
- [ ] Изчакай... и следи analytics

---

## 🚀 Успех!

Remember:
1. **Patience** - SEO отнема време (3-6 месеци)
2. **Consistency** - Keep генерирането daily
3. **Quality** - AI е добър, но прегледай статиите
4. **Analytics** - Track и оптимизирай

Всичко е настроено за **автоматизация** ✅

Сега просто трябва да го **стартираш** и да **изчакаш** 🎯

**Target:** €2,000/месец след 6-12 месеца е **ВЪЗМОЖЕН** ако следваш плана! 💰

---

Made with ⚡ by TechWise Pro | Powered by Claude AI 🤖
