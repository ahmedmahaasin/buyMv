
import { v2 as cloudinary} from "cloudinary"
import productModel from "../models/productModel.js";


//function fro add product

const addProduct = async (req, res) => {
  try {
    const { 
      name, description, long_description, price, brand, 
      category, subCategory, sizes, qty, miniQty, 
      bestseller, featured, video, videoFr 
    } = req.body;

    // Validate required fields
    if (!name || name.trim() === "") {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    if (!price || isNaN(Number(price))) {
      return res.status(400).json({ success: false, message: "Price must be a valid number" });
    }

    // Ensure sizes is an array
    let sizesArray;
    try {
      sizesArray = JSON.parse(sizes); // if frontend sends JSON
    } catch {
      sizesArray = sizes ? sizes.split(',').map(s => s.trim()) : [];
    }

    // Handle uploaded images
    const imagesRaw = [
      req.files?.image1?.[0] || null,
      req.files?.image2?.[0] || null,
      req.files?.image3?.[0] || null,
      req.files?.image4?.[0] || null,
      req.files?.image5?.[0] || null,
      req.files?.image6?.[0] || null,
      req.files?.image7?.[0] || null,
    ];
    const images = imagesRaw.filter(item => item != null);

    // Upload images to Cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    // Prepare product data
    const productData = { 
      name: name.trim(),
      description: description || "",
      long_description: long_description || "",
      price: Number(price),
      brand: brand || {},
      image: imagesUrl,
      category: category || {},
      subCategory: subCategory || {},
      sizes: sizesArray,
      qty: qty ? Number(qty) : 0,
      miniQty: miniQty ? Number(miniQty) : 0,
      date: Date.now(),
      bestseller: bestseller === "true",
      featured: featured === "true",
      video: video || "",     // optional, no validation
      videoFr: videoFr || ""  // optional, no validation
    };

    const product = new productModel(productData);
    await product.save();

    return res.json({ success: true, message: "Product added successfully", images: imagesUrl });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

//function for list products

const listProducts = async (req, res) =>{
  try {
    const products = await productModel.find({});
    res.json({success: true, products}) 
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message});
  }  
}


//function fro remove Product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body; // get ID from POST body
    if (!id) return res.status(400).json({ success: false, message: "Product ID is required" });

    const deleted = await productModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//function fro single Product info

const singleProduct = async (req, res) => {
  try {
    const productID = req.body.productID || req.params.id || req.query.id;

    if (!productID) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const product = await productModel.findById(productID);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Product ID is required" });

    const product = await productModel.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const {
      name, description, long_description, price, brand,
      category, subCategory, sizes, qty, miniQty,
      bestseller, featured, video, videoFr, existingImages
    } = req.body;

    // Update basic fields if provided
    if (name) product.name = name.trim();
    if (description !== undefined) product.description = description;
    if (long_description !== undefined) product.long_description = long_description;
    if (price !== undefined && !isNaN(Number(price))) product.price = Number(price);
    if (brand) product.brand = brand;
    if (category) product.category = category;
    if (subCategory) product.subCategory = subCategory;
    if (sizes) {
      try {
        product.sizes = JSON.parse(sizes);
      } catch {
        product.sizes = sizes.split(',').map(s => s.trim());
      }
    }
    if (qty !== undefined) product.qty = Number(qty);
    if (miniQty !== undefined) product.miniQty = Number(miniQty);
    if (bestseller !== undefined) product.bestseller = bestseller === "true";
    if (featured !== undefined) product.featured = featured === "true";
    if (video !== undefined) product.video = video;
    if (videoFr !== undefined) product.videoFr = videoFr;

    // Handle uploaded images
    const newImagesRaw = [
      req.files?.image1?.[0] || null,
      req.files?.image2?.[0] || null,
      req.files?.image3?.[0] || null,
      req.files?.image4?.[0] || null,
      req.files?.image5?.[0] || null,
      req.files?.image6?.[0] || null,
      req.files?.image7?.[0] || null,
    ];
    const newImages = newImagesRaw.filter(item => item != null);

    // Upload new images to Cloudinary
    const newImagesUrl = await Promise.all(
      newImages.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: "image" });
        return result.secure_url;
      })
    );

    // Combine existing images and new images
    let existingImagesArray = [];
    if (existingImages) {
      try {
        existingImagesArray = JSON.parse(existingImages);
      } catch {
        existingImagesArray = Array.isArray(existingImages) ? existingImages : [existingImages];
      }
    }

    product.image = [...existingImagesArray, ...newImagesUrl];

    await product.save();
    res.json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove a single image from product
const removeProductImage = async (req, res) => {
  try {
    const { productId, imageUrl } = req.body;
    if (!productId || !imageUrl) {
      return res.status(400).json({ success: false, message: "Product ID and image URL are required" });
    }

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Remove the image URL from the product images array
    product.image = product.image.filter(url => url !== imageUrl);

    await product.save();
    res.json({ success: true, message: "Image removed successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const getTotalProducts = async (req, res) => {
  try {
    const total = await productModel.countDocuments();
    return res.json({ success: true, total });
  } catch (error) {
    console.error("Error getting total products:", error);
    return res.status(500).json({ success: false, message: "Failed to get total products", error: error.message });
  }
};

export { addProduct,getTotalProducts, listProducts, removeProduct, singleProduct, removeProductImage, updateProduct };

