import Router from "express";
import redisClient from '../utils/redis';
import mongoClient from '../utils/db';

const router = Router();

router.get('/status', (req, res) =>{
    const redisAlive = redisClient.isAlive();
    const mongoAlive = mongoClient.isAlive()
    if(redisAlive && mongoAlive){
        res.status(200).json({ "redis": redisAlive, "db": mongoAlive });
    };
});

router.get('/stats', async (req,res) =>{
    const nUsers = await mongoClient.nbUsers();
    const nFiles = await mongoClient.nbFiles();
    res.status(200).json({ "users": nUsers, "files": nFiles });
});

const appController = router;
module.exports = appController;