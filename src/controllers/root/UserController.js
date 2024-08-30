
/**

 * Health check endpoint
 * @param {import('express').Request} _req 
 * @param {import('express').Response} res 
 */

const jwt = require('jsonwebtoken');
const jose = require('node-jose');

// Secret key for signing (HMAC using SHA-512)
const SECRET_KEY = 'a.small.country.in.afrcia';

const userInformation = {
    firstname: "Lennox",
    lastname: "kaidzro",
    age: "26",
    email: "lkaidzro@knust.edu.gh",
    medical_diagnosis: {
        Hepatitis: false,
        HIV_Aids: false,
        Syphilis: false,
        Yellow_Fever: false
    }
}


export default { 

    
    //post request to store the resource in the database
    viewUserRecord(req, res) {
        

        const token = jwt.sign(userInformation, SECRET_KEY, {
            algorithm: 'HS512',
            expiresIn: '1h',
        });
        
        res.send(token)
        
        
    },


   async viewEncryptedUserRecord(req, res) {        

              
        const keyStore = jose.JWK.createKeyStore();
        const encryptionKey = await keyStore.generate('oct', 256, { alg: 'A256GCM', use: 'enc' });

        const jwe = await jose.JWE.createEncrypt({ format: 'compact' }, encryptionKey)
        .update(JSON.stringify(userInformation))
        .final();

        res.send(jwe)
        
        
    },
  
   



}