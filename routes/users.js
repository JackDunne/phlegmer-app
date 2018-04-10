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

router.get('/all',function(req, res, next){

    //TODO make a call to the database to retreive all events.

    /*res.render('allevents', {title: 'All Events Ever!',
                                para: 'This is a short ',
                                btn1:'Go to bottom',
                                btn2:'Go to top'});
    */
    client.keys('loogie*', function(err, data){
        if(err){
            console.log(err);
        }
        /*else if(1==0){
            //test idea
            let eventJSON = {events:[]};

            for(let d=0; d<data.length;d++){
                client.hgetall(data[d],function(err,obj){
                    eventJSON.events.push({event:obj});
                });
            }
            res.render('allevents',eventJSON);
            console.log(eventJSON);
        }
        */
        else{
            let loogielist = {};

            for(let d=0; d<data.length; d++){
                let item = "loogielist"+d;
                loogielist[item] = data[d];
            }
            res.render('allloogies', loogielist);
            console.log(data);
            console.log(loogielist);
        }
    });
});
module.exports = router;
