import aedes, {
    AuthenticateError,
    AuthenticateHandler,
    AuthErrorCode,
    Client,
    PublishPacket,
    Subscription,
} from "aedes";
import { verifyJWT } from "../utils/jwt.util";
import { prisma } from "../service/prisma.service";
import { NextFunction } from "express";

export const authenticate = async (
    client: Client,
    username: Readonly<string>,
    password: Readonly<Buffer>,
    done: (error: AuthenticateError | null, success: boolean | null) => void
) => {
    try {
        const decode = verifyJWT(password.toString());
        (client as any).user = decode;
        (client as any).user.username = username
        const user = await prisma.user.findUnique({
            where: {
                email: (decode as any).email,
            },
        });
        if (user) {
            return done(null, true);
        } else {
            var error = new Error("User not registered") as AuthenticateError;
            error.returnCode = 4;
            done(error, null);
        }
    } catch (err) {
        var error = new Error("Auth error") as AuthenticateError;
        error.returnCode = 4;
        done(error, null);
    }
};

export const authorizeSubscribe = (
    client: Client,
    subscription: Subscription,
    callback: (error: Error | null, subscription?: Subscription | null) => void
) => {
    const user = (client as any).user;
    if (subscription.topic.startsWith(`users/${user.id}/`)) {
        return callback(null, subscription);
    }
    return callback(
        new Error(
            `Do not have permission to subscribe topic : ${subscription.topic}`
        )
    );
};

export const authorizePublish = (
    client: Client,
    packet: PublishPacket,
    callback: (error?: Error | null) => void
) => {
    const user = (client as any).user;
    if (packet.topic.startsWith(`users/${user.id}/`)) {
        return callback(null);
    }
    return callback(
        new Error(
            `Do not have permission to publish to topic : ${packet.topic}`
        )
    );
};
