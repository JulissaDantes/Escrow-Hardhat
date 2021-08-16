const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..','.env') });
const {MongoClient} = require('mongodb');

const uri = process.env.DB_URI;
const client = new MongoClient(uri);

async function persistData(contract, arbiter, beneficiary, value, status) {  
    let buttonId;
    let html;
    try{
        
        await client.connect();        
        const database = await client.db('ApprovedContracts');        
        const contractsCollections = database.collection("contract");        
        // create a document to be inserted
        if(status){
          //filter by contract
          const result = contractsCollections.findOneAndUpdate({ "address" : contract}, { $set: { "status" : status}});
        }else{
          const doc = { address: contract, arbiter: arbiter, beneficiary: beneficiary, value: value, status:status};
          const result = await contractsCollections.insertOne(doc);        
          buttonId = result.insertedId.toHexString();            
          html =  createHTML(buttonId, arbiter, beneficiary, value);  
        }  
    }catch(err){
        console.log('Somthing went wrong', err)
    }finally{
        await client.close();
    }

    return {html:html, buttonId:buttonId}
 }

 function createHTML(buttonId, arbiter, beneficiary, value) {
    return `
      <div class="existing-contract">
        <ul className="fields">
          <li>
            <div> Arbiter </div>
            <div> ${arbiter} </div>
          </li>
          <li>
            <div> Beneficiary </div>
            <div> ${beneficiary} </div>
          </li>
          <li>
            <div> Value </div>
            <div> ${value} </div>
          </li>
          <div class="button" id="${buttonId}">
            Approve
          </div>
        </ul>
      </div>
    `;
  }

  module.exports = { persistData };