import { body, validationResult } from "express-validator";

function validateRegister(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}



export const validateRegisterUser = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("contact").isMobilePhone().withMessage("Invalid contact format"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("fullname").notEmpty().withMessage("Full name is required").isLength({min: 3, max: 50 }).withMessage("Full name must be between 3 and 50 characters long"),

    validateRegister
]