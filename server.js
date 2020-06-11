// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
//using req.body
const bodyparser = require('body-parser');
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
//using pug
app.set('view engine', 'pug');
 app.set('views', './views');
//using lowdb
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ dreams: []})
  .write()

app.get("/", (request, response) => {
  response.render('index',{
    todoslist : db.get('dreams').value() 
  });
});

app.get('/todos',function(req,res){
  var q = req.query.q;
  var matchTodo = db.get('dreams').value().filter(function(x){
    return x.title.toLowerCase().indexOf(q.toLowerCase()) !==-1;
  })
  res.render('index',{
    todoslist : matchTodo ,
    q : q
  });
})

app.get('/create',function(req, res){
  res.render('create');
})

app.post('/todos/create',function(req, res){
  db.get('dreams').push(req.body).write();
  res.redirect('/');
})
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
