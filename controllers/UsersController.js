/* eslint-disable class-methods-use-this */
import sha1 from 'sha1';
import mongoClient from '../utils/db';
import redisClient from '../utils/redis';

const mongodb = require('mongodb');

class UsersController {
  async postNew(req, res) {
    const user = mongoClient.userCollection;
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing Email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing Password' });
    }
    const userCollection = await user.findOne({ email });
    if (userCollection) {
      return res.status(400).json({ error: 'Already Exist' });
    }
    const hashPassword = sha1(password);
    const result = await user.insertOne({ email, password: hashPassword });
    return res.status(201).json({ id: result.ops[0]._id, email: result.ops[0].email });
  }

  async getMe(req, res) {
    const token = req.headers['x-token'];
    console.log(token);
    if (token) {
      const key = `auth_${token}`;
      let userId = await redisClient.get(key);
      console.log(userId);
      if (userId) {
        userId = new mongodb.ObjectId(userId);
        const { userCollection } = mongoClient;
        // eslint-disable-next-line no-undef
        const user = await userCollection.findOne({ _id: userId });
        console.log(user);
        if (user) {
          return res.json({ id: user._id, email: user.email });
        }
      }
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
const usersController = new UsersController();
export default usersController;
