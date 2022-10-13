import HttpException from "./HttpException";

class AccessTokenException extends HttpException {
    constructor() {
        super(400, `Token provided is not access token`);
    }
}

export default AccessTokenException;
