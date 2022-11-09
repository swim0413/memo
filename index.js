'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const time = require('moment-timezone');

const fs = require('fs');
const app = express();

const PORT = 515;
const hostName = '127.0.0.1';

app.set('view engine', 'ejs');
app.use(express.static('views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let db = null;
if(!fs.existsSync('./data/db.json')){
  let initial = JSON.parse('{"data": []}');
	fs.writeFile('./data/db.json', JSON.stringify(initial, null, 2), 'utf-8', function(err){
    if(err){
      console.log(`${err=> {err}}`)
    }
  });
}
fs.readFile('./data/db.json', 'utf-8', (err, jsonFile)=>{
  db = JSON.parse(jsonFile);
});

app.get('/', (req, res) => {
  res.render('main', {data: db});
});

app.post('/add', async function(req, res){
  let title = req.body.title;
  let content = req.body.content;
  if(title.trim() == "" || content.trim() == ""){
    return res.redirect('/');
  }
  let time = getTime();
  db['data'].push({title, content, time});
  fs.writeFile('./data/db.json', JSON.stringify(db, null, 2), 'utf-8', function(err){
    if(err){
      console.log(`${err=> {err}}`)
    }
  });
  res.redirect('/');
  console.log(title, content);
});

const getTime = () => {
  var m = time().tz("Asia/Seoul");
  return m.format("YYYY-MM-DD HH:mm:ss");
};

app.listen(PORT/** , hostName**/, () => {
    console.log(`http://${hostName}:${PORT}`);
});