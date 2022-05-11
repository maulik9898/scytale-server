import HttpException from "./HttpException";

class InvalidUserException extends HttpException {
    constructor(email: string){
        super(400,`No user is available with email ${email}`)
    }
}

export default InvalidUserException;