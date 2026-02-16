const fs = require('fs');
const path = require('path');

// Configuration
const templatePath = path.join(__dirname, 'location_template.html');
const outputDir = __dirname; // Root directory for HTML files

// List of locations to target
const locations = [
    'London', 'Essex', 'Surrey', 'Kent', 'Hampshire', 'Sussex',
    'East Sussex', 'West Sussex', 'Hertfordshire', 'Buckinghamshire',
    'Berkshire', 'Oxfordshire', 'Suffolk', 'Norfolk', 'Cambridgeshire',
    'Brighton', 'Bristol', 'Bath', 'Cotswolds', 'Cornwall', 'Devon',
    'Dorset', 'Somerset', 'Wiltshire', 'Gloucestershire', 'Chelmsford',
    'Colchester', 'Southend', 'Canterbury', 'Maidstone', 'Tunbridge Wells',
    'Guildford', 'Woking', 'Reading', 'Windsor', 'Oxford', 'Cambridge',
    'Norwich', 'Ipswich', 'Southampton', 'Portsmouth', 'Winchester',
    'Chichester', 'Bournemouth', 'Exeter', 'Plymouth'
];

// Image assets to rotate through to keep pages looking slightly different
const heroImages = [
    'assets/images/beth_andy_hero.jpg',
    'assets/images/abbie_and_richwed-478.jpg',
    'assets/images/dani_ben_wedding-353.jpg',
    'assets/images/hedsor_kiss.jpg',
    'assets/images/maya_and_peter_sunset.jpg'
];

const secondImages = [
    'assets/images/alexis_confetti.jpg',
    'assets/images/dani_ben_wedding-569.jpg',
    'assets/images/daniel_holly.jpg',
    'assets/images/kayleigh_sparklers.jpg',
    'assets/images/confetti-and-silk-london-wedding-videographer-20.jpg'
];

const contactImages = [
    'assets/images/abbie_rich_contact.jpg',
    'assets/images/lucy_ceremony.jpg',
    'assets/images/dani_ben_wedding-629.jpg'
];

// Vimeo IDs to rotate (replace with actual specific videos if available later)
const vimeoIds = [
    '876543210', '123456789', '987654321', '567890123'
];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Read Template
let template = fs.readFileSync(templatePath, 'utf8');

console.log(`Generating ${locations.length} location pages...`);

locations.forEach(loc => {
    let content = template;

    // Create specific filename SEO friendly
    // e.g. "wedding-videographer-essex.html"
    const filename = `wedding-videographer-${loc.toLowerCase().replace(/ /g, '-')}.html`;

    // Replace Placeholders
    // Note: We use a regex with 'g' flag to replace ALL instances of {{Location}}
    content = content.replace(/{{Location}}/g, loc);

    // Rotate Images
    content = content.replace(/{{HeroImage}}/g, getRandom(heroImages));
    content = content.replace(/{{SecondImage}}/g, getRandom(secondImages));
    content = content.replace(/{{ContactImage}}/g, getRandom(contactImages));

    // Rotate Videos (Mock IDs for now, assume generic portfolio)
    content = content.replace(/{{VimeoID1}}/g, getRandom(vimeoIds));
    content = content.replace(/{{VimeoID2}}/g, getRandom(vimeoIds));

    // Select a venue placeholder if we wanted to get fancy, but for now generic is fine
    // The template has "At Storyboard, we specialise..."

    // Write File
    fs.writeFileSync(path.join(outputDir, filename), content);
    console.log(`✓ Created: ${filename}`);
});

console.log('Generating sitemap.xml...');

// Generate Sitemap
const sitemapStart = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
const sitemapEnd = `</urlset>`;

let sitemapContent = sitemapStart;
const today = new Date().toISOString().split('T')[0];
const baseUrl = 'https://storyboardvideos.co.uk'; // Update this if domain changes

// Add main pages
const mainPages = ['index.html', 'about-us.html', 'pricing.html', 'portfolio.html', 'contact.html', 'blog.html'];
mainPages.forEach(page => {
    sitemapContent += `  <url>
    <loc>${baseUrl}/${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
});

// Add location pages
locations.forEach(loc => {
    const filename = `wedding-videographer-${loc.toLowerCase().replace(/ /g, '-')}.html`;
    sitemapContent += `  <url>
    <loc>${baseUrl}/${filename}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
});

sitemapContent += sitemapEnd;
fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemapContent);

console.log('✓ Created: sitemap.xml');
console.log('Done.');
