import redisClient from '../utils/redis';
import mongoClient from '../utils/db';

class AppController {
  status(req, res) {
    this.redisAlive = redisClient.isAlive();
    this.mongoAlive = mongoClient.isAlive();
    if (this.redisAlive && this.mongoAlive) {
      res.status(200).json({ redis: this.redisAlive, db: this.mongoAlive });
    }
  }

  async stats(req, res) {
    this.nUsers = await mongoClient.nbUsers();
    this.nFiles = await mongoClient.nbFiles();
    res.status(200).json({ users: this.nUsers, files: this.nFiles });
  }
}
const appController = new AppController();
export default appController;
