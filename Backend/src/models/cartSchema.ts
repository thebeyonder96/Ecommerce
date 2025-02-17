import { CartInterface } from './../interfaces/cart';
import mongoose, { Model, Schema } from "mongoose";
const cartSchema: Schema<CartInterface> = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    carts: [
        {
            title: { type: String, required: true },
            description: { type: String, required: true },
            image: { type: String, required: true },
            categories: { type: Array, required: true },
            size: { type: Number, required: true },
            color: { type: String, required: true },
            prize: { type: Number, required: true },
            brand: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ]
}, { timestamps: true })

export const cartModel: Model<CartInterface> = mongoose.model<CartInterface>('cart', cartSchema)