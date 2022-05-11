import HttpException from "./HttpException";

class InvalidEmailPasswordException extends HttpException {
    constructor(){
        super(401,"Invalid Email or Password")
    }
}

export default InvalidEmailPasswordException;