// implement your API here
const express = require('express');
const cors = require('cors');
const Users = require('./data/db');

const app = express();
app.use(express.json());
app.use(cors());
const port = 5000;

const handleError = (info, res) => {
  res.status(info.statusCode).res.json({ error: info.message });
  return;
};

//Routes...
app.get('/api/users', (req, res) => { //Get all users
  Users.find()
  .then(data => {
    res.status(200).json(data);
  })
  .catch(err => {
    handleError({ 
      statusCode: 500, 
      message: "The users information could not be retrieved."
    }, res);
  });
});

app.get('/api/users/:id', (req, res) => { //Get a user by ID
  const { id } = req.params;
  Users.findById(id)
  .then(data => {
    if(data) {
      res.status(200).json(data);
    } else {
      handleError({ 
        statusCode: 404, 
        message: "The user with the specified ID does not exist."
      }, res);
    }
  })
  .catch(err => {
    handleError({ 
      statusCode: 500, 
      message: "The user information could not be retrieved."
    }, res);
  });
});

app.post('/api/users', (req, res) => { // Create a new user
  const { name, bio } = req.body;
  if (!name || !bio) {
    handleError({ 
      statusCode: 400, 
      message: "Please provide name and bio for the user."
    }, res);
  } else {
    Users.insert({name, bio})
    .then(data => {
      return Users.findById(data.id);
    })
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      handleError({ 
        statusCode: 500, 
        message: "There was an error while saving the user to the database"
      }, res);
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
      handleError({ 
        statusCode: 404, 
        message: "The user with the specified ID does not exist."
      }, res);
    }
  })
  .then(data => {
    res.status(200).json(data);
  })
  .catch(err => {
    handleError({ 
      statusCode: 500, 
      message: "The user could not be removed"
    }, res);
  });
});

app.put('/api/users/:id', (req, res) => { // Update user by ID
  const { id } = req.params;
  const { name, bio } = req.body;
  if (!name || !bio) {
    handleError({ 
      statusCode: 400, 
      message: "Please provide name and bio for the user."
    }, res);
    return;
  }

  Users.update(id, {name, bio})
  .then(data => {
    if (data > 0) {
      return Users.findById(id);
    } else {
      handleError({ 
        statusCode: 404, 
        message: "The user with the specified ID does not exist."
      }, res);
    }
  })
  .then(data => {
    res.status(200).json(data);
  })
  .catch(err => {
    handleError({ 
      statusCode: 500, 
      message: "The user information could not be modified."
    }, res);
  });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
