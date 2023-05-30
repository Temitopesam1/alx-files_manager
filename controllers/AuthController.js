import sha1 from "sha1";
import mongoClient from '../utils/db';
import redisClient from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';


class AuthController{
    async getConnect(req, res){
        const encodedBase64 = JSON.stringify(req.headers.authorization);
        console.log('encode: ', encodedBase64);
        const base64 = encodedBase64.split(" ")[1];
        const decodedBase64 = Buffer.from(base64, 'base64').toString('utf-8');
        const email = decodedBase64.split(':')[0]
        const password = decodedBase64.split(':')[1];
        const userCollection = mongoClient.userCollection;
        const user = await userCollection.findOne({'email': email, 'password': sha1(password)});
        if (user){
            const token = uuidv4();
            const key = `auth_${token}`;
            await redisClient.set(key, user._id, 86400);
            return res.status(200).json({ 'token': token });
        }
        return res.status(401).json({'error': 'Unauthorized'});
    }

    async getDisconnect(req, res){
        const { token } = req.header;
        const key = `auth_${token}`
        const user = await redisClient.get(key);
        if(user){
            redisClient.del(key);
            return;
        }
        return res.status(401).json({'error': 'Unauthorized'})
    }
}
const authController = new AuthController();
module.exports = authController;