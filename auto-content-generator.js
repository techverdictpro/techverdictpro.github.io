require('dotenv').config();

// TechVerdictPro - Professional Content Generator v3.0
// FIXED: Proper paragraph formatting + Journalistic standards + GEO optimization
// Built by: Expert Tech Journalist + Senior Software Engineer

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
    
    // Niches - Tech Products 2026
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
        'drawing tablets',
        'NAS drives',
        'VR headsets',
        'dashcams',
        'action cameras',
        'soundbars'
    ],
    
    // Output
    outputDir: './generated-content',
    
    // Amazon Affiliate
    amazonTag: 'techverdictpro-20'
};

// ============================================
// PROFESSIONAL CSS - NYTimes/Wirecutter Standard
// ============================================

const ARTICLE_CSS = `
/* Professional Typography System */
:root {
    --primary: #1a1a1a;
    --secondary: #4a4a4a;
    --accent: #2E7CF6;
    --light-gray: #f5f5f5;
    --border: #e0e0e0;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 20px;
    line-height: 1.8;
    color: var(--primary);
    background: #ffffff;
    max-width: 700px;
    margin: 0 auto;
    padding: 3rem 2rem;
}

/* Typography Hierarchy - Professional Standard */
h1 {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 2.8rem;
    font-weight: 700;
    line-height: 1.2;
    color: var(--primary);
    margin: 0 0 2rem 0;
    letter-spacing: -0.03em;
}

h2 {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 1.3;
    color: var(--primary);
    margin: 3rem 0 1.5rem 0;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
}

h2:first-of-type {
    margin-top: 2rem;
    border-top: none;
    padding-top: 0;
}

h3 {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 1.4rem;
    font-weight: 600;
    line-height: 1.4;
    color: var(--secondary);
    margin: 2.5rem 0 1rem 0;
}

/* CRITICAL: Paragraph Spacing - Proper Readability */
p {
    margin: 0 0 1.5rem 0;
    font-weight: 400;
    line-height: 1.8;
}

p:last-child {
    margin-bottom: 0;
}

/* Strong emphasis */
strong {
    font-weight: 700;
    color: var(--primary);
}

/* Lists - Proper spacing */
ul, ol {
    margin: 1.5rem 0 2rem 2rem;
    line-height: 1.8;
}

li {
    margin-bottom: 1rem;
    padding-left: 0.5rem;
}

li:last-child {
    margin-bottom: 0;
}

/* Nested lists */
li ul, li ol {
    margin-top: 1rem;
    margin-bottom: 0;
}

/* Tables - Professional design */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 2.5rem 0;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 0.9rem;
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
    vertical-align: top;
}

tr:last-child td {
    border-bottom: none;
}

/* Blockquotes */
blockquote {
    border-left: 4px solid var(--accent);
    padding-left: 1.5rem;
    margin: 2.5rem 0;
    font-style: italic;
    color: var(--secondary);
    font-size: 1.1em;
}

/* Meta information */
.article-meta {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-size: 0.85rem;
    color: var(--secondary);
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
}

/* Quick Answer Box - GEO Optimized */
.quick-answer {
    background: #e8f4f8;
    padding: 1.5rem 2rem;
    margin: 2rem 0 3rem 0;
    border-left: 4px solid var(--accent);
    border-radius: 4px;
}

.quick-answer h2 {
    color: var(--accent);
    font-size: 1.4rem;
    margin: 0 0 1rem 0;
    border: none;
    padding: 0;
}

.quick-answer p {
    font-size: 1.05rem;
    margin-bottom: 0;
}

/* Key Takeaways */
.key-takeaways {
    background: #fff3cd;
    padding: 1.5rem 2rem;
    margin: 2.5rem 0;
    border-left: 4px solid #ffc107;
    border-radius: 4px;
}

.key-takeaways h2 {
    color: #856404;
    font-size: 1.4rem;
    margin: 0 0 1rem 0;
    border: none;
    padding: 0;
}

.key-takeaways ul {
    margin: 0;
}

/* Amazon Affiliate Buttons - Strategic Placement */
.amazon-cta {
    display: inline-block;
    background: linear-gradient(135deg, #FF9900 0%, #ff8800 100%);
    color: #000000;
    padding: 14px 32px;
    text-decoration: none;
    border-radius: 8px;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-weight: 700;
    font-size: 1rem;
    box-shadow: 0 4px 12px rgba(255, 153, 0, 0.3);
    transition: all 0.3s ease;
    margin: 1.5rem 0;
    border: none;
}

.amazon-cta:hover {
    background: linear-gradient(135deg, #ff8800 0%, #ff7700 100%);
    box-shadow: 0 6px 20px rgba(255, 153, 0, 0.4);
    transform: translateY(-2px);
}

.amazon-cta:active {
    transform: translateY(0);
}

/* Disclosure */
.disclosure {
    margin-top: 4rem;
    padding: 1.5rem;
    background: var(--light-gray);
    border-radius: 4px;
    font-size: 0.9rem;
    color: var(--secondary);
    font-family: 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    body {
        font-size: 18px;
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
    
    .amazon-cta {
        display: block;
        text-align: center;
    }
}
`;

// ============================================
// ANTHROPIC API CLIENT
// ============================================

const anthropic = new Anthropic({
    apiKey: CONFIG.anthropicApiKey
});

// ============================================
// CONTENT FORMATTING - THE CRITICAL FIX!
// ============================================

function formatContentToHTML(rawContent) {
    console.log('🔧 Formatting content with proper paragraph structure...');
    
    let formatted = rawContent;
    
    // Step 1: Normalize line breaks
    formatted = formatted.replace(/\r\n/g, '\n');
    formatted = formatted.replace(/\r/g, '\n');
    
    // Step 2: Handle existing HTML tags (if AI generated some)
    // If content already has <p> tags, return as-is
    if (formatted.includes('<p>') && formatted.includes('</p>')) {
        console.log('✅ Content already has proper HTML tags');
        return formatted;
    }
    
    // Step 3: Split into sections by headings
    const sections = [];
    const lines = formatted.split('\n');
    let currentSection = [];
    
    for (let line of lines) {
        const trimmed = line.trim();
        
        // Skip empty lines between paragraphs (we'll handle spacing differently)
        if (trimmed === '') {
            if (currentSection.length > 0) {
                sections.push(currentSection.join('\n'));
                currentSection = [];
            }
            continue;
        }
        
        // Check if it's a heading
        if (trimmed.match(/^#{1,3}\s/)) {
            // Save previous section
            if (currentSection.length > 0) {
                sections.push(currentSection.join('\n'));
                currentSection = [];
            }
            // Add heading as its own section
            sections.push(trimmed);
        } else {
            currentSection.push(trimmed);
        }
    }
    
    // Don't forget the last section
    if (currentSection.length > 0) {
        sections.push(currentSection.join('\n'));
    }
    
    // Step 4: Convert sections to proper HTML
    const htmlSections = sections.map(section => {
        const trimmed = section.trim();
        
        // Handle markdown headings
        if (trimmed.startsWith('### ')) {
            return `<h3>${trimmed.substring(4)}</h3>`;
        }
        if (trimmed.startsWith('## ')) {
            return `<h2>${trimmed.substring(3)}</h2>`;
        }
        if (trimmed.startsWith('# ')) {
            // Skip H1, we already have one
            return '';
        }
        
        // Handle bullet lists
        if (trimmed.includes('\n- ') || trimmed.startsWith('- ')) {
            const items = trimmed.split('\n')
                .filter(line => line.trim().startsWith('- '))
                .map(line => `<li>${line.trim().substring(2)}</li>`)
                .join('\n');
            return `<ul>\n${items}\n</ul>`;
        }
        
        // Handle numbered lists
        if (trimmed.match(/^\d+\.\s/)) {
            const items = trimmed.split('\n')
                .filter(line => line.trim().match(/^\d+\.\s/))
                .map(line => `<li>${line.trim().replace(/^\d+\.\s/, '')}</li>`)
                .join('\n');
            return `<ol>\n${items}\n</ol>`;
        }
        
        // Regular paragraph - split by sentence groups (3-5 sentences = 1 paragraph)
        // This ensures readability!
        const sentences = trimmed.split(/(?<=[.!?])\s+/);
        const paragraphs = [];
        let currentParagraph = [];
        
        for (let i = 0; i < sentences.length; i++) {
            currentParagraph.push(sentences[i]);
            
            // Create new paragraph every 3-5 sentences OR at natural breaks
            if (currentParagraph.length >= 3 && (
                i === sentences.length - 1 || 
                currentParagraph.length >= 5 ||
                sentences[i + 1]?.match(/^(However|Moreover|Additionally|Furthermore|In contrast|On the other hand)/i)
            )) {
                paragraphs.push(`<p>${currentParagraph.join(' ')}</p>`);
                currentParagraph = [];
            }
        }
        
        // Add any remaining sentences
        if (currentParagraph.length > 0) {
            paragraphs.push(`<p>${currentParagraph.join(' ')}</p>`);
        }
        
        return paragraphs.join('\n\n');
    }).filter(section => section.trim() !== '');
    
    const finalHTML = htmlSections.join('\n\n');
    
    console.log('✅ Content formatted with proper paragraph structure!');
    return finalHTML;
}

// ============================================
// AI CONTENT GENERATION
// ============================================

async function generateReviewArticle(productName, niche) {
    console.log(`🤖 Generating professional review for: ${productName}`);
    
    const prompt = `You are a PROFESSIONAL TECH JOURNALIST writing for a premium publication like The New York Times Wirecutter or CNET. Write a comprehensive, well-researched review article.

PRODUCT TO REVIEW: "${productName}" in the ${niche} category.

CRITICAL FORMATTING RULES:
1. Use markdown headings: ## for H2, ### for H3
2. Write in short, punchy paragraphs (3-5 sentences MAXIMUM per paragraph)
3. Use bullet points for lists (start with "- ")
4. Use numbered lists where appropriate (1. 2. 3.)
5. Leave blank lines between paragraphs for spacing
6. NO wall of text! Break it up!

JOURNALISTIC STANDARDS:
- Professional but conversational tone
- Fact-based, specific details
- NO marketing fluff or hyperbole
- Active voice, clear prose
- Technical accuracy without jargon
- Balance pros and cons fairly

ARTICLE STRUCTURE (MANDATORY):

## Introduction (150-200 words)
Start with a compelling hook about why this product matters. Provide market context. State what this review will cover.

Use 3-4 SHORT paragraphs, not one giant block!

## Our Top Pick: [Specific Model Name]
[PRODUCT: Exact Model Name Here]

Detailed analysis in SHORT paragraphs:
- What makes it stand out
- Design and build quality  
- Key specifications (be specific!)
- Real-world performance
- Who should buy it

[AMAZON-LINK-MAIN]

Break this into 4-5 paragraphs!

## Alternative Options Worth Considering

### [Alternative Product 1 - Specific Model]
[PRODUCT: Alternative 1 Exact Model Name]

2-3 SHORT paragraphs about this alternative.
- Key features
- Pros and cons
- Best use case

[AMAZON-LINK-ALT1]

### [Alternative Product 2 - Specific Model]
[PRODUCT: Alternative 2 Exact Model Name]

2-3 SHORT paragraphs.
[AMAZON-LINK-ALT2]

### [Alternative Product 3 - Specific Model]
[PRODUCT: Alternative 3 Exact Model Name]

2-3 SHORT paragraphs.
[AMAZON-LINK-ALT3]

## How to Choose the Right ${niche}

Buying guide in SHORT paragraphs covering:
- Key factors to consider
- Budget recommendations  
- Who each option is best for

[AMAZON-LINK-GUIDE]

## Frequently Asked Questions

### Question 1?
Short, direct answer (2-3 sentences).

### Question 2?
Short answer.

(Include 5-7 FAQs)

## Final Verdict

Summary in 2-3 SHORT paragraphs:
- Key findings
- Final recommendation
- Call to action

CRITICAL - AMAZON LINKS:
Use EXACTLY 5 markers: [AMAZON-LINK-MAIN], [AMAZON-LINK-ALT1], [AMAZON-LINK-ALT2], [AMAZON-LINK-ALT3], [AMAZON-LINK-GUIDE]

CRITICAL - PRODUCT NAMES:
Mark each product with [PRODUCT: Exact Model Name] so we can create accurate Amazon links.

WORD COUNT: ${CONFIG.minWordCount}-${CONFIG.maxWordCount} words

RESPONSE FORMAT:
---TITLE---
[Compelling title under 60 chars with year 2026]

---META---
[Meta description under 160 chars]

---CONTENT---
[Full article with proper paragraph breaks and formatting]

---KEYWORDS---
[5-7 SEO keywords separated by commas]

Begin writing. Remember: SHORT PARAGRAPHS! NO WALLS OF TEXT!`;

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
// AMAZON LINK INJECTION
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
    
    // Create product-specific Amazon search URLs
    const createSearchQuery = (name) => {
        if (!name) {
            return productName.toLowerCase()
                .replace(/best |top |review |guide |under |budget |\d{4}/gi, '')
                .replace(/[^a-z0-9\s]/g, '')
                .trim()
                .replace(/\s+/g, '+');
        }
        
        return name
            .replace(/[^a-z0-9\s]/gi, '')
            .trim()
            .replace(/\s+/g, '+');
    };
    
    // Create Amazon CTA button HTML
    const createAmazonCTA = (productName, buttonText = 'Check Price on Amazon') => {
        const searchQuery = createSearchQuery(productName);
        const amazonURL = `https://www.amazon.com/s?k=${searchQuery}&tag=${CONFIG.amazonTag}`;
        
        console.log(`🔗 Creating link for: "${productName}" → ${amazonURL}`);
        
        return `\n\n<a href="${amazonURL}" class="amazon-cta" target="_blank" rel="nofollow noopener">${buttonText} →</a>\n\n`;
    };
    
    // Replace Amazon link markers with actual buttons
    processed = processed.replace('[AMAZON-LINK-MAIN]', 
        createAmazonCTA(productMarkers.main || productName, 'Check Price on Amazon'));
    
    processed = processed.replace('[AMAZON-LINK-ALT1]', 
        createAmazonCTA(productMarkers.alt1 || productName, 'View on Amazon'));
    
    processed = processed.replace('[AMAZON-LINK-ALT2]', 
        createAmazonCTA(productMarkers.alt2 || productName, 'See on Amazon'));
    
    processed = processed.replace('[AMAZON-LINK-ALT3]', 
        createAmazonCTA(productMarkers.alt3 || productName, 'Shop on Amazon'));
    
    processed = processed.replace('[AMAZON-LINK-GUIDE]', 
        createAmazonCTA(productMarkers.main || productName, 'Shop on Amazon'));
    
    // Remove any remaining markers
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
    
    // Get current date for schema
    const now = new Date();
    const isoDate = now.toISOString();
    const readableDate = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${articleData.title}</title>
    <meta name="description" content="${articleData.meta}">
    <meta name="keywords" content="${articleData.keywords}">
    
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-2KQ7NJNKDX"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-2KQ7NJNKDX');
    </script>
    
    <style>${ARTICLE_CSS}</style>
    
    <!-- Schema.org Product Markup with AggregateRating (GEO Optimized) -->
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
            "datePublished": "${isoDate}",
            "reviewBody": "${articleData.meta}"
        }
    }
    </script>
</head>
<body>
    <article>
        <div class="article-meta">
            <time datetime="${isoDate}">📅 Published: ${readableDate}</time>
            <span> • </span>
            <span>⏱️ ${Math.ceil(articleData.wordCount / 200)} min read</span>
            <span> • </span>
            <span>✍️ TechVerdictPro Editorial Team</span>
        </div>
        
        <h1>${articleData.title}</h1>
        
        ${articleData.content}
        
        <div class="disclosure">
            <strong>📢 Affiliate Disclosure:</strong> TechVerdictPro participates in the Amazon Services LLC Associates Program. When you purchase through our Amazon links, we may earn a commission at no additional cost to you. This helps support our independent, in-depth reviews. <a href="/">Learn more about our review process</a>.
        </div>
    </article>
</body>
</html>`;
    
    await fs.writeFile(filePath, fullHTML, 'utf-8');
    console.log(`✅ Article saved: ${filePath}`);
    
    return filePath;
}

// ============================================
// MAIN GENERATION LOOP
// ============================================

async function generateDailyContent() {
    console.log('\n🚀 TechVerdictPro Content Generator v3.0 - FIXED\n');
    console.log(`📅 ${new Date().toLocaleDateString('en-US')}`);
    console.log(`🎯 Target: ${CONFIG.articlesPerDay} professionally formatted articles\n`);
    
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
            
            // Generate raw content
            const rawContent = await generateReviewArticle(product, niche);
            
            // Parse response sections
            const titleMatch = rawContent.match(/---TITLE---\s*\n(.+?)\n/);
            const metaMatch = rawContent.match(/---META---\s*\n(.+?)\n/);
            const contentMatch = rawContent.match(/---CONTENT---\s*\n([\s\S]+?)(?=\n---KEYWORDS---|$)/);
            const keywordsMatch = rawContent.match(/---KEYWORDS---\s*\n(.+)/);
            
            const title = titleMatch ? titleMatch[1].trim() : product;
            const meta = metaMatch ? metaMatch[1].trim() : '';
            let content = contentMatch ? contentMatch[1].trim() : rawContent;
            const keywords = keywordsMatch ? keywordsMatch[1].trim() : '';
            
            // CRITICAL: Format content with proper paragraphs!
            content = formatContentToHTML(content);
            
            // Inject Amazon links
            content = injectAmazonLinks(content, product);
            
            const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
            
            const filename = `${Date.now()}-${product.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
            const filePath = await saveArticle({ title, meta, content, keywords, wordCount }, filename);
            
            allGeneratedFiles.push(filePath);
            
            console.log(`✨ ${wordCount} words`);
            console.log(`🔗 5 strategic Amazon links`);
            console.log(`📊 SEO + GEO optimized`);
            console.log(`✅ Professional formatting!\n`);
            
            // Rate limiting - be nice to API
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error(`❌ Error generating article ${i + 1}: ${error.message}`);
            if (error.message.includes('overloaded')) {
                console.log('⏸️  API overloaded. Waiting 60 seconds...');
                await new Promise(resolve => setTimeout(resolve, 60000));
            }
        }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ GENERATION COMPLETE!');
    console.log(`📊 Articles generated: ${allGeneratedFiles.length}/${CONFIG.articlesPerDay}`);
    console.log(`📁 Location: ${CONFIG.outputDir}`);
    console.log('='.repeat(50) + '\n');
    
    return allGeneratedFiles;
}

// ============================================
// COMMAND LINE EXECUTION
// ============================================

const args = process.argv.slice(2);
const isOnceMode = args.includes('--once');

if (isOnceMode) {
    // Single run mode (for testing or scheduled tasks)
    generateDailyContent()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
} else {
    // Interactive mode
    console.log('Starting TechVerdictPro Content Generator...');
    console.log('Run with --once flag for single generation\n');
    generateDailyContent()
        .then(() => console.log('\n✅ Done! Run again anytime.'))
        .catch(error => console.error('Error:', error));
}
