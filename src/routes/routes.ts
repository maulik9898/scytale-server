import { Router } from 'express';
import { authenticate, getClients, login, registerUser, setPubKey } from '../controllers/auth.controller'
import { refreshToken } from '../controllers/refreshToken.controller';
import { authenticateJWT, isAdmin } from '../middleware/auth.middleware';
import { loginValidation, setPubKeyValidation, tokenValidation, validate } from '../middleware/validators.middleware';
export const router: Router = Router()

router.post('/login', validate(loginValidation) ,login);

router.post('/register', authenticateJWT,isAdmin,validate(loginValidation),registerUser)

router.post('/refresh',validate([tokenValidation]),refreshToken)

router.post('/pubkey',validate(setPubKeyValidation),authenticateJWT , setPubKey)

router.get('/clients',authenticateJWT,getClients)

router.get('/authenticate',authenticateJWT , authenticate)

