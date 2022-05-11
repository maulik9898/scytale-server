import { verify } from "crypto"
import { createJWT, verifyJWT } from "../utils/jwt.util"
import { NextFunction, Request, Response } from "express";
import { prisma } from "../service/prisma.service";
import HttpException from "../exceptions/HttpException";
import InvalidTokenException from "../exceptions/InvalidTokenException";
import RefreshTokenException from "../exceptions/RefreshTokenException";

export const refreshToken = async (req: Request, res: Response,next: NextFunction) => { 
    try {
        const  token  = (req.body as any).token
        const decode: any = verifyJWT(token);
        if(decode.type != 'refresh'){
            return next(new RefreshTokenException())
        } 
        const user = await prisma.user.findUnique({
            where: {
                email:decode.email
            }
        })
        if(!user){
            return next(new InvalidTokenException())
        }
        const accessToken =  createJWT(user)
            const refreshToken =  createJWT(user,'refresh')
            return res.status(200).json({
                accessToken,
                refreshToken,
                id: user.id
            });

    } catch (error: any) {
        return next(new HttpException(500,error.message)) 
    }
    
}