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
        console.log('Somethings not right');
        res.send('Missing required fields');
         }
      else {
        console.log('ESTABILISHING DB CONNECTION');
        MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, function(err, client) {
          if(err) console.log(err);
          console.log('Connection acquired');
          var db = client.db('cluster0');
          console.log('made it');
          var collection = db.collection(project);
          collection.insertOne(issue, function(err,doc){
            if(err) throw err;
            issue._id = doc.insertedId;
            res.json(issue);
            client.close();
          });      
        });
      }  
  })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};