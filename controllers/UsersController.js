/* eslint-disable class-methods-use-this */
import sha1 from 'sha1';
import mongoClient from '../utils/db';
import authController from './AuthController';
// import redisClient from '../utils/redis';

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
    const user = await authController.authenticate(req);
    if (user) {
      return res.json({ user, id: user._id, email: user.email });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
const usersController = new UsersController();
export default usersController;