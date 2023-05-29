import Router from "express";
import appController from "../controllers/AppController";
import userController from "../controllers/UsersController";

const router = Router();

router.use(appController);
router.use(userController);


module.exports = router;