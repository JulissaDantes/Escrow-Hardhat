const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db.js')
const port = 3000;

// We are using our packages here
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 extended: true})); 
app.use(cors())

//You can use this to check if your server is working
app.post('/', async (req, res)=>{
    const result = await db.historicHTML();    
    res.send({ result }); 
})

app.post('/deploy',async  (req, res) =>{
    //add to db
    const result = await db.persistData(req.body.contract,req.body.arbiter,req.body.beneficiary,req.body.value,false);    
    res.send({ result }); 
})

app.post('/approve', async (req, res) =>{
    //update db
    console.log('abody for server',req.body);
    const result = await db.persistData(req.body.contract,req.body.arbiter,req.body.beneficiary,req.body.value,true);
    res.send({ result }); 
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})