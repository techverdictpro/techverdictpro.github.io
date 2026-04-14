// update-manifest.js - Auto-update articles manifest
// Run this script after generating new articles to update the manifest

const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
    articlesDir: './generated-content',
    manifestPath: './articles-manifest.json',
    baseUrl: '/articles'
};

// Category detection from filename
function detectCategory(filename) {
    const lower = filename.toLowerCase();
    
    if (lower.includes('laptop')) return 'laptop';
    if (lower.includes('monitor') || lower.includes('display')) return 'monitor';
    if (lower.includes('headphone') || lower.includes('earbuds') || lower.includes('audio')) return 'headphone';
    if (lower.includes('keyboard')) return 'keyboard';
    if (lower.includes('mouse') || lower.includes('mice')) return 'mouse';
    if (lower.includes('webcam') || lower.includes('camera')) return 'webcam';
    if (lower.includes('speaker')) return 'speaker';
    if (lower.includes('phone')) return 'phone';
    if (lower.includes('watch')) return 'watch';
    
    return 'tech';
}

// Extract title from HTML file
async function extractTitle(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        if (titleMatch) {
            return titleMatch[1].replace(' - TechVerdictPro', '').trim();
        }
    } catch (error) {
        console.warn(`Could not extract title from ${filePath}`);
    }
    
    // Fallback: generate from filename
    const filename = path.basename(filePath, '.html');
    return filename
        .replace(/^\d+-/, '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Extract excerpt from HTML file
async function extractExcerpt(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const metaMatch = content.match(/<meta name="description" content="([^"]+)"/i);
        if (metaMatch) {
            return metaMatch[1];
        }
        
        // Fallback: first paragraph
        const pMatch = content.match(/<p>([^<]+)<\/p>/i);
        if (pMatch) {
            return pMatch[1].substring(0, 150) + '...';
        }
    } catch (error) {
        console.warn(`Could not extract excerpt from ${filePath}`);
    }
    
    return 'Expert review with in-depth analysis, specifications, and buying recommendations.';
}

// Main function
async function updateManifest() {
    console.log('🔄 Updating articles manifest...\n');
    
    try {
        // Read all HTML files from articles directory
        const files = await fs.readdir(CONFIG.articlesDir);
        const htmlFiles = files.filter(f => f.endsWith('.html')).sort().reverse();
        
        console.log(`📂 Found ${htmlFiles.length} HTML files\n`);
        
        // Load existing manifest or create new
        let manifest = {
            version: '1.0',
            lastUpdated: new Date().toISOString(),
            articles: []
        };
        
        try {
            const existing = await fs.readFile(CONFIG.manifestPath, 'utf-8');
            manifest = JSON.parse(existing);
        } catch (error) {
            console.log('📝 Creating new manifest\n');
        }
        
        // Build articles array
        const articles = [];
        
        for (const file of htmlFiles) {
            const filePath = path.join(CONFIG.articlesDir, file);
            const stats = await fs.stat(filePath);
            
            // Extract ID from filename (timestamp)
            const idMatch = file.match(/^(\d+)/);
            const id = idMatch ? idMatch[1] : Date.now().toString();
            
            // Check if article already exists in manifest
            const existing = manifest.articles.find(a => a.id === id);
            
            const article = {
                id,
                title: existing?.title || await extractTitle(filePath),
                url: `${CONFIG.baseUrl}/${file}`,
                category: existing?.category || detectCategory(file),
                date: existing?.date || stats.birthtime.toISOString().split('T')[0],
                excerpt: existing?.excerpt || await extractExcerpt(filePath),
                views: existing?.views || 0
            };
            
            articles.push(article);
            
            console.log(`✅ ${article.title}`);
            console.log(`   Category: ${article.category}`);
            console.log(`   Date: ${article.date}\n`);
        }
        
        // Update manifest
        manifest.lastUpdated = new Date().toISOString();
        manifest.articles = articles;
        
        // Save manifest
        await fs.writeFile(
            CONFIG.manifestPath,
            JSON.stringify(manifest, null, 2),
            'utf-8'
        );
        
        console.log('='.repeat(60));
        console.log('✅ MANIFEST UPDATED SUCCESSFULLY');
        console.log(`📊 Total articles: ${articles.length}`);
        console.log(`📁 Saved to: ${CONFIG.manifestPath}`);
        console.log('='.repeat(60));
        console.log('\n💡 Next steps:');
        console.log('1. Upload articles-manifest.json to GitHub root directory');
        console.log('2. Upload article HTML files to /articles/ directory');
        console.log('3. Refresh your website to see the updates!\n');
        
    } catch (error) {
        console.error('❌ Error updating manifest:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    updateManifest();
}

module.exports = { updateManifest };
