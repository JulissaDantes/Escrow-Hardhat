const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..','.env') });
const {MongoClient} = require('mongodb');

const uri = process.env.DB_URI;
const client = new MongoClient(uri);

async function persistData(contract, arbiter, beneficiary, value, status) {  
    let buttonId;
    let html;
    const interface = [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_arbiter",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "_beneficiary",
            "type": "address"
          }
        ],
        "stateMutability": "payable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "Approved",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "arbiter",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "beneficiary",
        "outputs": [
          {
            "internalType": "address payable",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "depositor",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "isApproved",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    try{
        await client.connect();        
        const database = await client.db('ApprovedContracts');        
        const contractsCollections = database.collection("contract");        
        // create a document to be inserted
        if(status){
          //filter by contract
          const result = await contractsCollections.updateMany({ address : contract}, { $set: { status : true}});
          console.log('status result',result);
        }else{
          value = parseInt(value.hex.toString(16),16);
          const doc = { address: contract, abi:interface , arbiter: arbiter, beneficiary: beneficiary, value: value, status:status};
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

    let html = ``;
    let buttodId = []
    //pull all data
    try{
        await client.connect();        
        const database = await client.db('ApprovedContracts');        
        const contractsCollections = database.collection("contract");  
        const cursor = await contractsCollections.find({}).toArray();//array of json docs
      
        cursor.forEach( (contractItem)=>{
            if(contractItem.status){
              html += createpastHTML(contractItem._id.toHexString(), contractItem.arbiter, contractItem.beneficiary, contractItem.value)
            }else{
              html += createHTML(contractItem._id.toHexString(), contractItem.arbiter, contractItem.beneficiary, contractItem.value)
              buttodId.push({id:contractItem._id.toHexString(), contract: contractItem.address, interface: contractItem.abi})
            }            
          }
        );
    }catch(err){
        console.log('Something went wrong', err)
    }finally{
        await client.close();
    }
      return {html:html, buttonIds: buttodId};
  }
  
  module.exports = { persistData,historicHTML };