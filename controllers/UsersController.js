import Router from "express";
import mongoClient from '../utils/db';
import sha1 from "sha1";

const router = Router();

router.post('/users', async (req, res) =>{
    const user = mongoClient.userCollection;
    const { email, password } = req.body;
    if (!email){
        return res.status(400).json({"error": "Missing Email"});
    }
    if(!password){
        return res.status(400).json({"error": "Missing Password"});
    }
    const userCollection = await user.findOne({ "email": email });
    if (userCollection){
        return res.status(400).json({"error": "Already Exist"});
    }
    const hashPassword = sha1(password);
    const result = await user.insertOne({ "email": email, "password": hashPassword });
    return res.status(201).json({ 'id': result.ops[0]._id, 'email': result.ops[0].email });
});


const userController = router;
module.exports = userController;