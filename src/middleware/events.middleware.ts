import  { Client } from "aedes";
import prisma from "../lib/prisma.lib";
import { broker } from '../../index'


export const onConnect = async (client: Client) => {
    const user: any = (client as any).user;
    const newUser = await prisma.user.update({
        where: {
            email: user.email,
        },
        data: {
            clients: {
                upsert: {
                    create: {
                        id: client.id,
                        username: user.username,
                    },
                    update: {
                        id: client.id,
                        username: user.username,
                    },
                    where: {
                        id: client.id,
                    },
                },
            },
        },
        include: {
            clients: true,
        },
    });
    sentClientDetails(newUser)
    console.log(`[CLIENT_CONNECTED] Client ${client ? client.id : client} `);
};

export const clientDisconnect = async (client: Client) => {
    const user: any = (client as any).user;
    const newUser = await prisma.user.update({
        where: {
            email: user.email,
        },
        data: {
            clients: {
                delete: {
                    id: client.id,
                },
            },
        },
        include: {
            clients: true,
        },
    });
    sentClientDetails(newUser)
    console.log(`[CLIENT_DISCONNECT] Client ${client ? client.id : client} `);
};


export const sentClientDetails =  (user: any) => {
    broker.publish({
        topic: `users/${user.id}/clients`,
        cmd: "publish",
        qos: 0,
        dup: false,
        retain: false,
        payload: JSON.stringify(user.clients),
    },(err) => {
        if(err){
            console.log(`[ERROR] : ${err}`)
        }
      });
}