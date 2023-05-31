import bodyParser from 'body-parser';
import router from './routes/index';

const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());
app.use(router);

app.get('/', (req, res) => {
  res.send('Welcome to Olamide and Temitope File Manager API');
});

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
