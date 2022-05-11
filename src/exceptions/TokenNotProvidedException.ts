import HttpException from "./HttpException";

class TokenNotProvidedException extends HttpException {
    constructor(){
        super(401,`Token is not provided`)
    }
}

export default TokenNotProvidedException;