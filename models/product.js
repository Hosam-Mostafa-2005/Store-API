// models/product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name must be provided"],
  },
  price: {
    type: Number,
    required: [true, "Product price must be provided"],
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  createdAt: {
    type: Date,
    // ملاحظة: من غير () عشان تكون function ترجع الوقت عند إنشاء كل وثيقة
    default: Date.now,
  },
  company: {
    type: String,
    enum: {
      values: ["ikea", "liddy", "caressa", "marcos"],
      message: "{VALUE} is not supported",
    },
  },
});

// منع تعريف الموديل مرتين (ضروري مع nodemon / hot reload)
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
