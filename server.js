const express = require('express');

const bcrypt = require('bcryptjs');

const cors = require('cors');
const knex = require('knex');

const rand = require("random-key");

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






app.listen(process.env.PORT);

app.get('/', (req, res) => {
  res.json('Hi ther!');
})



app.post('/register', (req, res) => {
  const {userName, password} = req.body;
    var hash = bcrypt.hashSync(password, 10);
    var userkey  = rand.generate(30);

    db('login').select('id').where('username', userName).then(data => {

        if(!data[0]){
          db('login')
          .insert({
            username: userName,
            password: hash,
            key: userkey
          })
          .then(data => {
            res.json(userkey);
          })
          .catch(err => res.json('fail'))
        }
        else{
          res.json('fail');
        }
  })




});

app.post('/login', (req, res) => {
  const {userName, password} = req.body;


    db('login').select('password').where('username', userName).then(data => {
    var hash = data[0].password;
    var isValid = bcrypt.compareSync(password, hash);
    if(isValid){
      db.select('*').from('login')
      .where('username', userName)
      .then(user => {
        res.json(user[0].key);
      })
      .catch(err =>  res.json('fail'))
    }
    else{
      res.json('fail');
    }
  }).catch(err => res.json('fail'));

});






app.get('/getprofile/:name/:key', (req, res) =>{
  
  var name = req.params.name;
  var key = req.params.key;

    db('login').select('key').where('username', name).then(data => {
      if(data[0].key === key){
        db('events').select('*').where('username', name).then(data => {
          res.json(data);
        })
        .catch(err =>  res.json('fail'))
      } else {
        res.json('fail');
      }
    }).catch(err => res.json('fail'));

})


app.post('/addEvent', (req, res) =>{
  const {userName, title, url, password, actionTime, mon, tue, wed, thu, fri, sat, sun, key} = req.body;



  db('login').select('key').where('username', userName).then(data => {
    if(data[0].key === key){
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
        res.json('success');
      })
      .catch(err => res.json('fail'));

    } else {
      res.json('fail');
    }
  }).catch(err => res.json('fail'));



});



app.delete('/deleteEvent', (req, res) =>{
  var id = req.body.id;
  var key = req.body.key;
  var username = req.body.username;
  db('login').select('key').where('username', username).then(data => {
    if(data[0].key === key){
      db('events')
      .where('id', id)
      .del()
      .then(data => {
        res.json('success')
      })
      .catch(err => res.json('fail'))
    } else {
      res.json('fail');
    }
  }).catch(err => res.json('fail'));


})



app.get('/getTasks/:username/:key', (req, res) => {
  const username = req.params.username

  var key = req.params.key;

  db('login').select('key').where('username', username).then(data => {
    if(data[0].key === key){
      db('tasks').select('*').where('username', username).then(data => {
        res.json(data);
      })
      .catch(err =>  res.json('fail'))
    } else {
      res.json('fail');
    }
  }).catch(err => res.json('fail'));
})


app.post('/addTask', (req, res) => {
  const task = req.body.task;
  const username = req.body.username;
  const key = req.body.key;

  db('login').select('key').where('username', username).then(data => {
    if(data[0].key === key){
      db('tasks').insert({
        username: username,
        name: task
      })
      .then(data => {
        res.json('success');
      })
      .catch(err => res.json('fail'));
    } else {
      res.json('fail');
    }
  }).catch(err => res.json('fail'));
  
})


app.delete('/deleteTask', (req, res) => {
  var id = req.body.id;
  var username = req.body.username;
  var key = req.body.key;

  db('login').select('key').where('username', username).then(data => {
    if(data[0].key === key){
      db('tasks')
      .where('id', id)
      .del()
      .then(data => {
        res.json('success')
      })
      .catch(err => res.json('fail'))
    } else {
      res.json('fail');
    }
  }).catch(err => res.json('fail'));
  


})
