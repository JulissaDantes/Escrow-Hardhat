require('dotenv').config();
const fs = require('fs');

/*const uri = process.env.DB_URI;
const client = new MongoClient(uri);*/

export default async function persistData(id, contract, arbiter, beneficiary, value, status) {
  
    try{
        /*await client.connect();
        const database = await client.db('ApprovedContracts');
        const contractsCollections = database.collection("contract");
                // create a document to be inserted
        const doc = { id:id, address: contract.address, arbiter: arbiter, beneficiary: beneficiary, value: value, status:status};
        console.log('doc',doc);
        const result = await contractsCollections.insertOne(doc);
        console.log('insert result',result);
        */
        fs.writeFileSync('./data/approved.json', JSON.stringify({address: contract.address, arbiter: arbiter, beneficiary: beneficiary, value: value}), function() {
            fs.readFile('./data/approved.json', 'utf-8', function(err, data) {
                console.log('full dtaa:',data);
            });
        });

    }catch(err){
        console.log('Somthing went wrong', err)
    }finally{
        await client.close();
    }

  }