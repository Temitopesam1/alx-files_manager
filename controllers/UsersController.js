/* eslint-disable class-methods-use-this */
import sha1 from 'sha1';
import mongoClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  async users(req, res) {
    const user = mongoClient.userCollection;
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing Email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing Password' });
    }
    const userCollection = await this.user.findOne({ email });
    if (userCollection) {
      return res.status(400).json({ error: 'Already Exist' });
    }
    const hashPassword = sha1(password);
    const result = await user.insertOne({ email, password: hashPassword });
    return res.status(201).json({ id: result.ops[0]._id, email: result.ops[0].email });
  }

  async getMe(req, res) {
    const token = req.headers['x-token'];
    if (token) {
      console.log('token', token);
      const key = `auth_${token}`;
      const userId = await redisClient.get(key);
      console.log('usrId', userId);
      if (userId) {
        const { userCollection } = mongoClient;
        const user = await userCollection.findOne({ _id: userId });
        console.log('user', user);
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
