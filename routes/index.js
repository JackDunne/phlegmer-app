var express = require('express');
var router = express.Router();
const redis = require('redis');
/* GET users listing. */
/* prefaced by /user/routename*/
let client = redis.createClient();

client.on('connect',function(){
  console.log("connected to Redis");
});


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Welcome to Express!' });
});

router.get('/spittoon', function(req,res,next){
  res.render('spittoon');
});

router.post('/spittoon/reload', function(req,res,next){
  let id = req.body.id;
  client.hgetall(id,function(err,obj){
    if(!obj){
      res.render('index',{
        error: 'loogie does not exist',
        title: 'NO!'
      });
    }
    else{
      obj.id = id;
      res.render('spittoon',{
        loogie:obj
      });
    }
  })
});




module.exports = router;
