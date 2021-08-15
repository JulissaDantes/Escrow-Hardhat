const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const port = 3000;

// We are using our packages here
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 extended: true})); 
app.use(cors())

//You can use this to check if your server is working
app.get('/', (req, res)=>{
    res.send("Welcome to your server")
})

app.post('/deploy', (req, res) =>{
    //add to db
    console.log(req.body) 
})

app.post('/approve', (req, res) =>{
    //update db
    console.log(req.body) 
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})