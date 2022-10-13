import { Router } from 'express';
import { authenticate, getClients, login, registerUser, setPubKey } from '../controllers/auth.controller'
import { refreshToken } from '../controllers/refreshToken.controller';
import { authenticateJWT, authenticateJWTAcess, authenticateJWTRefresh, isAdmin } from '../middleware/auth.middleware';
import { loginValidation, setPubKeyValidation, tokenValidation, validate } from '../middleware/validators.middleware';
export const router: Router = Router()

router.post('/login', validate(loginValidation) ,login);

router.post('/register', authenticateJWTAcess,isAdmin,validate(loginValidation),registerUser)

router.get('/refresh',authenticateJWTRefresh ,refreshToken)

router.post('/pubkey',authenticateJWTAcess, validate(setPubKeyValidation) , setPubKey)

router.get('/clients',authenticateJWTAcess,getClients)

router.get('/authenticate',authenticateJWT , authenticate)

