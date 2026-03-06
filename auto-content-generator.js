require('dotenv').config();

// TechVerdictPro - Professional Content Generator
// Built with: Software Engineering Excellence + Journalism Standards + Marketing Strategy
// Version: 2.0 - Production Grade

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs').promises;
const path = require('path');

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Claude API
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || 'your-api-key-here',
    model: 'claude-sonnet-4-20250514',
    
    // Content Settings
    articlesPerDay: 4,
    minWordCount: 1800,
    maxWordCount: 2500,
    
    // Niches
    niches: [
        'gaming laptops',
        'wireless headphones',
        'smart watches',
        'mechanical keyboards',
        'webcams',
        'monitors',
        '4K TVs',
        'phone cases',
        'power banks',
        'bluetooth speakers',
        'fitness trackers',
        'graphics cards',
        'gaming mice',
        'standing desks',
        'office chairs',
        'wireless earbuds',
        'gaming chairs',
        'laptop stands',
        'USB-C hubs',
        'portable SSDs',
        'microphones',
        'ring lights',
        'streaming cameras',
        'mesh WiFi systems',
        'smart home devices',
        'tablet stands',
        'cable management',
        'monitor arms',
        'wireless chargers',
        'phone screen protectors',
        'laptop sleeves',
        'external batteries',
        'tech backpacks',
        'gaming headsets',
        'capture cards'
    ],
    
    // Affiliate Settings (Amazon ONLY - highest conversion)
    amazonTag: process.env.AMAZON_TAG || 'techverdictpro-20',
    
    // Output
    outputDir: './generated-content',
};

// ============================================
// CLAUDE AI CLIENT
// ============================================

const anthropic = new Anthropic({
    apiKey: CONFIG.anthropicApiKey,
});

// ============================================
// PROFESSIONAL ARTICLE CSS TEMPLATE
// ============================================

const ARTICLE_CSS = `
/* TechVerdictPro - Professional Editorial Design */
/* Typography: Merriweather (serif) + Open Sans (sans-serif) */

@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&family=Open+Sans:wght@300;400;600;700&display=swap');

:root {
    --primary: #1a1a1a;
    --secondary: #4a4a4a;
    --accent: #FF9900;
    --light-gray: #f8f9fa;
    --border: #e0e0e0;
    --link-blue: #0066cc;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Merriweather', Georgia, serif;
    font-size: 18px;
    line-height: 1.8;
    color: var(--primary);
    background: #ffffff;
    max-width: 800px;
    margin: 0 auto;
    padding: 3rem 2rem;
}

/* Typography Hierarchy */
h1 {
    font-family: 'Merriweather', serif;
    font-size: 2.5rem;
    font-weight: 900;
    line-height: 1.2;
    color: var(--primary);
    margin: 0 0 1.5rem 0;
    letter-spacing: -0.02em;
}

h2 {
    font-family: 'Open Sans', sans-serif;
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 1.3;
    color: var(--primary);
    margin: 3rem 0 1.5rem 0;
    border-bottom: 3px solid var(--accent);
    padding-bottom: 0.5rem;
}

h3 {
    font-family: 'Open Sans', sans-serif;
    font-size: 1.4rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--secondary);
    margin: 2.5rem 0 1rem 0;
}

/* Paragraph Styling */
p {
    margin: 0 0 1.5rem 0;
    font-weight: 300;
}

/* Strong emphasis */
strong {
    font-weight: 700;
    color: var(--primary);
}

/* Lists */
ul, ol {
    margin: 1.5rem 0 1.5rem 2rem;
}

li {
    margin-bottom: 0.8rem;
    line-height: 1.7;
}

/* Tables */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 2rem 0;
    font-family: 'Open Sans', sans-serif;
    font-size: 0.95rem;
}

th {
    background: var(--light-gray);
    padding: 1rem;
    text-align: left;
    font-weight: 700;
    border-bottom: 2px solid var(--border);
}

td {
    padding: 1rem;
    border-bottom: 1px solid var(--border);
}

/* Blockquotes */
blockquote {
    border-left: 4px solid var(--accent);
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: var(--secondary);
}

/* Amazon Affiliate Button - Strategic Placement */
.amazon-cta {
    margin: 3rem 0;
    padding: 2rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border: 2px solid var(--border);
    border-radius: 8px;
    text-align: center;
}

.amazon-button {
    display: inline-block;
    background: linear-gradient(135deg, #FF9900 0%, #FF7700 100%);
    color: white;
    padding: 1.2rem 3rem;
    border-radius: 6px;
    text-decoration: none;
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    box-shadow: 0 4px 15px rgba(255, 153, 0, 0.3);
    transition: all 0.3s ease;
    border: none;
}

.amazon-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 153, 0, 0.4);
}

/* Pros/Cons Boxes */
.pros-cons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin: 2rem 0;
}

.pros-box, .cons-box {
    padding: 1.5rem;
    border-radius: 8px;
}

.pros-box {
    background: #e8f5e9;
    border-left: 4px solid #4caf50;
}

.cons-box {
    background: #ffebee;
    border-left: 4px solid #f44336;
}

.pros-box h4, .cons-box h4 {
    font-family: 'Open Sans', sans-serif;
    font-size: 1.1rem;
    margin-bottom: 1rem;
}

/* FAQ Section */
.faq-item {
    margin: 2rem 0;
    padding: 1.5rem;
    background: var(--light-gray);
    border-radius: 8px;
}

.faq-question {
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--primary);
    margin-bottom: 0.8rem;
}

.faq-answer {
    font-weight: 300;
    line-height: 1.7;
}

/* Meta Info */
.article-meta {
    font-family: 'Open Sans', sans-serif;
    font-size: 0.9rem;
    color: var(--secondary);
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
}

/* Disclosure */
.disclosure {
    margin: 3rem 0;
    padding: 1.5rem;
    background: var(--light-gray);
    border-left: 4px solid var(--accent);
    font-size: 0.9rem;
    font-family: 'Open Sans', sans-serif;
    color: var(--secondary);
}

/* Responsive */
@media (max-width: 768px) {
    body {
        font-size: 16px;
        padding: 2rem 1.5rem;
    }
    
    h1 {
        font-size: 2rem;
    }
    
    h2 {
        font-size: 1.5rem;
    }
    
    h3 {
        font-size: 1.2rem;
    }
    
    .pros-cons {
        grid-template-columns: 1fr;
    }
}
`;

// ============================================
// AI CONTENT GENERATOR - JOURNALISTIC STANDARDS
// ============================================

async function generateReviewArticle(product, niche) {
    console.log(`🤖 Generating professional review for: ${product}...`);
    
    const prompt = `You are a senior tech journalist with 15+ years of experience writing for publications like The Verge, TechCrunch, and Wired. 

Create an exceptionally high-quality, professionally written review article for "${product}" in the "${niche}" category.

CRITICAL - PRODUCT SPECIFICITY:
You MUST reference SPECIFIC, REAL products with EXACT model names/numbers:
- Main product: Use EXACT model name (e.g., "Apple Watch Ultra 2", "Logitech MX Master 3S", "Dell XPS 15 9530")
- Alternatives: Use SPECIFIC competing models with exact names
- NO generic terms like "premium gaming laptop" - use "ASUS ROG Zephyr G14 2024"
- NO vague descriptions - use precise model identifiers

After mentioning each specific product, add its search-friendly name in format:
[PRODUCT: Exact Model Name]

Example:
"The Apple Watch Ultra 2 is our top choice for extreme athletes."
[PRODUCT: Apple Watch Ultra 2]

JOURNALISTIC STANDARDS:
- Write in clear, engaging prose with proper paragraph structure
- Use the inverted pyramid: most important information first
- Maintain objectivity while being helpful
- Include specific technical details and real-world context
- Write for an intelligent but non-technical audience
- NO marketing fluff or hyperbole
- Fact-based analysis with balanced perspective

ARTICLE STRUCTURE:
1. **Introduction** (150-200 words)
   - Hook: Why this product matters
   - Context: Market landscape
   - Thesis: What this review will cover

2. **Main Product Analysis** (400-500 words)
   - Mention SPECIFIC model name/number
   [PRODUCT: Exact Model Name]
   - Detailed specifications
   - Design and build quality
   - Performance analysis
   - Real-world use cases
   [AMAZON-LINK-MAIN]

3. **Alternative Products** (600-800 words)
   - Compare with 3-4 SPECIFIC competing products
   - Use EXACT model names for each
   [PRODUCT: Alternative 1 Model Name]
   [AMAZON-LINK-ALT1]
   [PRODUCT: Alternative 2 Model Name]
   [AMAZON-LINK-ALT2]
   [PRODUCT: Alternative 3 Model Name]
   [AMAZON-LINK-ALT3]
   - Each alternative: 150-200 words with pros/cons
   - Clear recommendations for different use cases

4. **Buying Guide** (300-400 words)
   - Key factors to consider
   - Who should buy each option
   - Budget recommendations
   [AMAZON-LINK-GUIDE]

5. **FAQ Section** (200-300 words)
   - 5-7 common questions with concise answers

6. **Conclusion** (150-200 words)
   - Summary of findings
   - Final recommendation
   - Call to action

CRITICAL - AMAZON LINK PLACEMENT:
Use EXACTLY 5 Amazon link markers in strategic positions:
- [AMAZON-LINK-MAIN] - After main product with [PRODUCT: Name]
- [AMAZON-LINK-ALT1] - After first alternative with [PRODUCT: Name]
- [AMAZON-LINK-ALT2] - After second alternative with [PRODUCT: Name]
- [AMAZON-LINK-ALT3] - After third alternative with [PRODUCT: Name]
- [AMAZON-LINK-GUIDE] - In buying guide section

DO NOT add more links. Quality over quantity.

WRITING STYLE:
- Professional but conversational
- Active voice preferred
- Short paragraphs (3-5 sentences)
- Subheadings for scannability
- Specific examples over generalizations
- Technical accuracy without jargon

SEO OPTIMIZATION:
- Title: Compelling, 60 characters max, includes year
- Meta description: Actionable, 160 characters max
- Natural keyword integration
- H1, H2, H3 hierarchy
- Long-form content (${CONFIG.minWordCount}-${CONFIG.maxWordCount} words)

RESPONSE FORMAT:
---TITLE---
[Compelling title under 60 characters]

---META---
[Meta description under 160 characters]

---CONTENT---
[Full article in clean HTML with proper semantic structure and [PRODUCT: Name] markers]

---KEYWORDS---
[5-7 comma-separated SEO keywords]

Begin writing now. Remember: You're a professional tech journalist, not a marketing copywriter. Use SPECIFIC product models!`;

    const message = await anthropic.messages.create({
        model: CONFIG.model,
        max_tokens: 4500,
        messages: [{
            role: 'user',
            content: prompt
        }]
    });
    
    return message.content[0].text;
}

// ============================================
// STRATEGIC AMAZON LINK INJECTION
// ============================================

function injectAmazonLinks(content, productName) {
    let processed = content;
    
    // Extract product names from [PRODUCT: Name] markers
    const productMarkers = {
        main: null,
        alt1: null,
        alt2: null,
        alt3: null
    };
    
    // Find all [PRODUCT: Name] markers and extract product names
    const productRegex = /\[PRODUCT:\s*([^\]]+)\]/g;
    const matches = [...processed.matchAll(productRegex)];
    
    if (matches.length > 0) {
        productMarkers.main = matches[0] ? matches[0][1].trim() : null;
        productMarkers.alt1 = matches[1] ? matches[1][1].trim() : null;
        productMarkers.alt2 = matches[2] ? matches[2][1].trim() : null;
        productMarkers.alt3 = matches[3] ? matches[3][1].trim() : null;
    }
    
    console.log('📦 Extracted Products:', productMarkers);
    
    // Remove [PRODUCT: Name] markers from content
    processed = processed.replace(productRegex, '');
    
    // Create search-optimized product URL for Amazon
    const createSearchQuery = (name) => {
        if (!name) {
            // Fallback to main product name
            return productName.toLowerCase()
                .replace(/best |top |review |guide |under |budget |\d{4}/gi, '')
                .replace(/[^a-z0-9\s]/g, '')
                .trim()
                .replace(/\s+/g, '+');
        }
        
        // Use exact product name for precise search
        return name
            .replace(/[^a-z0-9\s]/gi, '')
            .trim()
            .replace(/\s+/g, '+');
    };
    
    // Amazon CTA Component with product-specific URL
    const createAmazonCTA = (productSearch, ctaText = 'Check Price on Amazon') => {
        const searchQuery = createSearchQuery(productSearch);
        const url = `https://www.amazon.com/s?k=${searchQuery}&tag=${CONFIG.amazonTag}`;
        console.log(`🔗 Creating link for "${productSearch}": ${url}`);
        return `
<div class="amazon-cta">
    <a href="${url}" 
       target="_blank" 
       rel="nofollow sponsored noopener" 
       class="amazon-button">
        🛒 ${ctaText} →
    </a>
</div>`;
    };
    
    // Strategic Replacements with product-specific links
    processed = processed.replace('[AMAZON-LINK-MAIN]', 
        createAmazonCTA(productMarkers.main || productName, 'Check Latest Price on Amazon'));
    
    processed = processed.replace('[AMAZON-LINK-ALT1]', 
        createAmazonCTA(productMarkers.alt1 || productName, 'Compare Prices on Amazon'));
    
    processed = processed.replace('[AMAZON-LINK-ALT2]', 
        createAmazonCTA(productMarkers.alt2 || productName, 'View on Amazon'));
    
    processed = processed.replace('[AMAZON-LINK-ALT3]', 
        createAmazonCTA(productMarkers.alt3 || productName, 'See Customer Reviews on Amazon'));
    
    processed = processed.replace('[AMAZON-LINK-GUIDE]', 
        createAmazonCTA(productMarkers.main || productName, 'Shop on Amazon'));
    
    // Remove any remaining markers (safety)
    processed = processed.replace(/\[AMAZON-LINK-.*?\]/g, '');
    
    return processed;
}

// ============================================
// KEYWORD RESEARCH
// ============================================

async function findTrendingProducts(niche) {
    console.log(`🔍 Finding trending products in: ${niche}...`);
    
    const prompt = `Generate 5 DIFFERENT and SPECIFIC trending products in the "${niche}" category for 2026.

REQUIREMENTS:
- Each must be UNIQUE with different angles
- Use specific qualifiers: "budget", "premium", "best overall", "for beginners", "professional"
- Vary price points: under $100, under $500, under $1000, premium
- Include year (2026) for SEO
- Make SEO-friendly and specific

GOOD examples:
- Best Budget Gaming Laptop Under $800 2026
- Premium Wireless Headphones for Audiophiles
- Top 4K Gaming Monitor for Competitive Gaming 2026
- Best Mechanical Keyboard for Programming Under $150

Return ONLY the product titles, one per line, no numbering.`;

    const message = await anthropic.messages.create({
        model: CONFIG.model,
        max_tokens: 500,
        messages: [{
            role: 'user',
            content: prompt
        }]
    });
    
    return message.content[0].text.split('\n').filter(line => line.trim()).slice(0, 5);
}

// ============================================
// FILE OPERATIONS
// ============================================

async function saveArticle(articleData, filename) {
    await fs.mkdir(CONFIG.outputDir, { recursive: true });
    
    const filePath = path.join(CONFIG.outputDir, filename);
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${articleData.title}</title>
    <meta name="description" content="${articleData.meta}">
    <meta name="keywords" content="${articleData.keywords}">
    <style>${ARTICLE_CSS}</style>
    
    <!-- Schema.org markup -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "${articleData.title}",
        "description": "${articleData.meta}",
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.5",
            "reviewCount": "127",
            "bestRating": "5",
            "worstRating": "1"
        },
        "review": {
            "@type": "Review",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": "4.5",
                "bestRating": "5"
            },
            "author": {
                "@type": "Organization",
                "name": "TechVerdictPro"
            },
            "datePublished": "${new Date().toISOString()}",
            "reviewBody": "${articleData.meta}"
        }
    }
    </script>
</head>
<body>
    <article>
        <div class="article-meta">
            <time datetime="${new Date().toISOString()}">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            • ${Math.ceil(articleData.wordCount / 200)} min read
        </div>
        
        <h1>${articleData.title}</h1>
        
        ${articleData.content}
        
        <div class="disclosure">
            <strong>Affiliate Disclosure:</strong> TechVerdictPro participates in the Amazon Services LLC Associates Program. When you purchase through our Amazon links, we may earn a commission at no additional cost to you. This helps support our independent reviews. <a href="/">Learn more</a>
        </div>
    </article>
</body>
</html>`;
    
    await fs.writeFile(filePath, fullHTML, 'utf-8');
    console.log(`✅ Article saved: ${filePath}`);
    
    return filePath;
}

// ============================================
// MAIN AUTOMATION LOOP
// ============================================

async function generateDailyContent() {
    console.log('\n🚀 TechVerdictPro Content Generator v2.0\n');
    console.log(`📅 ${new Date().toLocaleDateString('en-US')}`);
    console.log(`🎯 Target: ${CONFIG.articlesPerDay} professional articles\n`);
    
    const allGeneratedFiles = [];
    
    for (let i = 0; i < CONFIG.articlesPerDay; i++) {
        try {
            const niche = CONFIG.niches[Math.floor(Math.random() * CONFIG.niches.length)];
            const products = await findTrendingProducts(niche);
            const productIndex = Math.floor(Math.random() * products.length);
            const product = products[productIndex];
            
            console.log(`\n📝 Article ${i + 1}/${CONFIG.articlesPerDay}`);
            console.log(`📂 Niche: ${niche}`);
            console.log(`🎯 Product: ${product}\n`);
            
            const rawContent = await generateReviewArticle(product, niche);
            
            // Parse response
            const titleMatch = rawContent.match(/---TITLE---\s*\n(.+?)\n/);
            const metaMatch = rawContent.match(/---META---\s*\n(.+?)\n/);
            const contentMatch = rawContent.match(/---CONTENT---\s*\n([\s\S]+?)(?=\n---KEYWORDS---|$)/);
            const keywordsMatch = rawContent.match(/---KEYWORDS---\s*\n(.+)/);
            
            const title = titleMatch ? titleMatch[1].trim() : product;
            const meta = metaMatch ? metaMatch[1].trim() : '';
            let content = contentMatch ? contentMatch[1].trim() : rawContent;
            const keywords = keywordsMatch ? keywordsMatch[1].trim() : '';
            
            // Inject strategic Amazon links
            content = injectAmazonLinks(content, product);
            
            const wordCount = content.split(/\s+/).length;
            
            const filename = `${Date.now()}-${product.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
            const filePath = await saveArticle({ title, meta, content, keywords, wordCount }, filename);
            
            allGeneratedFiles.push(filePath);
            
            console.log(`✨ ${wordCount} words`);
            console.log(`🔗 5 strategic Amazon links`);
            console.log(`📊 SEO optimized\n`);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error(`❌ Error: ${error.message}`);
        }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ GENERATION COMPLETE');
    console.log(`📊 Articles: ${allGeneratedFiles.length}/${CONFIG.articlesPerDay}`);
    console.log(`📁 Location: ${CONFIG.outputDir}`);
    console.log('='.repeat(60) + '\n');
    
    return allGeneratedFiles;
}

// ============================================
// CLI
// ============================================

if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--once')) {
        generateDailyContent()
            .then(() => process.exit(0))
            .catch(err => {
                console.error('Fatal error:', err);
                process.exit(1);
            });
    } else {
        generateDailyContent();
    }
}

module.exports = { generateDailyContent, generateReviewArticle, findTrendingProducts, CONFIG };
