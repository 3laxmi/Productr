const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/published', auth, async (req, res) => {
  try {
    const products = await Product.find({ 
      userId: req.user._id, 
      isPublished: true 
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get published products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/unpublished', auth, async (req, res) => {
  try {
    const products = await Product.find({ 
      userId: req.user._id, 
      isPublished: false 
    }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get unpublished products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { name, type, quantity, mrp, sellingPrice, brand, exchangeEligible } = req.body;

    if (!name || !type || !quantity || !mrp || !sellingPrice || !brand || !exchangeEligible) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (parseFloat(sellingPrice) > parseFloat(mrp)) {
      return res.status(400).json({ message: 'Selling price cannot be greater than MRP' });
    }

    if (parseInt(quantity) < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    const images = req.files ? req.files.map(file => file.filename) : [];

    const product = new Product({
      name,
      type,
      quantity: parseInt(quantity),
      mrp: parseFloat(mrp),
      sellingPrice: parseFloat(sellingPrice),
      brand,
      images,
      exchangeEligible,
      userId: req.user._id
    });

    await product.save();
    res.status(201).json(product);

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { name, type, quantity, mrp, sellingPrice, brand, exchangeEligible, existingImages } = req.body;
    
    const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (parseFloat(sellingPrice) > parseFloat(mrp)) {
      return res.status(400).json({ message: 'Selling price cannot be greater than MRP' });
    }

    if (parseInt(quantity) < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' });
    }

    
    let images = [];
    if (existingImages) {
      images = Array.isArray(existingImages) ? existingImages : [existingImages];
    }
    
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.filename);
      images = [...images, ...newImages];
    }

    product.name = name;
    product.type = type;
    product.quantity = parseInt(quantity);
    product.mrp = parseFloat(mrp);
    product.sellingPrice = parseFloat(sellingPrice);
    product.brand = brand;
    product.exchangeEligible = exchangeEligible;
    product.images = images;

    await product.save();
    res.json(product);

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
router.patch('/:id/toggle-publish', auth, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isPublished = !product.isPublished;
    await product.save();

    res.json(product);

  } catch (error) {
    console.error('Toggle publish error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.images.forEach(image => {
      const imagePath = path.join(__dirname, '../uploads', image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;