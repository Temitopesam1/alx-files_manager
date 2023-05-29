import router from './routes/index'
const express = require('express');
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json()); 
app.use(router);


app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
