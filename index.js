// implement your API here
const express = require('express');
const Users = require('./data/db');

const app = express();
app.use(express.json());
const port = 5000;

//Routes...
app.get('/api/users', (req, res) => { //Get all users
  Users.find()
  .then(data => {
    res.status(200).json(data);
  })
  .catch(err => {
    res.status(500).json({ error: "The users information could not be retrieved." });
  });
});

app.listen(port, () => {
  console.log('Server running on port: 5000');
});
