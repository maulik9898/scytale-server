import HttpException from "./HttpException";

class RefreshTokenException extends HttpException {
    constructor(){
        super(400,`Token provided is not refresh token`)
    }
}

export default RefreshTokenException;