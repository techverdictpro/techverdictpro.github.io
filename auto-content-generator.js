// auto-content-generator.js
// AI-Powered Content Generation System for Passive Income
// Използва Claude API за автоматично генериране на review статии

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');

// ============================================
// КОНФИГУРАЦИЯ
// ============================================

const CONFIG = {
    // Claude API
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || 'your-api-key-here',
    model: 'claude-sonnet-4-20250514',
    
    // Content Settings
    articlesPerDay: 4,
    minWordCount: 1500,
    maxWordCount: 2500,
    
    // Niches (можеш да добавиш повече)
    niches: [
        'gaming laptops',
        'wireless headphones',
        'smart watches',
        'mechanical keyboards',
        'webcams',
        'monitors',
        'phone cases',
        'power banks',
        'bluetooth speakers',
        'fitness trackers'
    ],
    
    // Affiliate Links
    affiliateLinks: {
        amazon: 'https://www.amazon.com/?tag=your-tag',
        ebay: 'https://www.ebay.com/partner/your-id',
        aliexpress: 'https://www.aliexpress.com/?aff=your-id'
    },
    
    // SEO Settings
    targetKeywords: true,
    includeSchema: true,
    internalLinking: true,
    
    // Output
    outputDir: './generated-content',
    publishToWordPress: false // Настрой WordPress API ако искаш автоматично публикуване
};

// ============================================
// CLAUDE AI CLIENT
// ============================================

const anthropic = new Anthropic({
    apiKey: CONFIG.anthropicApiKey,
});

// ============================================
// AI CONTENT GENERATOR
// ============================================

async function generateReviewArticle(product, niche) {
    console.log(`🤖 Генериране на review за: ${product}...`);
    
    const prompt = `Създай изключително качествена и подробна review статия за ${product} в нишата "${niche}".

ИЗИСКВАНИЯ:
1. Дължина: ${CONFIG.minWordCount}-${CONFIG.maxWordCount} думи
2. SEO оптимизирано с естествено вградени keywords
3. Структура:
   - Завладяващо въведение (защо този продукт е важен)
   - Спецификации и характеристики
   - Предимства и недостатъци
   - Сравнение с конкуренти (поне 2-3 алтернативи)
   - Кой трябва да го закупи
   - Често задавани въпроси (5-7)
   - Заключение с препоръка

4. Стил:
   - Професионален но приятелски тон
   - Обективен и балансиран анализ
   - Конкретни примери и use cases
   - Технически точен но разбираем за обикновените потребители

5. SEO елементи:
   - Title tag (max 60 символа)
   - Meta description (max 160 символа)
   - H1, H2, H3 структура
   - Ключови думи: "best ${product}", "${product} review", "top ${product}"

6. ВАЖНО: Включи маркери [AFFILIATE-AMAZON], [AFFILIATE-EBAY], [AFFILIATE-ALIEXPRESS] на 3-4 места където би били уместни affiliate линкове.

Формат на отговора:
---TITLE---
[заглавие тук]

---META---
[meta description тук]

---CONTENT---
[пълното HTML съдържание с правилна структура]

---KEYWORDS---
[comma-separated keywords]

Започни сега:`;

    const message = await anthropic.messages.create({
        model: CONFIG.model,
        max_tokens: 4000,
        messages: [{
            role: 'user',
            content: prompt
        }]
    });
    
    return message.content[0].text;
}

// ============================================
// KEYWORD RESEARCH
// ============================================

async function findTrendingProducts(niche) {
    console.log(`🔍 Търсене на trending продукти в: ${niche}...`);
    
    const prompt = `Генерирай списък с точно 5 trending/популярни продукти в нишата "${niche}" за 2026.

КРИТЕРИИ:
- Високо търсене в Google
- Добър потенциал за affiliate продажби
- Продукти с множество налични модели/версии (за сравнение)
- Ценова категория €50-€500

Формат: Връщай само имената на продуктите, всеки на нов ред, без номерация или допълнителен текст.

Пример формат:
Best Budget Gaming Laptop Under 1000
Top Wireless Noise Cancelling Headphones
Premium Mechanical Keyboard for Gaming`;

    const message = await anthropic.messages.create({
        model: CONFIG.model,
        max_tokens: 500,
        messages: [{
            role: 'user',
            content: prompt
        }]
    });
    
    const products = message.content[0].text
        .split('\n')
        .filter(line => line.trim())
        .slice(0, 5);
    
    return products;
}

// ============================================
// AFFILIATE LINK INJECTION
// ============================================

function injectAffiliateLinks(content) {
    // Replace placeholder markers with actual affiliate links
    let processed = content;
    
    processed = processed.replace(
        /\[AFFILIATE-AMAZON\]/g,
        `<a href="${CONFIG.affiliateLinks.amazon}" target="_blank" rel="nofollow sponsored" class="affiliate-link amazon">Виж в Amazon →</a>`
    );
    
    processed = processed.replace(
        /\[AFFILIATE-EBAY\]/g,
        `<a href="${CONFIG.affiliateLinks.ebay}" target="_blank" rel="nofollow sponsored" class="affiliate-link ebay">Виж в eBay →</a>`
    );
    
    processed = processed.replace(
        /\[AFFILIATE-ALIEXPRESS\]/g,
        `<a href="${CONFIG.affiliateLinks.aliexpress}" target="_blank" rel="nofollow sponsored" class="affiliate-link aliexpress">Виж в AliExpress →</a>`
    );
    
    return processed;
}

// ============================================
// SEO OPTIMIZATION
// ============================================

function addSEOMarkup(content, title, keywords) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Review",
        "name": title,
        "reviewBody": content.substring(0, 500) + "...",
        "datePublished": new Date().toISOString(),
        "author": {
            "@type": "Organization",
            "name": "TechWise Pro"
        }
    };
    
    return `
<!-- SEO Schema Markup -->
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>

<!-- Keywords: ${keywords} -->
    `;
}

// ============================================
// FILE OPERATIONS
// ============================================

async function saveArticle(articleData, filename) {
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    
    const filePath = path.join(CONFIG.outputDir, filename);
    const fullHTML = `
<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${articleData.title}</title>
    <meta name="description" content="${articleData.meta}">
    ${articleData.seoMarkup}
    <link rel="stylesheet" href="../styles/article.css">
</head>
<body>
    <article class="review-article">
        <header>
            <h1>${articleData.title}</h1>
            <div class="meta-info">
                <time datetime="${new Date().toISOString()}">${new Date().toLocaleDateString('bg-BG')}</time>
                <span class="reading-time">Време за четене: ${Math.ceil(articleData.wordCount / 200)} мин</span>
            </div>
        </header>
        
        <div class="article-content">
            ${articleData.content}
        </div>
        
        <footer class="article-footer">
            <div class="disclosure">
                ℹ️ Тази статия съдържа affiliate линкове. Може да получим комисионна при покупка, без допълнителна цена за вас.
            </div>
        </footer>
    </article>
    
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-ID"
         crossorigin="anonymous"></script>
</body>
</html>
    `;
    
    await fs.writeFile(filePath, fullHTML, 'utf-8');
    console.log(`✅ Статия записана: ${filePath}`);
    
    return filePath;
}

// ============================================
// MAIN AUTOMATION LOOP
// ============================================

async function generateDailyContent() {
    console.log('\n🚀 Стартиране на AI Content Generator...\n');
    console.log(`📅 Дата: ${new Date().toLocaleDateString('bg-BG')}`);
    console.log(`🎯 Цел: ${CONFIG.articlesPerDay} статии\n`);
    
    const allGeneratedFiles = [];
    
    for (let i = 0; i < CONFIG.articlesPerDay; i++) {
        try {
            // Pick random niche
            const niche = CONFIG.niches[Math.floor(Math.random() * CONFIG.niches.length)];
            
            // Find trending products in this niche
            const products = await findTrendingProducts(niche);
            const product = products[0]; // Use first product
            
            console.log(`\n📝 Статия ${i + 1}/${CONFIG.articlesPerDay}`);
            console.log(`📂 Ниша: ${niche}`);
            console.log(`🎯 Продукт: ${product}\n`);
            
            // Generate article
            const rawContent = await generateReviewArticle(product, niche);
            
            // Parse the response
            const titleMatch = rawContent.match(/---TITLE---\s*\n(.+?)\n/);
            const metaMatch = rawContent.match(/---META---\s*\n(.+?)\n/);
            const contentMatch = rawContent.match(/---CONTENT---\s*\n([\s\S]+?)(?=\n---KEYWORDS---|$)/);
            const keywordsMatch = rawContent.match(/---KEYWORDS---\s*\n(.+)/);
            
            const title = titleMatch ? titleMatch[1].trim() : product;
            const meta = metaMatch ? metaMatch[1].trim() : '';
            let content = contentMatch ? contentMatch[1].trim() : rawContent;
            const keywords = keywordsMatch ? keywordsMatch[1].trim() : '';
            
            // Inject affiliate links
            content = injectAffiliateLinks(content);
            
            // Add SEO markup
            const seoMarkup = addSEOMarkup(content, title, keywords);
            
            // Calculate word count
            const wordCount = content.split(/\s+/).length;
            
            // Save article
            const filename = `${Date.now()}-${product.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
            const filePath = await saveArticle({
                title,
                meta,
                content,
                keywords,
                seoMarkup,
                wordCount
            }, filename);
            
            allGeneratedFiles.push(filePath);
            
            console.log(`✨ Генерирани ${wordCount} думи`);
            console.log(`🔗 Affiliate линкове: добавени`);
            console.log(`📊 SEO: оптимизирано\n`);
            
            // Delay to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error(`❌ Грешка при генериране на статия ${i + 1}:`, error.message);
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ ГОТОВО!');
    console.log(`📊 Генерирани статии: ${allGeneratedFiles.length}/${CONFIG.articlesPerDay}`);
    console.log(`📁 Локация: ${CONFIG.outputDir}`);
    console.log('='.repeat(60) + '\n');
    
    return allGeneratedFiles;
}

// ============================================
// SCHEDULING (Cron Job Alternative)
// ============================================

async function runAutomation() {
    console.log('⚙️  TechWise Pro - AI Content Automation System');
    console.log('🤖 Powered by Claude AI (Anthropic)\n');
    
    // Run once immediately
    await generateDailyContent();
    
    // Then run every 24 hours
    const HOURS_24 = 24 * 60 * 60 * 1000;
    setInterval(async () => {
        console.log('\n🔄 Автоматично генериране (планирано)...\n');
        await generateDailyContent();
    }, HOURS_24);
}

// ============================================
// CLI INTERFACE
// ============================================

if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--once')) {
        // Run once and exit
        generateDailyContent()
            .then(() => process.exit(0))
            .catch(err => {
                console.error('Fatal error:', err);
                process.exit(1);
            });
    } else if (args.includes('--help')) {
        console.log(`
TechWise Pro - AI Content Generator

Usage:
  node auto-content-generator.js           Run continuously (24h intervals)
  node auto-content-generator.js --once    Generate content once and exit
  node auto-content-generator.js --help    Show this help

Environment Variables:
  ANTHROPIC_API_KEY    Your Claude API key (required)

Configuration:
  Edit CONFIG object in the script to customize:
  - articlesPerDay
  - niches
  - affiliate links
  - SEO settings
        `);
    } else {
        // Run continuously
        runAutomation();
    }
}

module.exports = {
    generateDailyContent,
    generateReviewArticle,
    findTrendingProducts,
    CONFIG
};
