const fs = require('fs');
const path = require('path');

// Configuration
const templatePath = path.join(__dirname, 'location_template.html');
const outputDir = __dirname; // Root directory for HTML files

// Venue Mappings
const venueData = {
    'London': ['The Savoy', 'Kew Gardens', 'The Shard', 'Natural History Museum', 'The Ned', 'Syon Park', 'Pembroke Lodge'],
    'Essex': ['Braxted Park', 'Gosfield Hall', 'Leez Priory', 'Hedingham Castle', 'Houchins', 'Crondon Park', 'Vaulty Manor', 'High House', 'Wivenhoe House', 'Hylands Estate', 'Boreham House'],
    'Surrey': ['Warren House', 'Coltsford Mill', 'Burningfold Manor', 'Botleys Mansion', 'Northbrook Park', 'Bury Court Barn', 'Cain Manor', 'Farnham Castle', 'Morden Hall'],
    'Kent': ['Penshurst Place', 'Chilston Park', 'Leeds Castle', 'Preston Court', 'Cooling Castle Barn', 'Hever Castle', 'Bradbourne House', 'The Ferry House', 'Eastwell Manor'],
    'Hampshire': ['Syrencot', 'Rhinefield House', 'Oakley Hall', 'Clock Barn', 'The Tithe Barn', 'Froyle Park', 'The Elvetham', 'Bombay Sapphire Distillery', 'Lainston House'],
    'Sussex': ['Nymans', 'South Lodge', 'Pelham House', 'Southend Barns', 'Upwaltham Barns', 'Cissbury Barns', 'Cowdray', 'Two Woods Estate'],
    'East Sussex': ['Pelham House', 'Stanmer House', 'The Grand Brighton', 'Wadhurst Castle'],
    'West Sussex': ['Nymans', 'South Lodge', 'Southend Barns', 'Upwaltham Barns', 'Cissbury Barns', 'Cowdray'],
    'Buckinghamshire': ['Hedsor House', 'Notley Abbey', 'Waddesdon Estate', 'Danesfield House', 'The Kings Chapel', 'Woughton House', 'Chartridge Lodge'],
    'Berkshire': ['Wasing Park', 'Taplow House', 'Highfield Park', 'Trunkwell House', 'Stanlake Park', 'Coworth Park', 'Cliveden House'],
    'Hertfordshire': ['Coltsfoot Country Retreat', 'Milling Barn', 'Offley Place', 'Hatfield House', 'Fanhams Hall', 'Knebworth House', 'Ashridge House', 'Micklefield Hall'],
    'Oxfordshire': ['Lains Barn', 'Oxford Town Hall', 'Bodleian Libraries', 'Caswell House', 'Tythe Barn Launton', 'Merriscourt', 'Blenheim Palace', 'Kirtlington Park'],
    'Suffolk': ['Hengrave Hall', 'Glemham Hall', 'Woodhall Manor', 'Bruisyard Country Estate', 'Hintlesham Hall'],
    'Norfolk': ['Chaucer Barn', 'Applewood Hall', 'Blickling Estate'],
    'Cambridgeshire': ['Holmewood Hall', 'Bassmead Manor Barns', 'The Old Hall Ely', 'Swynford Manor'],
    'Bristol': ['Leigh Court', 'Avon Gorge', 'Arnos Vale', 'Berwick Lodge', 'Bristol Museum'],
    'Cotswolds': ['Barnsley House', 'Cripps Barn', 'Stone Barn', 'Caswell House', 'Cowley Manor'],
    'Devon': ['Rockbeare Manor', 'Pynes House', 'Huntsham Court', 'Upton Barn', 'Deer Park'],
    'Cornwall': ['Tredudwell Manor', 'Tregenna Castle', 'Boconnoc', 'Polhawn Fort', 'Lusty Glaze'],
    'Dorset': ['Lulworth Castle', 'The Italian Villa', 'Highcliffe Castle', 'Athelhampton House'],
    'Bournemouth': ['The Royal Bath', 'The Green House', 'The Connaught'],
    'Chichester': ['Farbridge', 'Southend Barns', 'The Guildhall'],
    'Winchester': ['The Great Hall', 'Lainston House', 'Hotel du Vin'],
    'Southampton': ['Holiday Inn Eastleigh', 'Southampton Harbour Hotel'],
    'Portsmouth': ['Spinnaker Tower', 'Portsmouth Guildhall', 'Southsea Castle'],
    'Canterbury': ['Canterbury Cathedral Lodge', 'The PIG-at Bridge Place'],
    'Maidstone': ['Leeds Castle', 'Nettlestead Place', 'The Orangery', 'Bradbourne House'],
    'Colchester': ['Colchester Castle', 'St Osyth Priory', 'Wivenhoe House', 'Layer Marney Tower'],
    'Chelmsford': ['Leez Priory', 'Hylands Estate', 'Boreham House', 'Pontlands Park']
};

const locations = Object.keys(venueData);

// Add sub-locations if not already in venueData (copy from parent or default)
const subLocations = ['Somerset', 'Wiltshire', 'Gloucestershire', 'Suffolk', 'Norfolk', 'Norwich', 'Ipswich', 'Reading', 'Windsor', 'Oxford', 'Cambridge', 'Bath', 'Brighton', 'Southampton', 'Plymouth', 'Exeter', 'Southend', 'Tunbridge Wells', 'Guildford', 'Woking'];
subLocations.forEach(loc => {
    if (!venueData[loc]) {
        venueData[loc] = ['Beautiful Local Venues', 'Stunning Country Estates', 'Historic Town Halls'];
    }
});

// Refresh locations list
const finalLocations = Object.keys(venueData);

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

// Vimeo IDs (Real IDs from Portfolio)
const vimeoIds = ['843176714', '843191090', '701203514', '843200654', '776693718'];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Read Template
let template = fs.readFileSync(templatePath, 'utf8');

console.log(`Generating ${finalLocations.length} enhanced location pages...`);

finalLocations.forEach(loc => {
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

    // Replace Venue List
    const venues = venueData[loc] || [];
    const venueHtml = venues.map(v => `<span style="padding: 10px 20px; background: #fff; border: 1px solid #eee; border-radius: 5px; font-weight: 500;">${v}</span>`).join('\n');
    content = content.replace(/{{VenueList}}/g, venueHtml);

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
    sitemapContent += `  <url><loc>${baseUrl}/${page}</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>\n`;
});

// Add location pages
finalLocations.forEach(loc => {
    const filename = `wedding-videographer-${loc.toLowerCase().replace(/ /g, '-')}.html`;
    sitemapContent += `  <url><loc>${baseUrl}/${filename}</loc><lastmod>${today}</lastmod><priority>0.9</priority></url>\n`;
});

sitemapContent += sitemapEnd;
fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemapContent);

console.log('✓ Created: sitemap.xml');
console.log('Done.');
