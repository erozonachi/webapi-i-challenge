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

app.get('/api/users/:id', (req, res) => { //Get a user by ID
  const { id } = req.params;
  Users.findById(id)
  .then(data => {
    if(data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
  })
  .catch(err => {
    res.status(500).json({ error: "The user information could not be retrieved." });
  });
});

app.post('/api/users', (req, res) => { // Create a new user
  const { name, bio } = req.body;
  if (!name || !bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    Users.insert({name, bio})
    .then(data => {
      return Users.findById(data.id);
    })
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error while saving the user to the database" });
    });
  }
});

app.delete('/api/users/:id', (req, res) => { // Delete a user by ID
  const { id } = req.params;
  Users.remove(id)
  .then(data => {
    if (data > 0) {
      return Users.find();
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
  })
  .then(data => {
    res.status(200).json(data);
  })
  .catch(err => {
    res.status(500).json({ error: "The user could not be removed" });
  });
});

app.put('/api/users/:id', (req, res) => { // Update user by ID
  const { id } = req.params;
  const { name, bio } = req.body;
  if (!name || !bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    return;
  }

  Users.update(id, {name, bio})
  .then(data => {
    if (data > 0) {
      return Users.findById(id);
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." })
    }
  })
  .then(data => {
    res.status(200).json(data);
  })
  .catch(err => {
    res.status(500).json({ error: "The user information could not be modified." });
  });
});

app.listen(port, () => {
  console.log('Server running on port: 5000');
});
