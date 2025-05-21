import StatusCodes from 'http-status-codes';
import { findUser } from '../utils/Utils.js';
import { generateJWT, encryptData, decryptData, decodeJWT } from '../utils/crypto_utils.js';


export default{ 

    
    /**
     * 
     * @param { Request } req 
     * @param { Response } res 
     * @description generates a JWT token based on the user data and returns a token string
     */
     async generateToken(req, res){

        const { email, password } = req.body;
       
        const user  = findUser(email, password);   
        

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'User Not Found',
                data: null,
                code: StatusCodes.UNAUTHORIZED
            })
        }

        const token = generateJWT(user);

        if (!token) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'Error generating token',
                data: null,
                code: StatusCodes.INTERNAL_SERVER_ERROR
            })
        }
        
        res.status(StatusCodes.OK).json({
            message: 'token generated successfully',
            code: StatusCodes.OK,
            data: token
        })
             
    },


    /**
     * 
     * @param { Request } req 
     * @param { Response } res 
     * @description encrypts the token using AES algorithm and returns a JWE token string
     */
    async encryptToken(req, res) {

       const authHeader = req.headers['authorization'];

       const token =  authHeader.split(' ')[1];

       const encryptedToken = await encryptData(token);

        res.status(StatusCodes.OK).json({
            message: 'token encrypted successfully',
            code: StatusCodes.OK,
            data: encryptedToken
        })
    },



    /**
     * 
     * @param { Request } req 
     * @param { Response } res 
     * @description decrypts the JWE token using AES algorithm and returns the original token string
     */
    async decryptToken(req, res) {

        const authHeader = req.headers['authorization'];

        const clientJWEToken =  authHeader.split(' ')[1];        

        const jwt = await decryptData(clientJWEToken);
       
        return res.status(StatusCodes.OK).json({
            message: 'Token decrypted fully',
            data: jwt,
            code: StatusCodes.OK
        })
    },


    /**
     * 
     * @param { Request } req 
     * @param { Response } res 
     * @description decodes the JWT token and returns the data
     */
    decodeToken(req, res) {

       const authHeader = req.headers['authorization'];
       const token =  authHeader.split(' ')[1];

       const data = decodeJWT(token);

       return res.status(StatusCodes.OK).json({
            message: 'Token decoded successfully',
            data: data,
            code: StatusCodes.OK
        })
    },


}