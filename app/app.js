/*eslint-env node*/

var express = require('express');
var app = express();

app.set('views', './views');
app.set('view engine', 'pug');

var MongoClient = require('mongodb').MongoClient;

app.get('/', function (req, res) {
    res.render('operazioni', {message: 'seleziona l\'operazione da effettuare e inserisci le informazioni corrispondenti', title:'CRUD'});
});

app.get('/execOp', function (req, res) {
    var operazione = req.query.operazione;
    switch (operazione) {
        case "create":
            MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
              if (err) {
                throw err;
              }
              var dbo = db.db("5E");
              var newUser = { firstName: req.query.cNome, lastName: req.query.cCognome, email: req.query.cEmail };
              dbo.collection("Users").insertOne(newUser, function(err, result) {
                if (err) throw err;
                if (result.result.n == 1)
                    res.render("risposta", {message:"utente inserito correttamente", title: "CRUD"});
                else
                    res.render("risposta", {message: "problemi nell'inserimento", title: "CRUD"});
                db.close();
              });
              // è possibile utilizzare anche insertMany() per inserire più document in una volta sola
            });
        break;
        case "read":
            MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
              if (err) {
                throw err;
              }
              var dbo = db.db("5E");
              dbo.collection("Users").find().sort({lastName:1}).toArray(function(err, result) {
                if (err) {
                  throw err;
                }
                res.render('elenco', {message: 'utenti inseriti', title:'CRUD', list: result});
                db.close();
              });
            });
        break;
        case "update":
            MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
              if (err) {
                throw err;
              }
              var dbo = db.db("5E");
              var myUser = { firstName: req.query.uNome, lastName: req.query.uCognome};
              var newEmail = { $set: {email: req.query.uEmail} };
              dbo.collection("Users").updateOne(myUser, newEmail, function(err, result) {
                if (err) throw err;
                if (result.result.n == 1)
                    res.render("risposta", {message: "email modificata correttamente", title: "CRUD"});
                else
                    res.render("risposta", {message: "problemi nell'aggiornamento (utente inesistente)", title: "CRUD"});
                db.close();
              });
              // è possibile utilizzare anche updateMany() per modificare più document in una volta sola
            });
        break;
        case "delete":
            MongoClient.connect('mongodb+srv://admin:MwbZUn1JUfbuRoSK@galvani-c4mon.mongodb.net/?retryWrites=true,{useNewUrlParser: true}', function(err, db) {
              if (err) {
                throw err;
              }
              var dbo = db.db("5E");
              var myUser = { firstName: req.query.dNome, lastName: req.query.dCognome};
              dbo.collection("Users").deleteOne(myUser, function(err, result) {
                if (err) throw err;
                if (result.result.n == 1)
                    res.render("risposta", {message: "utente eliminato correttamente", title: "CRUD"});
                else
                    res.render("risposta", {message: "problemi nell'eliminazione (utente inesistente)", title: "CRUD"});
                db.close();              
              });
              // è possibile utilizzare anche deleteMany() per eliminare più document in una volta sola
            });
        break;
    }
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
