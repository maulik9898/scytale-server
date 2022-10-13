export interface JWTObject {
    email: string;
    id: number;
    role: string;
    sub: string;
    type: TokenType;
    iat: number;
    exp: number;
}

export enum TokenType {
    REFRESH = "refresh",
    ACCESS = "access",
}
