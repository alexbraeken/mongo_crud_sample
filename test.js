var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
const {check, validationResult} = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users'])
var ObjectID = mongojs.ObjectID;


var app = express();

//View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set Static path
app.use(express.static(path.join(__dirname, 'public')));

//Global vars
app.use(function(req, res, next){
  res.locals.errors = null;
  res.locals.arErrors = null;
  next();
})


app.get('/', function(req, res){
  db.users.find(function (err, docs) {
	   //console.log(docs);

      res.render('index', {
          form_title:'Add Customer',
          title:'Customers',
          users: docs
  });
})
});

app.get('/about', function(req, res){
  res.render('about', {
    title:'About Us'
  });
});

app.get('/contact', function(req, res){
  res.render('contact', {
    title:'Contact Us'
  });
});

app.post('/users/add',[
  check('first_name').not().isEmpty().withMessage('First Name is required'),
  check('last_name').not().isEmpty().withMessage('Last Name is required'),
  check('email').not().isEmpty().withMessage('Email is required')],
  (req, res, next) => {

  errors = validationResult(req);
  if (!errors.isEmpty()) {
    arErrors = errors.array();
    db.users.find(function (err, docs) {
        res.render('index', {
            form_title:'Add Customer',
            title:'Customers',
            users: docs,
            arErrors: arErrors
    });
    })
    console.log(arErrors);
    /*return res.status(422).json({ errors: errors.mapped() });*/
  }
  else{
    var newUser = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email
  }

    db.users.insert(newUser, function(err, result){
      if(err){
        console.log(err);
      }
      res.redirect('/');
    });
  console.log('Success');
  }
});

app.delete('/users/delete/:id', function(req, res){
  db.users.remove({_id: ObjectID(req.params.id)}, function(err, results){
    if(err){
      console.log(err);
    }
    res.redirect('/');
  });
});

app.post('/users/update/:id', [
  check('first_name').not().isEmpty().withMessage('First Name is required'),
  check('last_name').not().isEmpty().withMessage('Last Name is required'),
  check('email').not().isEmpty().withMessage('Email is required')], (req, res, next) =>{

    errors = validationResult(req);
    if (!errors.isEmpty()) {
      arErrors = errors.array();
      db.users.find(function (err, docs) {
          res.render('index', {
              form_title:'Edit Customer',
              title:'Customers',
              users: docs,
              arErrors: arErrors
      });
      })
      console.log(arErrors);
      /*return res.status(422).json({ errors: errors.mapped() });*/
    }
    else{
      var user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
      };
      console.log(ObjectID(req.params.id));
      console.log(user);
      db.users.save({_id: ObjectID(req.params.id), first_name:user.first_name, last_name:user.last_name, email:user.email}, function(err, data){
      if(err){
        throw err;
        }
        res.redirect('/');
      console.log('Updated');
    });
  }
});

app.listen(3000, function(){
  console.log('Server started on port 3000');
})
