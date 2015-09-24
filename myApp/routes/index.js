var express = require('express');
var router = express.Router();
// var db = require('monk')('localhost/stat-demo');
// var feedingCollection = db.get('feedings');
// var diaperCollection = db.get('diapers');
// var sleepCollection = db.get('sleeps');
// var notesCollection = db.get('notes');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'New Mom Helper' });
});

module.exports = router;
