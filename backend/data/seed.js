const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Perfume = require('../models/Perfume');
const Review = require('../models/Review');

dotenv.config();

const perfumesData = [
  {
    name: "Mitti Attar",
    category: "Heritage Attar",
    description: "The legendary 'Scent of Rain'. Crafted by capturing the vapor of baked clay on clean river silt, distilled into pure sandalwood oil. It captures the exact aroma of dry earth kissed by the first monsoon showers.",
    price: 1850,
    imagePath: "/assets/mitti_attar.png",
    notes: {
      top: "Wet Clay, Baked Silt",
      heart: "Baked Earth, Warm Dust",
      base: "Pure Sandalwood Oil"
    },
    longevity: 5,
    sillage: 3,
    rating: 4.8
  },
  {
    name: "Ruh Khus",
    category: "Heritage Attar",
    description: "A liquid emerald distilled from the roots of wild vetiver grass (*Vetiveria zizanioides*) found in the swamps of Uttar Pradesh. It is cooling, earthy, deeply green, and has a rich, smoky undercurrent.",
    price: 1650,
    imagePath: "/assets/ruh_khus.png",
    notes: {
      top: "Wild Vetiver, Green Grass",
      heart: "Damp Earth, Deep Moss",
      base: "Woody Vetiver Roots"
    },
    longevity: 5,
    sillage: 4,
    rating: 4.9
  },
  {
    name: "Ruh Gulab",
    category: "Signature Attar",
    description: "The pure essential oil of the Damask Rose (*Rosa damascena*), hydro-distilled in copper degs at dawn. It takes approximately 4 tons of hand-plucked roses to produce just 1 kilogram of this majestic nectar.",
    price: 2400,
    imagePath: "/assets/ruh_gulab.png",
    notes: {
      top: "Fresh Damask Rose petals",
      heart: "Warm Honey, Dewy Rosebud",
      base: "Rich Rose Nectar"
    },
    longevity: 4,
    sillage: 5,
    rating: 4.9
  },
  {
    name: "Shamama Attar",
    category: "Heritage Attar",
    description: "A dark, complex, warming attar prepared through the co-distillation of over 40 rare herbs, spices, roots, and tree barks. It is aged for months in sandalwood base, making it the perfect winter companion.",
    price: 1950,
    imagePath: "/assets/shamama_attar.png",
    notes: {
      top: "Saffron, Cardamom, Black Pepper",
      heart: "Clove, Patchouli, Cyperus",
      base: "Agarwood (Oudh), Sandalwood, Benzoin"
    },
    longevity: 5,
    sillage: 5,
    rating: 4.7
  },
  {
    name: "Royal Jasmine",
    category: "Signature Attar",
    description: "The intoxicating aroma of Midnight Jasmine (*Chameli*), hydro-distilled into a sandalwood oil base. It captures the sweet, narcotic, and creamy floral notes of summer nights in India.",
    price: 1550,
    imagePath: "/assets/royal_jasmine.png",
    notes: {
      top: "Jasmine Blossom, Neroli",
      heart: "Mogra (Arabian Jasmine)",
      base: "Creamy Sandalwood"
    },
    longevity: 4,
    sillage: 4,
    rating: 4.8
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kannauj_perfumes';
    console.log('Connecting to MongoDB at:', mongoUri);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing collections...');
    await Perfume.deleteMany({});
    await Review.deleteMany({});

    console.log('Seeding perfumes...');
    const insertedPerfumes = await Perfume.insertMany(perfumesData);
    console.log(`Seeded ${insertedPerfumes.length} perfumes successfully.`);

    console.log('Seeding reviews...');
    const reviewsData = [
      {
        perfumeId: insertedPerfumes[0]._id, // Mitti Attar
        author: "Aarav Sharma",
        rating: 5,
        comment: "This is pure magic. It smells exactly like the dry parched soil of my childhood home when the first drops of rain fall. Incredible craftsmanship!"
      },
      {
        perfumeId: insertedPerfumes[0]._id,
        author: "Priya Patel",
        rating: 4,
        comment: "Very unique and authentic. It starts strong with a heavy wet clay smell, then dries down to a lovely soft sandalwood base. Longevity is outstanding."
      },
      {
        perfumeId: insertedPerfumes[1]._id, // Ruh Khus
        author: "Rohan Verma",
        rating: 5,
        comment: "The best vetiver attar I have ever owned. Deep, cooling, and natural. Excellent for hot summers!"
      },
      {
        perfumeId: insertedPerfumes[2]._id, // Ruh Gulab
        author: "Meera Nair",
        rating: 5,
        comment: "Smells like a walk in a blooming rose garden at dawn. So fresh and realistic, completely different from synthetic rose perfumes."
      },
      {
        perfumeId: insertedPerfumes[3]._id, // Shamama
        author: "Vikram Malhotra",
        rating: 4,
        comment: "Warm, spicy, and mysterious. Perfect for winter evenings. I always get compliments when I wear this."
      }
    ];

    await Review.insertMany(reviewsData);
    console.log('Seeded reviews successfully.');

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
