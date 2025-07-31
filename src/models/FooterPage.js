const mongoose = require('mongoose');

const SocialLinksSchema = new mongoose.Schema({
  facebook: { type: String, default: 'https://www.facebook.com/adryteradvertising' },
  instagram: { type: String, default: 'https://www.instagram.com/adryter_advvertising/#' },
  linkedin: { type: String, default: 'https://www.linkedin.com/company/adryter-advertising' },
  youtube: { type: String, default: 'https://www.youtube.com/@adryteradvvertising' }
}, { _id: false });

const FooterPageSchema = new mongoose.Schema({
  
  logo: { type: String, default: '/images/Adryte.png' },
  
 
  aboutHeading: { type: String, default: 'About Office' },
  address1: { type: String, default: '2nd floor, Sylco Sons Square, Near Rathod Patang, Roxy, Gwalior 474001' },
  address2: { type: String, default: 'Office No. 401, 4th Floor, Mont Vert Apex, Baner Rd, Baner, Pune-411045. (MH)' },
  

  supportHeading: { type: String, default: 'For Support' },
  phone1: { type: String, default: '+91-7738538548' },
  phone2: { type: String, default: '+91-8815075867' },
  
 
  copyright: { type: String, default: '© 2025 AdRyter Advertising' },
  privacyLink: { type: String, default: '/privacy-policy' },
  tncLink: { type: String, default: '/terms-conditions' },
  

  social: { type: SocialLinksSchema, default: () => ({}) }
}, { timestamps: true });

module.exports = mongoose.model('FooterPage', FooterPageSchema); 