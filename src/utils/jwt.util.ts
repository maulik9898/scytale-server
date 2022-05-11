import { User } from "@prisma/client";
import { sign, verify } from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET

export const createJWT =  (user:User , type: string = 'access') => {
    
    const expiresIn = type == 'access' ? '2d' : '30d';
    if(jwtSecret){
        var token =  sign({
            email: user.email,
            id: user.id,
            role: user.role,
            sub: user.email,
            type: type
           }, jwtSecret, { expiresIn: expiresIn }); 
    }
    else {
        throw Error('JWT TOKEN NOT SET')
    }
    return token
    
}

export const verifyJWT =  (token:string) => {
    if(jwtSecret){
        var decode = verify(token, jwtSecret); 
    } else {
        throw Error('JWT TOKEN NOT SET')
    }
    return decode
    
}