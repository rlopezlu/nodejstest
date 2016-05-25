var express = require('express');
var router = express.Router();

var mongodb = require('mongodb');
//save where mongodb database is
var url = 'mongodb://localhost:27017/mySite';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express sample site', appName:'myNodeSite'});
});

router.get('/theList', function(req, res){
	var MongoClient = mongodb.MongoClient;

	MongoClient.connect(url, function(err, db){
		if(err){
			console.log("unable to connect to the server", err);
		} else {
			console.log("connected");

			var collection = db.collection('students');
			//return everything, this is a blank query
			collection.find({}).toArray(function(err, result){
				if(err){
					res.send(err);
				} else if(result.length){
					res.render('studentlist',{
						"studentlist": result
					});
				} else{
					res.send("No documents found");
				}

				db.close();
			});
		}
	});
});

router.get('/newstudent', function(req, res){
	res.render('newstudent', {title: 'Add new student'})
});


router.post('/delete', function(req, res){
  var MongoClient = mongodb.MongoClient;

  MongoClient.connect(url, function(err, db){
    if(err){
      console.log("unable to connect to db: ", err);
    } else{
      console.log('connected to mongodb');

      var collection = db.collection('students');
      var item = {street :""};
      collection.deleteMany(item, function(err, results){
        if(err){
          console.log("error deleting: ", err);
        } else{
          console.log(results.deletedCount);
          console.log(results.result);
          res.redirect("/thelist")
        }
        db.close();
      });
    }
  });
});

router.post('/addstudent', function(req, res){
  
  if(req.body.student == 0){
            res.redirect("newstudent");
    }
    // Get a Mongo client to work with the Mongo server
    var MongoClient = mongodb.MongoClient;
 
    // Connect to the server
    MongoClient.connect(url, function(err, db){
      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else {
        console.log('Connected to Server');
 
        // Get the documents collection
        //the following two lines are the same
        var collection = db.collection('students');
        //var collection = db.students;
 
       //  //test of array submission
       //  var testSubmit = {
       //    test : [{name:"raul"}, {}, {name: "bobby"}]
       //  };
       // collection.insert([testSubmit], function(err, result){
       //  if(err){
       //    console.log(err);
       //  } else{
       //    console.log('the thing was saved');
       //  }
       // });


        // Get the student data passed from the form
        var student1 = {student: req.body.student, street: req.body.street,
          city: req.body.city, state: req.body.state, sex: req.body.sex,
          gpa: req.body.gpa, array: [1,2,3]};

        console.log(student1);

        // Insert the student data into the database
        collection.insert([student1], function (err, result){
          if (err) {
            console.log(err);
          } else {
            // Redirect to the updated student list
            res.redirect("thelist");
          }
          // Close the database
          db.close();
        });
      }
    });
  });

module.exports = router;
