const express = require('express');
const bodyParser = require("body-parser");
const { users, menuItems, menuCategories } = require('./models');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const sendMail = require('./untils/mailer');
const app = express();
const cors = require('cors');
const { Op } = require('sequelize');
var corsOptions = {
  origin: 'http://localhost:5500',
}
app.use(cors(corsOptions));
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
app.get('/users/inActive', async (req, res) => {
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
// app.get('/', async (req, res) => {
//   userRow = await users.create(req.body);
//   console.log(userRow);
//   res.send('http://localhost:8080/verify/' + userRow.token);
// });

// app.get('/verify/:token', async (req, res) => {
//   let userRow = await users.findOne({
//     where: {
//       token: req.params.token
//     }
//   });
//   if (userRow == null) {
//     return res.send('This link has Expired ');
//   }
//   users.update({
//     token: uuid.v1(), isActive: 1
//   },
//     {
//       where: {
//         id: userRow.id
//       }
//     });
//   res.send('You are Active');
// });

app.post('/sendlink', async (req, res) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    createUser = await users.create(req.body);
    htmlBody = '<b> to verify your account : <a href="http://localhost:8080/verify-token/';
    htmlBody += createUser.token;
    htmlBody += '">Link</a>';
    sendMail(createUser.emailId, 'Your verify link', htmlBody);
    res.send("Plse check your account for confirem....");
  } catch (rm) {
    abcd = rm.message.split('.')[1];
    res.send(abcd);
  }
});

app.get('/verify-token/:token', async (req, res) => {
  userV = await users.findOne({
    where: {
      token: req.params.token
    }
  });
  if (userV == null) {
    return res.send('Your link is wrong');
  }
  users.update({
    token: uuid.v1(),
    isActive: 1
  }, {
    where: {
      id: userV.id
    }
  });
  res.send('You are verified.');
});


// U S E R L O G I N
app.post('/users/login', async (req, res) => {
  let username = req.body.userName;
  let userL = await users.findOne({
    where: {
      [Op.or]: {
        userName: username,
        emailId: username
      }
    }
  });
  console.log(userL);
  if (userL == null) {
    return res.status(401).send('UserName or Password is incorrect');
  }
  if (userL.isActive == 0) {
    return res.status(401).send('You account is inactive.');
  }
  check = bcrypt.compareSync(req.body.password, userL.password);
  if (check) {
    return res.send('Login successfully.....');
  } else {
    return res.status(401).send('UserName or Password is incorrect');
  }
});

// P A S S W O R D - R E S E T
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

// C A T E G O R I E S
app.post('/categoties', async (req, res) => {
  categoR = await menuCategories.create(req.body);
  res.send(categoR);
});

// M E N U I T E M S 
app.post('/itemname', async (req, res) => {
  itemN = await menuItems.create(req.body);
  res.send(itemN);
});

// 

app.listen(8080, () => console.log('conneted...'));
