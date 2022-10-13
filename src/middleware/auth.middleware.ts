import { Role } from "@prisma/client";
import { NextFunction } from "express";
import { Request, Response } from "express";
import AccessTokenException from "../exceptions/AccessTokenException";
import AdminException from "../exceptions/AdminException";
import InvalidTokenException from "../exceptions/InvalidTokenException";
import RefreshTokenException from "../exceptions/RefreshTokenException";
import TokenNotProvidedException from "../exceptions/TokenNotProvidedException";
import { JWTObject, TokenType } from "../types/types";
import { verifyJWT } from "../utils/jwt.util";

export const authenticateJWTAcess = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = (req.headers as any).authorization;
        if (!authHeader) {
            return next(new TokenNotProvidedException());
        }
        const token = authHeader.split(" ")[1];
        const user = verifyJWT(token);
        if (user.type !== TokenType.ACCESS) {
            return next(new AccessTokenException());
        }
        (res as any).user = user;
        next();
    } catch (error) {
        return next(new InvalidTokenException());
    }
};

export const authenticateJWTRefresh = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = (req.headers as any).authorization;
        if (!authHeader) {
            return next(new TokenNotProvidedException());
        }
        const token = authHeader.split(" ")[1];
        const user = verifyJWT(token);
        if (user.type !== TokenType.REFRESH) {
            return next(new RefreshTokenException());
        }
        (res as any).user = user;
        next();
    } catch (error) {
        return next(new InvalidTokenException());
    }
};

export const authenticateJWT = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = (req.headers as any).authorization;
        if (!authHeader) {
            return next(new TokenNotProvidedException());
        }
        const token = authHeader.split(" ")[1];
        const user = verifyJWT(token);
        (res as any).user = user;
        next();
    } catch (error) {
        return next(new InvalidTokenException());
    }
};

export const isAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = (res as any).user as JWTObject;
    if (user.role == Role.ADMIN) {
        next();
    } else {
        return next(new AdminException());
    }
};
