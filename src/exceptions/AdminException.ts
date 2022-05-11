import HttpException from "./HttpException";

class AdminException extends HttpException {
    constructor(){
        super(403,`You do not have access to this route`)
    }
}

export default AdminException;