import StatusCodes from 'http-status-codes';
import { findUser } from '../utils/Utils.js';
import {
    generateJWT,
    encryptData,
    decryptData,
    decodeJWT,
} from '../utils/crypto_utils.js';
import { processPayment } from './PaymentController.js';


export default {


    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @description handles a user login request
     * @returns {Promise<void>}
     */
    async login(req, res) {

        const { email, password } = req.body;

        const user = findUser(email, password);

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'User Not Found',
                data: null,
                code: StatusCodes.UNAUTHORIZED
            })
        }

        // Generate JWT token based on user data
        const token = generateJWT(user);

        if (!token) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Error generating token',
                data: null,
                code: StatusCodes.INTERNAL_SERVER_ERROR
            })
        }

        // Encrypt the token using AES algorithm
        const jweToken = await encryptData(token);


        res.status(StatusCodes.OK).json({
            message: 'login successful',
            code: StatusCodes.OK,
            data: jweToken
        })

    },


    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * @description handles a payment initiation request
     */
    async initiatePayment(req, res) {

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'Authorization header not found',
                data: null,
                code: StatusCodes.UNAUTHORIZED
            })
        }

        const jweToken = authHeader.split(' ')[1];

        const token = await decryptData(jweToken);

        const data = decodeJWT(token);

        const paymantStatus = processPayment(data);

        if (!paymantStatus) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Error processing payment',
                data: null,
                code: StatusCodes.INTERNAL_SERVER_ERROR
            })
        }

        res.status(StatusCodes.OK).json({
            message: 'Payment successful',
            code: StatusCodes.OK,
            data: paymantStatus
        })
    }

}