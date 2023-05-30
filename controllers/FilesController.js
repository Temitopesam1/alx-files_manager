/* eslint-disable prefer-const */
import { v4 as uuidv4 } from 'uuid';
import mongoClient from '../utils/db';
import authController from './AuthController';

const fs = require('fs');

class FilesController {
  // eslint-disable-next-line class-methods-use-this
  async postUpload(req, res) {
    const acceptedTypes = ['folder', 'files', 'image'];
    const userOb = await authController.authenticate(req);
    if (userOb) {
      let {
        name, type, isPublic, parentId, data,
      } = req.body;
      if (!name) {
        return res.status(400).json({ error: 'Missing name' });
      }
      if (!acceptedTypes.includes(type)) {
        return res.status(400).json({ error: 'Missing type' });
      }
      if (!data && type !== 'folder') {
        return res.status(400).json({ error: 'Missing data' });
      }
      if (parentId) {
        const item = await mongoClient.fileCollection.findOne({ parentId });
        if (!item) {
          return res.status(400).json({ error: 'Parent not found' });
        }
        if (item.type !== 'folder') {
          return res.status(400).json({ error: 'Parent is not a folder' });
        }
      } else {
        parentId = 0;
      }
      if (!isPublic) {
        isPublic = false;
      }
      if (type === 'folder') {
        const folder = await mongoClient.fileCollection.insertOne({
          name,
          type,
          isPublic,
          parentId,
          userId: userOb._id,
        });
        const item = folder.ops[0];
        return res.status(201).json({
          id: item._id,
          userId: item.userId,
          name: item.name,
          type: item.type,
          isPublic: item.isPublic,
          parentId: item.parentId,
        });
      // eslint-disable-next-line no-else-return
      } else {
        data = Buffer.from(data, 'base64').toString('utf-8');
        const path = process.env.FOLDER_PATH || '/tmp/files_manager';
        const localPath = `${path}/${uuidv4()}`;
        await fs.writeFile(localPath, data);
        const file = await mongoClient.fileCollection.insertOne({
          name,
          type,
          isPublic,
          parentId,
          localPath,
          userId: userOb._id,
        });
        const item = file.ops[0];
        return res.status(201).json({
          id: item._id,
          userId: item.userId,
          name: item.name,
          type: item.type,
          isPublic: item.isPublic,
          parentId: item.parentId,
        });
      }
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

const filesController = new FilesController();
export default filesController;
