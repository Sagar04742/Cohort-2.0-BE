import { body, validationResult } from "express-validator";

const validation = (req, res, next) => {
        const errors = validationResult(req);

        if(errors.isEmpty()){
            return next()
        }

        res.status(400).json({
            errors: errors.array()
        })
    }


export const registerValidation = [
  body("username").isString().withMessage("Username must be string"),
  body("email").isEmail().withMessage("Email must be valid email address"),
  body("password").isLength({min:6,max:12}).withMessage("Password must be between 6 to 12 characters"),
  validation
];
