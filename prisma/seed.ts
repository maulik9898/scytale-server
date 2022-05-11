import { PrismaClient, Role } from '@prisma/client'
import { hash } from 'bcrypt';
import dotenv from 'dotenv';

const prisma = new PrismaClient()

dotenv.config()


export async function main(){
    const email = process.env.ADMIN_EMAIL;
    const password  = process.env.ADMIN_PASSWORD;
    if(email == undefined || password == undefined){
        throw Error('ERROR: ADMIN_EMAIL and ADMIN_PASSWORD environment is not set please set it and run again')
    }
    const encryptedPassword = await hash(password, 10);
    const user = await prisma.user.upsert({
        where: {  email: email },
        update: {password:encryptedPassword},
        create:{
            email: email,
            password: encryptedPassword,
            role: Role.ADMIN
        }
    })
    console.log(user)

}
