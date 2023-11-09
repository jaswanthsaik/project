import jwt from 'jsonwebtoken';
import fs, { readFile } from 'fs';
import { promisify } from 'util';

export class QlikToken {

    qliktoken() {
        // Read the private key from file        
        const privateKey = fs.readFileSync('data/privatekey.pem');

        // Define your payload
        const payload = {
            userId: 123,
            username: 'exampleuser',
        };

        // Define the sign-in options
        const signOptions: jwt.SignOptions = {
            expiresIn: '1h', // Token expiration time
        };
        // Generate the JWT
        const token = jwt.sign(payload, privateKey, signOptions);
        console.log(token); // The generated JWT
    }

    // async readMyFile() {
    //     try {
    //     const data = readFile('path/to/my/file.txt', 'utf8');
    //     console.log(data);
    //     } catch (error) {
    //     console.error(error);
    //     }
    //     }
}