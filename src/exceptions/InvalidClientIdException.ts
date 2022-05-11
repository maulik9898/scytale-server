import HttpException from "./HttpException";

class InvalidClientIdException extends HttpException {
    constructor(clientId: string , email: string){
        super(400,`Client with id ${clientId} is not available for ${email} user`)
    }
}

export default InvalidClientIdException;