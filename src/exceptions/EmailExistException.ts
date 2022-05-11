import HttpException from "./HttpException";

class EmailExistException extends HttpException {
    constructor(){
        super(409,"User with thiis email already exists")
    }
}

export default EmailExistException;