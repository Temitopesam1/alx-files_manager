/* eslint-disable class-methods-use-this */
import redisClient from '../utils/redis';
import mongoClient from '../utils/db';

class AppController {
  status(req, res) {
    const redisAlive = redisClient.isAlive();
    const mongoAlive = mongoClient.isAlive();
    if (redisAlive && mongoAlive) {
      res.status(200).json({ redis: redisAlive, db: mongoAlive });
    } else {
      res.status(500).send('Kindly wait a moment for our database');
    }
  }

  async stats(req, res) {
    const nUsers = await mongoClient.nbUsers();
    const nFiles = await mongoClient.nbFiles();
    res.status(200).json({ users: nUsers, files: nFiles });
  }
}
const appController = new AppController();
export default appController;
