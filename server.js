const express = require('express');

const bcrypt = require('bcryptjs');

const cors = require('cors');
const knex = require('knex');
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  }
});
  
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());






app.get('/', (req, res) => {
  res.send('App works!!');
})


app.listen(process.env.PORT);



app.post('/register', (req, res) => {
  const {userName, password} = req.body;
  var hash = bcrypt.hashSync(password, 10);

  db('login')
    .insert({
      username: userName,
      password: hash
    })
    .then(data => {
      res.json('success')
    })
    .catch(err => res.json(err))

});

app.post('/login', (req, res) => {
  const {userName, password} = req.body;


  db('login').select('password').where('username', userName).then(data => {
  var hash = data[0].password;
  //console.log(hash);
  var isValid = bcrypt.compareSync(password, hash);
  if(isValid){
    res.json('success');
  }
  else{
    res.json('fail');
  }
 }).catch(err => res.send(err));

});






app.get('/getprofile/:name', (req, res) =>{
  var name = req.params.name;
  db('events').select('*').where('username', name).then(data => {
    res.json(data);
    console.log(name);
  })
  .catch(err =>  res.sendStatus(err))
})


app.post('/addEvent', (req, res) =>{
  const {userName, title, url, password, actionTime, mon, tue, wed, thu, fri, sat, sun} = req.body;

  db('events').insert({
    username: userName,
    title: title,
    url: url,
    actiontime: actionTime,
    password: password,
    mon: mon,
    tue: tue,
    wed: wed,
    thu: thu,
    fri: fri,
    sat: sat,
    sun: sun
  })
  .then(data => {
    return('success')
  })
  .catch(err => err);
  
});


app.delete('/deleteEvent', (req, res) =>{
  var id = req.body.id;
  // res.json(17)

  db('events')
  .where('id', id)
  .del()
  .then(data => {
    res.json('success')
    console.log('deleted event');
  })
  .catch(err => res.status(400).json(err))
})




