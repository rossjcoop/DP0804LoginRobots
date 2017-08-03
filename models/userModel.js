// const data = require('../data') Old way
const MongoDB = require('mongodb')
const MongoClient = MongoDB.MongoClient

const url = "mongodb://localhost:27017/linkedIn4Bots"

let conn = null


MongoClient.connect(url, function(error, db){

	//checking for errors after trying to connect to the database server
	if (error) {
		console.log("Connection Unsuccessful!");
	}
	else {
		console.log("Connection Successful!");
		conn = db
	}

})


function getAllUsers(cb){
	conn.collection('users').find().toArray(function(err, documents){
		cb(documents)
	})
}

function getUnemployedUsers(cb){
	let query = {job: null}
	conn.collection('users').find(query).toArray(function(err, documents){
		cb(documents)
	})
}
//////////////////////////userName came along from the controller
function getUserByUsername(userName, cb){
	let query = {username: userName}
	conn.collection('users').findOne(query, function(err, obj){
		cb(obj)
	})








	// const user = data.users.filter(function(person){
	// 	return person.username === username
	// })[0]
	// return user
}

module.exports = {
	getAllUsers: getAllUsers,
	getUnemployedUsers: getUnemployedUsers,
	getUserByUsername: getUserByUsername

}