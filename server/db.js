const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..','.env') });
const {MongoClient} = require('mongodb');

const uri = process.env.DB_URI;
console.log('\n\n rui \n\n:', uri);
const client = new MongoClient(uri);
console.log("path", path.join(__dirname, '..','.env'));

export default async function persistData(id, contract, arbiter, beneficiary, value, status) {  
    
    try{
        await client.connect();
        const database = await client.db('ApprovedContracts');
        const contractsCollections = database.collection("contract");
        // create a document to be inserted
        const doc = { address: contract.address, arbiter: arbiter, beneficiary: beneficiary, value: value, status:status};
        const result = await contractsCollections.insertOne(doc);
        
    }catch(err){
        console.log('Somthing went wrong', err)
    }finally{
        await client.close();
    }
 }


