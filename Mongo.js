

///////EXAMPLE//////////////////////////////////



var MongoDB = require('mongodb');
var MongoClient = MongoDB.MongoClient;



var url = "mongodb://localhost:27017/linkedIn4Bots"///<You put in your database here

var datab = null
///Connect to the database server
MongoClient.connect(url, function(error, db){

	//checking for errors after trying to connect to the database server
	if (error) {
		console.log(error);
	}
	else {
		console.log("Connection Sucessful!");
	}


	datab = db


  	console.log(datab)

	//can use like in mongo

	//Run query against the users collection and turn it into an array called userDocuments
	let query = {}
	db.collection("users").find(query).toArray(function(error, userDocuments){
		if (error) {
			console.log("Error fetching the fetching users");

		}
		else {
			console.log(userDocuments)
		}

	});


	db.close();
})