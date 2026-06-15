const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const Perfume = require('./models/Perfume');
const Review = require('./models/Review');
const Order = require('./models/Order');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection Middleware (ensures connection in serverless environment)
const connectDB = async (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://abhaykashyap2804_db_user:Abhay%40123@kannauj.ev9aerc.mongodb.net/kannauj_perfumes?appName=kannauj';
    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB');
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
};

app.use(connectDB);

// Custom Blend Name and Description Generator Map
const blendAlchemyData = {
  'Mitti Attar': {
    'Ruh Gulab': {
      name: 'Vapor of Roses',
      desc: 'An exquisite marriage of earth and bloom. The warm, rain-kissed aroma of baked clay (Mitti) provides an anchor for the intense, honeyed sweetness of Damask Rose (Ruh Gulab). Smells like roses blooming in wet monsoon soil.'
    },
    'Royal Jasmine': {
      name: 'Nectar of the Monsoon',
      desc: 'A sensual, nocturnal blend. The heavy, sweet, and creamy floral notes of Midnight Jasmine float gracefully over the rustic, mineral, and dry scent of wet soil.'
    },
    'Citrus': {
      name: 'Silt & Citrus',
      desc: 'A bright, fresh, and grounded blend. Sparkling, zesty citrus top notes burst forth and slowly transition into the calming, earthy scent of baked river clay.'
    },
    'Saffron': {
      name: 'Gilded Earth',
      desc: 'A rare, luxurious fusion. The bittersweet, leathery warmth of Kashmiri Saffron merges with the soothing, mineral character of Mitti Attar, dried on a rich sandalwood base.'
    }
  },
  'Ruh Khus': {
    'Ruh Gulab': {
      name: 'Desert Oasis',
      desc: 'A contrast of cool and warm. The deep, cooling, green, and smoky grass aroma of Vetiver (Ruh Khus) provides a fresh backdrop that cuts through the rich, heavy floral sweetness of Damask Rose.'
    },
    'Royal Jasmine': {
      name: 'Midnight Garden',
      desc: 'An intense, herbaceous-floral profile. Cooling vetiver roots ground the exotic, sweet, and indolic properties of Jasmine, creating a perfume reminiscent of damp forest floor covered in jasmine petals.'
    },
    'Citrus': {
      name: 'Forest Rain',
      desc: 'An invigorating green freshness. Lively, crisp citrus top notes fuse seamlessly with the smoky, damp, and earthy grass notes of wild Indian vetiver.'
    },
    'Saffron': {
      name: 'Crimson Forest',
      desc: 'A woody, spicy, and deep aroma. Bitter-sweet golden saffron threads thread through the cooling, green vetiver roots, creating a highly sophisticated and mysterious sillage.'
    }
  },
  'Shamama Attar': {
    'Ruh Gulab': {
      name: 'Spiced Rose',
      desc: 'A majestic, oriental blend. The dark, complex, warm spice blend of Shamama (clove, patchouli, cardamom) wraps around the sweet, voluptuous heart of the Rose, mimicking ancient royal court scents.'
    },
    'Royal Jasmine': {
      name: 'Mystic Jasmine',
      desc: 'A bold, warm, and highly seductive blend. Over forty rare herbs and spices of Shamama form a dense, smoky, and resinous blanket under the sweet, high-pitch floral notes of Jasmine.'
    },
    'Citrus': {
      name: 'Spiced Orange',
      desc: 'A festive, warm, and uplifting fragrance. Tangy, zesty citrus cuts through the rich, heavy, and warming herbal-spice composition of the co-distilled Shamama base.'
    },
    'Saffron': {
      name: 'Imperial Saffron',
      desc: 'The ultimate royal attar. Golden saffron co-distilled with the multi-layered warming spices and agarwood resin of Shamama, creating an incredibly rich, leathery, and long-lasting aroma.'
    }
  }
};

// ==========================================================================
// API Routes
// ==========================================================================

// 1. Get all perfumes
app.get('/api/perfumes', async (req, res) => {
  try {
    const perfumes = await Perfume.find({});
    res.json(perfumes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching perfumes catalog', error: error.message });
  }
});

// 2. Get a single perfume details
app.get('/api/perfumes/:id', async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.id);
    if (!perfume) {
      return res.status(404).json({ message: 'Perfume not found' });
    }
    res.json(perfume);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching perfume details', error: error.message });
  }
});

// 3. Get reviews for a perfume
app.get('/api/perfumes/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ perfumeId: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product reviews', error: error.message });
  }
});

// 4. Post a new review
app.post('/api/perfumes/:id/reviews', async (req, res) => {
  try {
    const { author, rating, comment } = req.body;
    if (!author || !rating || !comment) {
      return res.status(400).json({ message: 'All review fields (author, rating, comment) are required.' });
    }

    const perfume = await Perfume.findById(req.params.id);
    if (!perfume) {
      return res.status(404).json({ message: 'Perfume not found.' });
    }

    // Save review
    const newReview = new Review({
      perfumeId: req.params.id,
      author,
      rating: Number(rating),
      comment
    });
    await newReview.save();

    // Recalculate perfume average rating
    const allReviews = await Review.find({ perfumeId: req.params.id });
    const totalRating = allReviews.reduce((sum, rev) => sum + rev.rating, 0);
    const avgRating = Number((totalRating / allReviews.length).toFixed(1));
    
    perfume.rating = avgRating;
    await perfume.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: 'Error saving product review', error: error.message });
  }
});

// 5. Post a new order (Checkout)
app.post('/api/orders', async (req, res) => {
  try {
    const { items, totalAmount, customerDetails } = req.body;
    
    if (!items || items.length === 0 || !totalAmount || !customerDetails) {
      return res.status(400).json({ message: 'Order details and customer details are required.' });
    }

    const newOrder = new Order({
      items,
      totalAmount,
      customerDetails
    });
    
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error placing your order', error: error.message });
  }
});

// 6. Calculate custom blend (Layering Studio API)
app.post('/api/layering/blend', (req, res) => {
  const { baseNote, topNote } = req.body;

  if (!baseNote || !topNote) {
    return res.status(400).json({ message: 'Base note and top note must be selected.' });
  }

  // Base note price lookup
  const basePrices = {
    'Mitti Attar': 1850,
    'Ruh Khus': 1650,
    'Shamama Attar': 1950
  };

  // Top note price lookup
  const topPrices = {
    'Ruh Gulab': 1200, // half size/proportion
    'Royal Jasmine': 950,
    'Citrus': 600,
    'Saffron': 1400
  };

  const basePrice = basePrices[baseNote] || 1500;
  const topPrice = topPrices[topNote] || 800;
  
  // Custom blend price formula: average + custom blending fee (300 INR)
  const calculatedPrice = Math.round((basePrice + topPrice) * 0.85 + 300);

  // Look up blend details
  let name = `${baseNote.split(' ')[0]}-${topNote.split(' ')[0]} Blend`;
  let desc = `A custom scent crafted by you, layering the grounding base of ${baseNote} with the exquisite top notes of ${topNote}. Fully cured in copper pots.`;

  if (blendAlchemyData[baseNote] && blendAlchemyData[baseNote][topNote]) {
    name = blendAlchemyData[baseNote][topNote].name;
    desc = blendAlchemyData[baseNote][topNote].desc;
  }

  res.json({
    baseNote,
    topNote,
    name,
    description: desc,
    price: calculatedPrice,
    imagePath: '/assets/custom_blend.png' // Default blending bottle image
  });
});

// Start Server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
  });
}

module.exports = app;

