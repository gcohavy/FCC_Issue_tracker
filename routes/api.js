/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; 

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      var issue = {
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_on: new Date(),
        updated_on: new Date(),
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || '',
        status_text: req.body.status_text || '',
        open: true
      };
      if(!issue.issue_title || !issue.issue_text || !issue.created_by){
     //   console.log('Somethings not right');
        res.send('Missing required fields');
         }
      else {
      //  console.log('ESTABILISHING DB CONNECTION');
        MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true,useUnifiedTopology: true },  function(err, client) {
          if(err) console.log(err);
       //   console.log('Connection acquired');  
          var db = client.db('project');
          var collection = db.collection(project)
          collection.insertOne(issue, function(err, doc) {
            issue._id = doc.insertedId;
            res.json(issue);
            client.close();
          });
        });
      }  
  })
    
    .put(function (req, res){
      var project = req.params.project;
      var id = req.body._id;
      delete req.body._id;
      var updates = req.body;
      for (var thing in updates) if (!updates[thing]) delete updates[thing];
      if (updates.open) updates.open = String(updates.open) == 'true';
  //    console.log(Object.entries(updates).length===0);
      if (Object.entries(updates).length===0) {
       // console.log('no entries');
        res.send('No updated field sent');
      }
      updates.updated_on = new Date();
      MongoClient.connect(CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client)=> {
 //       console.log('Connection acquired');
        var db = client.db('project');
        var collection = db.collection(project);
          collection.findOneAndUpdate({_id: id},updates,function(err,doc){
            if(err) console.log(err);
            (!err) ? res.send('successfully updated') : res.send('could not update '+id+' '+err);
    //        console.log(doc.value);
          });
      })
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};