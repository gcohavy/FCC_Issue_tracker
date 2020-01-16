/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");

chai.use(chaiHttp);

var _ida;

suite("Functional Tests", function() {
  suite("POST /api/issues/{project} => object with issue data", function() {
    test("Every field filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "text",
          created_by: "Functional Test - Every field filled in",
          assigned_to: "Chai and Mocha",
          status_text: "In QA"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.created_by,"Functional Test - Every field filled in" );
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.status_text, "In QA");
          assert.isBoolean(res.body.open);
          assert.equal(res.body.open, true);
          assert.property(res.body, "_id");
          _ida = res.body._id;
          /**/
          done();
        });
    });

    test("Required fields filled in", function(done) {
      chai
        .request(server)
        .post("/api/issues/test")
        .send({
          issue_title: "Title",
          issue_text: "Text",
          created_by: "Creator"
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "Title");
          assert.equal(res.body.issue_text, "Text");
          assert.equal(res.body.created_by, "Creator");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          assert.equal(res.body.open, true);
          done();
        });
    });

    test("Missing required fields", function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          created_by: 'Someone'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'Missing required fields');
          done();
        })
    });
  });

  suite("PUT /api/issues/{project} => text", function() {
    test("No body", function(done) {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({
          _id: _ida
        })
        .end((err, res) => {
        //  console.log(_ida);
          assert.equal(res.status, 200);
          assert.equal(res.text, 'No updated field sent');
          done();
        })
    });

    test("One field to update", function(done) {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({
          _id: _ida,
          issue_text: 'will fixit soon'
        })
        .end((err, res) => {
        //  console.log(res.text);
          if(err) console.log(err);
          else if (res) {
           // console.log('Res is defined. res.text: ' + res.text);
            assert.equal(res.status, 200);
            assert.equal(res.text, 'successfully updated');
            done();
          }
          else console.log('Res is undefined');
        })
    });

    test("Multiple fields to update", function(done) {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({
          _id: _ida,
          issue_text: 'Theres still an issue',
          assigned_to: 'Your Mom'
        })
        .end((err, res)=>{
     //     console.log(res.text);
          assert.equal(res.status, 200);
          assert.equal(res.text, 'successfully updated');
          done();
        })
    });
  });

  suite(
    "GET /api/issues/{project} => Array of objects with issue data",
    function() {
      test("No filter", function(done) {
        chai
          .request(server)
          .get("/api/issues/test")
          .query({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], "issue_title");
            assert.property(res.body[0], "issue_text");
            assert.property(res.body[0], "created_on");
            assert.property(res.body[0], "updated_on");
            assert.property(res.body[0], "created_by");
            assert.property(res.body[0], "assigned_to");
            assert.property(res.body[0], "open");
            assert.property(res.body[0], "status_text");
            assert.property(res.body[0], "_id");
            done();
          });
      });

      test("One filter", function(done) {
        chai
        .request(server)
        .get('/api/issues/test')
        .query({
          assigned_to: 'Chai and Mocha'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].assigned_to, 'Chai and Mocha');
          done();
        });
      });

      test("Multiple filters (test for multiple fields you know will be in the db for a return)", function(done) {
        chai
        .request(server)
        .get('/api/issues/test')
        .query({
          issue_title: 'Title',
          assigned_to: 'Chai and Mocha'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          assert.equal(res.body[0].assigned_to, 'Chai and Mocha');
          assert.equal(res.body[0].issue_title, 'Title');
          done();
        });
      });
    }
  );

  suite("DELETE /api/issues/{project} => text", function() {
    test("No _id", function(done) {
      chai
        .request(server)
        .delete('/api/issues/test')
        .send({})
        .end((err,res)=> {
          assert.equal(res.status, 200);
          assert.equal(res.text, '_id error');
          done();
        })
    });

    test("Valid _id", function(done) {
        chai
        .request(server)
        .delete('/api/issues/test')
        .send({
              _id: _ida
            })
        .end((err,res)=> {
            console.log('ida: ' + _ida);
            assert.equal(res.status, 200);
            assert.equal(res.text, 'deleted ' + _ida);
            done();
        })
    });
  });
});
