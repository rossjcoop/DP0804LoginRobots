const express = require('express')
const router = express.Router()
const userModel = require ('../models/userModel')




router.get("/", function(req, res, next){
	userModel.getAllUsers(function(data){
	res.render("index", {users: data})
	})
})


router.get("/unemployed", function(req, res, next){
	userModel.getUnemployedUsers(function(data){
	res.render("unemployed", {users: data})
	})
})


router.get("/user/:username", function(req, res, next){
	userModel.getUserByUsername(req.params.username, function(data){	
	res.render("user", {user: data})	
	})

	
})

module.exports = router