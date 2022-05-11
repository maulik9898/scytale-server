import { NextFunction } from "express";
import { validationResult, check, body } from "express-validator";
import { Request , Response } from "express";

export const validate = (validations: any) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        for (const validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        res.status(400).json({ errors: errors.array()[0] });
    };
};

const emailValidation = check("email").exists({checkNull: true})
    .isEmail()
    .normalizeEmail();

const passwordValidation = check("password").exists({checkNull: true})

const clientIdValidation = check("clientId").exists({checkNull: true})

const pubKeyValidation = check("pubKey").exists({checkNull: true})

export const tokenValidation = check("token").exists({checkNull: true})

export const loginValidation = [ emailValidation, passwordValidation]

export const setPubKeyValidation = [clientIdValidation, pubKeyValidation]


