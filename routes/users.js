const express = require('express');
const router = express.Router();
const redis = require('redis');
/* GET users listing. */
/* prefaced by /user/routename*/
let client = redis.createClient();

client.on('connect',function(){
  console.log("connected to Redis");
});

router.post('/myprofile',function(req,res,next){
  let loogieID = "loogie"+req.body.id;
  let content = req.body.content;

  client.hmset(loogieID,['content',content],function(err,reply){
    if(err){
      console.log(err);
    }
    else{
      console.log(reply);
      res.redirect('/');
    }
  });
});

router.get('/goto/:id',function (req, res){
    let id = req.params.id;
    client.hgetall(id,function(err,obj){
        if(!obj){
            console.log(id);
            res.render('index',{
                error: 'event does not exist',
                title: 'NO!'
            });
        }
        else{
            console.log(obj);
            obj.id = req.params.id;
            res.render('display',{
                loogie:obj
            });
        }
    })
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/myprofile', function(req,res,next){
  res.render('myprofile');
});

router.get('/myfollowers', function(req,res,next){
  res.render('myfollowers');
});

router.post('/loogiedisplay', function(req,res,next){
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
      res.render('display',{
        loogie:obj
      });
    }
  })
});

router.delete('/delete/:id',function(req,res,next){
    client.del(req.params.id);
    res.redirect('/')
});

module.exports = router;
