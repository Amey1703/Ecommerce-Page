import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, maxlength: 100 },
    description: { type: String, required: true },
    image: { type: String, required: false }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);


