const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
//const data = require('./data') old way
const userRoutes = require('./routes/userroutes')

app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(express.static(path.join(__dirname, 'static')))


app.use('/', userRoutes)


app.listen(3000, function(){
  console.log("App running on port 3000")
})