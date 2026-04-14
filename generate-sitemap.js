// generate-sitemap.js - Automatic Sitemap Generator for TechVerdictPro

const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
    domain: 'https://techverdictpro.com',
    articlesDir: './generated-content',
    outputPath: './sitemap.xml'
};

async function generateSitemap() {
    console.log('🗺️  Generating sitemap...\n');
    
    try {
        // Read all HTML files
        const files = await fs.readdir(CONFIG.articlesDir);
        const htmlFiles = files.filter(f => f.endsWith('.html')).sort().reverse();
        
        console.log(`📄 Found ${htmlFiles.length} articles\n`);
        
        // Start XML
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${CONFIG.domain}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Articles Index -->
  <url>
    <loc>${CONFIG.domain}/articles/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Articles -->\n`;
        
        // Add each article
        for (const file of htmlFiles) {
            const stats = await fs.stat(path.join(CONFIG.articlesDir, file));
            const lastmod = stats.mtime.toISOString().split('T')[0];
            
            xml += `  <url>
    <loc>${CONFIG.domain}/articles/${file}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
            
            console.log(`✅ ${file}`);
        }
        
        // Close XML
        xml += `</urlset>`;
        
        // Save sitemap
        await fs.writeFile(CONFIG.outputPath, xml, 'utf-8');
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ SITEMAP GENERATED SUCCESSFULLY');
        console.log(`📊 Total URLs: ${htmlFiles.length + 2}`);
        console.log(`📁 Saved to: ${CONFIG.outputPath}`);
        console.log('='.repeat(60));
        console.log('\n💡 Next steps:');
        console.log('1. Upload sitemap.xml to GitHub root directory');
        console.log('2. Submit to Google Search Console');
        console.log('3. URL: https://techverdictpro.com/sitemap.xml\n');
        
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        process.exit(1);
    }
}

// Run
if (require.main === module) {
    generateSitemap();
}

module.exports = { generateSitemap };
