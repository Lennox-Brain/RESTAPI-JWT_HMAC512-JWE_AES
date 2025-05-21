
import jwt from 'jsonwebtoken';
import jose from 'node-jose';



/**
 * 
 * @param {json} data 
 * @returns string
 * @description generates a JWT token using the secret key and returns it 
 */
export function generateJWT(data) {
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = jwt.sign(data, secret, {
        algorithm: 'HS512',
        expiresIn: '1h',
    });

    return token;
}

/**
 * 
 * @param {string} token 
 * @returns boolean
 * @description verifies the JWT token using the secret key and returns true if valid, false otherwise
 */
export function decodeJWT(token) {
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);


    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (err) {
        throw new Error('Decoding Faild. Invalid JWT token');
    }
}




/**
 * 
 * @param {json} data 
 * @returns string
 * @description encrypts the data using AES algorithm and returns a JWE token string
 */
export async function encryptData(data) {

    try {
        
        const key = {
                kty: "oct",
                alg: "A256GCM",
                use: "enc",
                k: process.env.JWE_Key
            }
                
        let keyStore = jose.JWK.createKeyStore(); 

        const encryptionKey = await keyStore.add(key);
        
        const jwe = await jose.JWE.createEncrypt({ format: 'compact' }, encryptionKey)
            .update(JSON.stringify(data))
            .final();

        return jwe;
        
    } catch (error) {
        console.error('Encryption failed:', error);
        return 'null';
    }
}


/**
 * 
 * @param {string} encryptedData 
 * @param {string} iv 
 * @returns 
 */
export async function decryptData(data) {

  try {

    const key = {
      kty: "oct",
      alg: "A256GCM",
      use: "enc",
      k: process.env.JWE_Key
    }

    const keyStore = jose.JWK.createKeyStore();
    const decryptionKey = await keyStore.add(key);

    const decrypted = await jose.JWE.createDecrypt(decryptionKey).decrypt(data);

    return JSON.parse(decrypted.plaintext.toString());

  } catch (err) {

    console.error('Data Decryption failed:', err.message);
    
  }






  

// export function decodeJWT(token) {

//     try {
//         const decoded = jwt.decode(token, { complete: true });

//         return decoded;

//     } catch (err) {

//         throw new Error('Invalid token');
//     }
// }
}
