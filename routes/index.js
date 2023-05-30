import Router from "express";
import appController from "../controllers/AppController";
import userController from "../controllers/UsersController"; 
import authController from "../controllers/AuthController";

const router = Router();

router.use('/users/me', userController.getMe);
router.use('/status', appController.status);
router.use('/stats', appController.stats);
router.use('/users/', userController.users);
router.use('/connect', authController.getConnect);
router.use('/Disconnect', authController.getDisconnect);



module.exports = router;