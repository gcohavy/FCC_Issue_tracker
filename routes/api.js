/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
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
        MongoClient.connect(CONNECTION_STRING, function(err, client) {
          var db = client.db('mydb');
          console.log('Connection acquired');
          var collection = db.collection(project);
          if(!collection) console.log('collection does not exists');
          collection.insertOne(issue, function(err,doc){
            if(err) throw err;
            console.log(doc);
            issue._id = doc.insertedId;
            console.log('in the database');
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