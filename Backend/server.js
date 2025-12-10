import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import brandRouter from './routes/brandRoutes.js';
import categoryRouter from './routes/categoryRoutes.js';
import subcategoryRouter from './routes/subCategoryRoutes.js';
import deliveryMethodRouter from './routes/deliveryMethodRoutes.js';
import heroRouter from './routes/heroRoutes.js';
import router from './routes/websiteDataRoutes.js';
import cartRouter from './routes/cartRoute.js';
import oderRouter from './routes/orderRoute.js';



// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(cors());

// API Endpoints
app.get('/', (req, res) => {
  res.send('API Working');
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/brand', brandRouter);
app.use('/api/category', categoryRouter);        // Main categories
app.use('/api/subcategory', subcategoryRouter); // Subcategories
app.use('/api/delivery', deliveryMethodRouter);
app.use('/api/hero', heroRouter);
app.use('/api/web', router);

app.use('/api/cart', cartRouter);

app.use('/api/oder', oderRouter);


// Start server
app.listen(port, () => console.log(`Server started on PORT: ${port}`));
