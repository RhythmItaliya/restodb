const express = require('express');
const bodyParser = require("body-parser");
const { users } = require('./models');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const app = express();
app.use(bodyParser.json());

// Reading data from database table
app.get('/', async (req, res) => {
  a = await users.findAll()
  res.send(a);
});

app.get('/:id', async (req, res) => {
  b = await users.findOne({
    where: { id: req.params.id }
  });
  if (b == null) {
    return res.status(404);
  }
  res.send(b);
});

// find inactive users
app.get('/users/inActive/', async (req, res) => {
  inActiveUsers = await users.findAll({
    where: {
      isActive: 0,
    },
  });
  if (inActiveUsers == 0) {
    res.send('No inactive users found');
  } else {
    res.send(inActiveUsers);
  }
});

// Add data in database table
app.post('/', async (req, res) => {
  try {
    c = await users.create(req.body);
    res.send(c);
  } catch (e) {
    console.log(e);
    let xyz = "";
    for (let i = 0; i < e.errors.length; i++) {
      abc = e.errors[i].message.split('.')[1];
      xyz = xyz + abc + '\n';
    }
    res.status(400).send(xyz);
  }
});

// send link conformation
app.get('/', async (req, res) => {
  userRow = await users.create(req.body);
  console.log(userRow);
  res.send('http://localhost:8080/verify/' + userRow.token);
});

app.get('/verify/:token', async (req, res) => {
  let userRow = await users.findOne({
    where: {
      token: req.params.token
    }
  });
  if (userRow == null) {
    return res.send('This link has Expired ');
  }
  users.update({
    token: uuid.v1(), isActive: 1
  },
    {
      where: {
        id: userRow.id
      }
    });
  res.send('You are Active');
});

// // user login
app.post('/users/login/', async (req, res) => {
  let userName = req.body['userName'];
  userL = await users.findOne({
    where: {
      userName: userName
    }
  });
  if (userL == null) {
    return res.send('UserName or Password is incorrect');
  }
  if (userL.isActive == 0) {
    return res.send('You account is inactive.');
  }
  check = bcrypt.compareSync(req.body.password, userL.password);
  if (check) {
    return res.send('Login successfully.....');
  } else {
    return res.send('UserName or Password is incorrect');
  }
});

// // password reset
app.post('/reset-password/:token', async (req, res) => {
  userP = await users.findOne({
    where: {
      token: req.params.token
    }
  });
  if (userP == null) {
    return res.send('The link is invalid');
  }
  if (req.body.password1 == req.body.password2) {
    users.update({
      password: bcrypt.hashSync(req.body.password2, 10),
      token: uuid.v1(),
      isActive: 1
    }, {
      where: {
        id: userP.id
      }
    });
    res.send('Your password has been successfully updated. Congrats!');
  } else {
    res.send('Passwords do not match');
  }
});

app.listen(8080, () => console.log('conneted...'));
