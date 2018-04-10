var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Welcome to Express!' });
});

router.get('/spittoon', function(req,res,next){
  res.render('spittoon');
});

module.exports = router;
