var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/users');
var feedingCollection = db.get('feedings');
var diaperCollection = db.get('diapers');
var sleepCollection = db.get('sleeps');
var notesCollection = db.get('notes');

/* GET users listing. */

//heroku_k320rbt1:7jojekab8a811g266n9kgo9k7l@ds051843.mongolab.com:51843/heroku_k320rbt1
router.get('/notes', function(req, res) {
  notesCollection.findOne({}, function (err, docs) {
    res.json(docs);
  });
});

router.post('/newnotes', function(req, res) {
  notesCollection.insert(req.body, function(err, result){
      res.send(
          (err === null) ? { msg: '' } : { msg: err }
      );
  });
});

router.put('/notes/:id', function(req, res) {
    var notesID = req.params.id;
    notesCollection.updateById(notesID, {'notes': req.body.notes, 'date': req.body.date}, function(err) { 
      res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

router.get('/diapers', function(req, res) {
    diaperCollection.find({}, function (err, docs) {
      res.json(docs);
  });
});

router.post('/newdiapers', function(req, res) {
  diaperCollection.insert(req.body, function(err, result){
      res.send(
          (err === null) ? { msg: '', body: req.body } : { msg: err }
      );
  });
});

router.put('/diapers/:id', function(req, res) {
    var diaperID = req.params.id;
    diaperCollection.updateById(diaperID, {'wet':req.body.wet, 'dirty': req.body.dirty, 'date': req.body.date}, function(err) {
        res.send((err === null) ? { msg: '', body: req.body } : { msg:'error: ' + err });
    });
});

router.get('/feedings', function(req, res) {
    feedingCollection.find({}, function (err, docs) {
      res.json(docs);
  });
});

router.post('/newfeeding', function(req, res) {
  feedingCollection.insert(req.body, function(err, result){
      res.send(
          (err === null) ? { msg: '' } : { msg: err }
      );
  });
});

router.put('/feedings/:id', function(req, res) {
    var feedingID = req.params.id;
    feedingCollection.updateById(feedingID, {'time':req.body.time, 'minutes': req.body.minutes, 'ounces': req.body.ounces, 'date': req.body.date}, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

router.delete('/feedings/:id', function(req, res) {
    var feedDelete = req.params.id;
    feedingCollection.remove({ '_id' : feedDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

router.get('/sleeps', function(req, res) {
    sleepCollection.find({}, function (err, docs) {
      res.json(docs);
  });
});

router.post('/newsleep', function(req, res) {
  sleepCollection.insert(req.body, function(err, result){
      res.send(
          (err === null) ? { msg: '' } : { msg: err }
      );
  });
});

router.put('/sleeps/:id', function(req, res) {
    var sleepsID = req.params.id;
    sleepCollection.updateById(sleepsID, {'asleep':req.body.asleep, 'awake': req.body.awake, 'date': req.body.date}, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});
router.delete('/sleeps/:id', function(req, res) {
    var sleepDelete = req.params.id;
    sleepCollection.remove({ '_id' : sleepDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});


module.exports = router;
