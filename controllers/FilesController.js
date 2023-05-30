/* eslint-disable object-curly-newline */
/* eslint-disable class-methods-use-this */
// import mongoClient from '../utils/db';
import authController from './AuthController';

class FilesController {
  async postUpload(req, res) {
    const acceptedTypes = ['folder', 'files', 'image'];
    const userOb = await authController.authenticate(req);
    if (userOb) {
      const { name, type, isPublic, parentId, data } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Missing name' });
      }
      if (!acceptedTypes.includes(type)) {
        return res.status(400).json({ error: 'Missing type' });
      }
      if (!data && type !== 'folder') {
        return res.status(400).json({ error: 'Missing data' });
      }
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
const filesController = new FilesController();
export default filesController;
