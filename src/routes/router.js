import express from 'express';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';

const router = express.Router();


router.post('/generate/token', AuthController.generateToken);
router.post('/encrypt/token', AuthController.encryptToken);
router.post('/decrypt/token', AuthController.decryptToken);
router.post('/decode/token', AuthController.decodeToken);

router.post('/login', UserController.login);
router.post('/initiate/payment', UserController.initiatePayment);



// router.post('/verify/token', UserController.verifyToken);


export default router