const express = require("express");
const hbs = require("hbs");
const jsonParser = express.json();
const multer  = require("multer");
var http = require("http");
var bodyParser = require('body-parser');
const app = express();
const urlencodedParser = express.urlencoded({extended: false});
const sqlite3 = require('sqlite3').verbose();
app.use('/contact', express.static('contact'));
app.use('/index', express.static('index'));
app.use(multer({dest:"index"}).single("filedata"));
var dataRes;

app.use('/views', express.static('views'));  
app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");
  
app.post("/user", jsonParser, function (request, response) {
    RegUser (request.body.userName, request.body.userPassword, request.body.userPhone, request.body.userEmail, request.body.userGender);
    console.log(request.body);
    if(!request.body) return response.sendStatus(400);     
    response.json("Данные отправлены"); // отправляем пришедший ответ обратно 
 
});

function RegUser(userName,userPassword,userPhone,userEmail,userGender,filedata){

    const db = new sqlite3.Database('JavaBD.db', sqlite3.OPEN_READWRITE, (err) =>
    {
        if(err)
            return console.error(err.message);
        console.log("подключение к базе установлено");
    } );
    const sql=`INSERT INTO Registation (NameUserReg,AgeReg,PhoneReg,EmailReg,GenderReg,PhotoReg)
                VALUES(?,?,?,?,?,?)`;
    db.run(sql, [userName,userPassword,userPhone,userEmail,userGender,filedata], (err) =>{
        if (err)
            return console.error(err.message);
    console.log("Запрос выполнен");
    });

    db.close((err) =>{
        if(err)
        return console.error(err.message);
    });
}

const upload = multer({dest:"contact"});

app.post("/contact", urlencodedParser , function (request, response,next) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    let userNameVopros=request.body.userNameVopros;
    let usersVopros=request.body.usersVopros;
    let usersVoprosEmails=request.body.usersVoprosEmails;
    let filedata=request.file;
    addVopros(userNameVopros,usersVopros,usersVoprosEmails,filedata.filename);
    response.sendFile(__dirname + "/contact.html");
      });

app.post("/index", urlencodedParser, function (request, response,next) {
        if(!request.body) return response.sendStatus(400);
        console.log(request.body);
        let filedata=request.file;       
          });

function addVopros(userNameVopros,usersVopros,usersVoprosEmails,filedata){

    const db = new sqlite3.Database('JavaBD.db', sqlite3.OPEN_READWRITE, (err) =>
    {
        if(err)
            return console.error(err.message);
        console.log("подключение к базе установлено");
    } );
    const sql=`INSERT INTO CreateQuestion (NameQuestion,Question,QuestionEmail,QuestionPhoto)
                VALUES(?,?,?,?)`;
    db.run(sql, [userNameVopros,usersVopros,usersVoprosEmails,filedata], (err) =>{
        if (err)
            return console.error(err.message);
    console.log("Запрос выполнен");
    });
  
    db.close((err) =>{
        if(err)
        return console.error(err.message);
    });
  }

  function readMessage(){
    const db = new sqlite3.Database('JavaBD.db', sqlite3.OPEN_READWRITE, (err) =>
  {
      if(err)
          return console.error(err.message);
      console.log("подключение к базе установлено");
  } );

  const sql=`SELECT * FROM CreateQuestion`;
  db.all(sql, [], (err,result) =>{
      if (err)
          return console.error(err.message);
  console.log("Запрос на прочтение данных выполнен");
    dataRes = JSON.parse(JSON.stringify(result));
  });
}
  
app.get("/", function(request, response){      
    response.sendFile(__dirname + "/index.html");
});


app.get("/index", function(request, response){      
    response.sendFile(__dirname + "/index.html");
}); 

app.get("/contact", function(request, response){      
    response.sendFile(__dirname + "/contact.html");
}); 
app.get("/message", function (request, response) {
    readMessage();
      response.render('message.hbs', {dataRes:  dataRes});
  });

app.listen(3000);