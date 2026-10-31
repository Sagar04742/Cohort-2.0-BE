import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency } = req.body;
        const seller = req.user

        const files = req.files || []
        if (files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" })
        }

        const images = await Promise.all(files.map(async (file) => {
            const result = await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            })
            return { url: result.url }
        }))

        const product = await productModel.create({
            title,
            description,
            images,
            price: {
                amount: priceAmount,
                currency: priceCurrency || "INR"
            },
            seller: seller._id
        })

        return res.status(201).json({
            message: "Product created successfully",
            success: true,
            product
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Failed to create product", success: false })
    }
}
