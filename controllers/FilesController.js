/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-const */
import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import mongoClient from '../utils/db';
import authController from './AuthController';

const mongo = require('mongodb');
const fs = require('fs');

class FilesController {
  // eslint-disable-next-line class-methods-use-this
  async postUpload(req, res) {
    const acceptedTypes = ['folder', 'file', 'image'];
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
        parentId = new mongo.ObjectId(parentId);
        const item = await mongoClient.fileCollection.findOne({ _id: parentId });
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
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path, { recursive: true });
        }
        fs.writeFileSync(localPath, data);
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

  async getShow(req, res) {
    const userOb = await authController.authenticate(req);
    if (userOb) {
      let { id } = req.params;
      id = new mongo.ObjectID(id);
      const item = await mongoClient.fileCollection.findOne({ _id: id, userId: userOb._id });
      if (item) {
        return res.status(201).json({
          id: item._id,
          userId: item.userId,
          name: item.name,
          type: item.type,
          isPublic: item.isPublic,
          parentId: item.parentId,
        });
      }
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }

  async getIndex(req, res) {
    const userOb = await authController.authenticate(req);
    const pageSize = 20;
    if (userOb) {
      let { parentId, page } = req.query;
      if (!page) {
        page = 0;
      }
      page += 1;
      if (parentId) {
        parentId = new mongo.ObjectID(parentId);
        const record = await mongoClient.fileCollection.findOne(
          { _id: parentId, userId: userOb._id },
        );
        if (record) {
          const records = await mongoClient.fileCollection.aggregate([
            { $match: { parentId } },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
          ]).toArray();
          return res.status(201).json(records);
        }
        return res.status(201).send([]);
      }
      const userFiles = await mongoClient.fileCollection.aggregate([
        { $match: { userId: userOb._id } },
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
      ]).toArray();
      return res.status(201).json(userFiles);
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }

  async putPublish(req, res) {
    const userOb = await authController.authenticate(req);
    if (userOb) {
      let { id } = req.params;
      id = new mongo.ObjectID(id);
      await mongoClient.fileCollection.updateOne(
        { _id: id, userId: userOb._id },
        { $set: { isPublic: true } },
      );
      const item = await mongoClient.fileCollection.findOne({ _id: id, userId: userOb._id });
      if (item) {
        return res.status(200).json({
          id: item._id,
          userId: item.userId,
          name: item.name,
          type: item.type,
          isPublic: item.isPublic,
          parentId: item.parentId,
        });
      }
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(401).json({ error: 'Unauthorised' });
  }

  async putUnpublish(req, res) {
    const userOb = await authController.authenticate(req);
    if (userOb) {
      let { id } = req.params;
      id = new mongo.ObjectID(id);
      await mongoClient.fileCollection.updateOne(
        { _id: id, userId: userOb._id },
        { $set: { isPublic: false } },
      );
      const item = await mongoClient.fileCollection.findOne({ _id: id, userId: userOb._id });
      if (item) {
        return res.status(200).json({
          id: item._id,
          userId: item.userId,
          name: item.name,
          type: item.type,
          isPublic: item.isPublic,
          parentId: item.parentId,
        });
      }
      return res.status(404).json({ error: 'Not found' });
    }
    return res.status(401).json({ error: 'Unauthorised' });
  }

  // eslint-disable-next-line consistent-return
  async getFile(req, res) {
    let { id } = req.params;
    id = new mongo.ObjectID(id);
    const file = await mongoClient.fileCollection.findOne({ _id: id });
    if (!file) {
      return res.status(404).json({ error: 'Not found' });
    }
    const userOb = await authController.authenticate(req);
    if ((file.isPublic === false) && (!userOb || !userOb._id.equals(file.userId))) {
      return res.status(404).json({ error: 'Not found' });
    } else {
      if ((file.isPublic === true) && (file.type === 'folder')) {
        return res.status(400).json({ error: "A folder doesn't have content" });
      }
      if (file.type === 'folder') {
        return res.status(400).json({ error: "A folder doesn't have content" });
      }
      const filePath = file.localPath;
      if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'Not found' });
      }
      const mimeType = mime.lookup(filePath);
      fs.readFile(filePath, (err, data) => {
        if (err) {
          return res.status(500).send('Error reading file');
        }
        res.setHeader('Content-Type', mimeType);
        return res.send(data);
      });
    }
  }
}

const filesController = new FilesController();
export default filesController;
