const express = require('express');
const bodyParser = require("body-parser");
const { users } = require('./models');
const uuid = require('uuid');
const app = express();
const bcrypt = require('bcrypt');

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

// Password reset
app.post('/password/:token', async (req, res) => {
  if (req.body.password1 != req.body.password2) {
    return res.send('Your password do not match');
  }
  result = await users.update({
    password: bcrypt.hashSync(req.body.password1, 10),
    token:uuid.v4()
  },{
    where:{
      token:req.params.token
    }
  });
  console.log(result);
});

// password reser link
app.get('/', async (req, res) => {
  userRow1 = await users.create(req.body);
  console.log(userRow1);
  res.send('http://localhost:8080/reset/' + userRow1.token);
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

app.listen(8080, () => console.log('conneted...'));
