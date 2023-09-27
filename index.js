const express = require('express');
const bodyParser = require("body-parser");
const { users, menuItems, menuCategories, tables } = require('./models');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const sendMail = require('./untils/mailer');
const app = express();
const cors = require('cors');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
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


// app.post('/register', async (req, res) => {
//   try {
//     createUser = await users.create(req.body);
//     htmlBody = '<b> to verify your account : <a href="http://localhost:8080/verify-token/';
//     htmlBody += createUser.token;
//     htmlBody += '">Link</a>';
//     sendMail(createUser.emailId, 'Your verify link', htmlBody);
//     res.send("Plse check your account for confirem....");
//   } catch (rm) {
//     abcd = rm.message.split('.')[1];
//     res.send(abcd);
//   }
// });

app.post('/register', async (req, res) => {
  try {
    const { userName, emailId, password, role } = req.body;
    if (!userName || !emailId || !password || !role) {
      return res.send('Username, email, password, or role cannot be null.');
    }
    if (!['dashboardAdmin', 'billAdmin', 'kitchenAdmin', 'orderAdmin'].includes(role)) {
      return res.send('Invalid role.');
    }
    const createUser = await users.create({
      userName: userName,
      password: password,
      emailId: emailId,
      role: role,
    });

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
  if (userL == null) {
    return res.status(401).send({ "error": "UserName or Password is incorrect" });
  }
  if (userL.isActive == 0) {
    return res.status(403).send({ "error": "Your Account is in-active plse check your Email...." });
  }
  let check = bcrypt.compareSync(req.body.password, userL.password);

  if (check) {
    const token = jwt.sign({ "uuid": userL.uuid }, "PARTH=KI=RANI=TULSI");

    const role = userL.role;
    return res.send({
      "X-Access-Token": token,
      "role": role,
      "name": userL.userName,
    });

  } else {
    return res.status(401).send({ "error": "UserName or Password is incorrect" });
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
app.post('/add/categories', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.send('name cannot be null.');
  }
  menuCategories.create({
    name: name
  });
  res.send({ success: true });
});

app.get('/all/categories', async (req, res) => {
  a = await menuCategories.findAll()
  res.send(a);
});


// M E N U I T E M
app.post('/add/menuitem', (req, res) => {
  const { name, categoryId, itemPrice } = req.body;

  if (!name || !categoryId || !itemPrice) {
    return res.send('name, categoryId, itemPrice cannot be null.');
  }
  menuItems.create({
    name: name,
    categoryId: categoryId,
    itemPrice: itemPrice
  });
  res.send({ success: true });
});

app.get('/all/menuitem', async (req, res) => {
  a = await menuItems.findAll()
  res.send(a);
});


// T  A B L E S
app.post('/new/tables', async (req, res) => {
  const { table } = req.body;
  const newTable = await tables.create({
    table,
  });
  res.status(201).json(newTable);
});

app.get('/all/tables', async (req, res) => {
  a = await tables.findAll()
  res.send(a);
});

// O R E R S


app.listen(8080, () => console.log('conneted...'));
