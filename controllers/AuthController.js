/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import mongoClient from '../utils/db';
import redisClient from '../utils/redis';

const mongodb = require('mongodb');

class AuthController {
  async getConnect(req, res) {
    const encodedBase64 = JSON.stringify(req.headers.authorization);
    const base64 = encodedBase64.split(' ')[1];
    const decodedBase64 = Buffer.from(base64, 'base64').toString('utf-8');
    const email = decodedBase64.split(':')[0];
    const password = decodedBase64.split(':')[1];
    const { userCollection } = mongoClient;
    const user = await userCollection.findOne({ email, password: sha1(password) });
    if (user) {
      const token = uuidv4();
      const key = `auth_${token}`;
      await redisClient.set(key, user._id.toString(), 86400);
      return res.status(200).json({ token });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }

  async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    const key = `auth_${token}`;
    const user = await redisClient.get(key);
    if (user) {
      redisClient.del(key);
      return res.status(204).end();
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }

  async authenticate(req) {
    const token = req.headers['x-token'];
    if (token) {
      const key = `auth_${token}`;
      let userId = await redisClient.get(key);
      if (userId) {
        userId = new mongodb.ObjectId(userId);
        const { userCollection } = mongoClient;
        const user = await userCollection.findOne({ _id: userId });
        if (user) {
          return user;
        }
      }
    }
    return null;
  }
}
const authController = new AuthController();
export default authController;
