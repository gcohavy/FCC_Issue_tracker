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
var Handler = require('../controllers/handler.js')

const CONNECTION_STRING = process.env.DB; 
MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
    })
    
    .post(function (req, res){
      var project = req.params.project;
      res.json({issue_title: project.issue_title, issue_text: project.issue_text, created_by: project.created_by});
  })
    
    .put(function (req, res){
      var project = req.params.project;
      
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
    });
    
};