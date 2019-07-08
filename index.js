// implement your API here
const express = require('express');

const app = express();
app.use(express.json());
const port = 5000;

//Routes...
app.get('/', (req, res) => {
  res.status(200).json('The very begining of this API service...');
});

app.listen(port, () => {
  console.log('Server running on port: 5000');
});
