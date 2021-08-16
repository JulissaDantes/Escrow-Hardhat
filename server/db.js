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
          console.log('find',contractsCollections.find(  { address: contract} ));
          const result = await contractsCollections.updateMany({ address : contract}, { $set: { status : true}});
          console.log('status result',result);
        }else{
          value = parseInt(value.hex.toString(16),16);
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
  function createpastHTML(buttonId, arbiter, beneficiary, value) {
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
          <div class="complete" id="${buttonId}">
            ✓ It's been approved!
          </div>
        </ul>
      </div>
    `;
  }
  async function historicHTML(){
    let contracts;
    let html;
    //pull all data
    try{
        await client.connect();        
        const database = await client.db('ApprovedContracts');        
        const contractsCollections = database.collection("contract");  
        const cursor = await contractsCollections.find({}).toArray();//array of json docs
      
        cursor.forEach( (contractItem)=>{
              html += createpastHTML(contractItem._id.toHexString(), contractItem.arbiter, contractItem.beneficiary, contractItem.value)
            }
        );
    }catch(err){
        console.log('Something went wrong', err)
    }finally{
        await client.close();
    }
      return {html:html};
  }

  module.exports = { persistData,historicHTML };