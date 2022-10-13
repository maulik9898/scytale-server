import { User } from "@prisma/client";
import { sign, verify } from "jsonwebtoken";
import { JWTObject, TokenType } from "../types/types";

export const createJWT = (user: User, type: TokenType = TokenType.ACCESS) => {
    const jwtSecret = process.env.JWT_SECRET;
    const expiresIn = type === TokenType.ACCESS ? "1d" : "30d";
    if (jwtSecret) {
        var token = sign(
            {
                email: user.email,
                id: user.id,
                role: user.role,
                sub: user.email,
                type: type,
            },
            jwtSecret,
            { expiresIn: expiresIn }
        );
    } else {
        throw Error("JWT SECRET NOT SET");
    }
    return token;
};

export const verifyJWT = (token: string): JWTObject => {
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret) {
        var decode = verify(token, jwtSecret) as JWTObject;
    } else {
        throw Error("JWT SECRET NOT SET");
    }
    return decode;
};
