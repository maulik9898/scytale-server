import { verify } from "crypto";
import { createJWT, verifyJWT } from "../utils/jwt.util";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../service/prisma.service";
import HttpException from "../exceptions/HttpException";
import InvalidTokenException from "../exceptions/InvalidTokenException";
import RefreshTokenException from "../exceptions/RefreshTokenException";
import { JWTObject, TokenType } from "../types/types";

export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const decode = (res as any).user as JWTObject;
        const user = await prisma.user.findUnique({
            where: {
                email: decode.email,
            },
        });
        if (!user) {
            return next(new InvalidTokenException());
        }
        const accessToken = createJWT(user);
        const refreshToken = createJWT(user,TokenType.REFRESH);
        return res.status(200).json({
            status: "success",
            data: {
                accessToken,
                refreshToken,
                id: user.id,
            },
        });
    } catch (error: any) {
        return next(new HttpException(500, error.message));
    }
};
