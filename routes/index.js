import Router from 'express';
import handleConflict from '../utils/util';
import appController from '../controllers/AppController';
import userController from '../controllers/UsersController';
import authController from '../controllers/AuthController';
import filesController from '../controllers/FilesController';

const router = Router();

router.use('/users/me', userController.getMe);
router.use('/status', appController.status);
router.use('/stats', appController.stats);
router.use('/users', userController.postNew);
router.use('/connect', authController.getConnect);
router.use('/Disconnect', authController.getDisconnect);
router.use('/files/:id/unpublish', filesController.putUnpublish);
router.use('/files/:id/publish', filesController.putPublish);
router.use('/files/:id', filesController.getShow);
router.use(handleConflict);

module.exports = router;
