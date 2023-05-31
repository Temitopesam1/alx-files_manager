import filesController from "../controllers/FilesController";

function handleConflict(req, res, next) {
    const method = req.method;
    const route = req.path;
  
    if (method === 'GET' && route === '/files') {
      filesController.getIndex(req, res);
    } else if (method === 'POST' && route === '/files') {
      filesController.postUpload(req, res);
    } else {
      // Proceed to the next middleware or route handler
      next();
    }
}
export default handleConflict;