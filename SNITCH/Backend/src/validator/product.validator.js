import { body, validationResult } from 'express-validator'

function validateRequest(req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

export const validateCreateProduct = [
    body("title").trim().notEmpty().withMessage("Title is required")
        .isLength({ min: 3, max: 100 }).withMessage("Title must be between 3 and 100 characters long"),
    body("description").trim().notEmpty().withMessage("Description is required")
        .isLength({ max: 2000 }).withMessage("Description must be at most 2000 characters long"),
    body("priceAmount").notEmpty().withMessage("Price amount is required")
        .isFloat({ gt: 0 }).withMessage("Price amount must be a number greater than 0"),
    body("priceCurrency").optional()
        .isIn(["USD", "EUR", "GBP", "JPY", "INR"]).withMessage("Currency must be one of USD, EUR, GBP, JPY, INR"),

    validateRequest
]
