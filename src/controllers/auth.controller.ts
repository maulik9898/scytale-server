import { NextFunction, Request, Response } from "express";
import { prisma } from "../service/prisma.service";
import { compare, hash } from "bcrypt";
import { createJWT, verifyJWT } from "../utils/jwt.util";
import { Prisma, Role } from "@prisma/client";
import { sentClientDetails } from "../middleware/events.middleware";
import InvalidEmailPasswordException from "../exceptions/InvalidEmailPasswordException";
import HttpException from "../exceptions/HttpException";
import EmailExistException from "../exceptions/EmailExistException";
import InvalidClientIdException from "../exceptions/InvalidClientIdException";
import InvalidUserException from "../exceptions/InvalidUserException";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (user && (await compare(password, user.password))) {
            const accessToken = createJWT(user);
            const refreshToken = createJWT(user, "refresh");
            return res.status(200).json({
                accessToken,
                refreshToken,
                id: user.id,
            });
        } else {
            return next(new InvalidEmailPasswordException())
        }
    } catch (err: any) {
        next(new HttpException(500,err.message))
    }
};

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const encryptedPassword = await hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email: email,
                password: encryptedPassword,
                role: Role.USER,
            },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });
        return res.status(201).json({
            status: "success",
            data: user,
        });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return next(new EmailExistException())
            }
        } 

        return next(new HttpException(500,error.message))
    }
};

export const setPubKey = async (req: Request, res: Response,next: NextFunction) => {
    const email = (res as any).user.email;
    const { clientId, pubKey } = req.body;
    try {
        const user = await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                clients: {
                    update: {
                        where: {
                            id: clientId,
                        },
                        data: {
                            pubKey: pubKey,
                        },
                    },
                },
            },
            include: {
                clients: true,
            }
        });

        sentClientDetails(user)
        return res.status(200).json({
            status: "success",
        });
    } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.log(error.code);
            if (error.code === "P2016") {
                return next(new InvalidClientIdException(clientId,email))
            }
        }
        return next(new HttpException(500,error.message)) 
    }
};

export const getClients = async (req: Request, res: Response, next: NextFunction) => {
    const email = (res as any).user.email;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            include: {
                clients: true
            }
        })
        if(!user){
            return next(new InvalidUserException(email))
        }
        return  res.status(200).json({
            status: "success",
            data: user.clients,
        });
        
    } catch (error: any) {
        return next(new HttpException(500,error.message)) 
    }
}


export const authenticate = async (req: Request, res: Response,next: NextFunction) => {
    res.status(200).json({
        status: 'success'
    })
}