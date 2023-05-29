import index from './routes'
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});