import {ethers} from 'ethers';
const server = "http://localhost:3000";

const provider = new ethers.providers.Web3Provider(ethereum);
const container = document.getElementById("container");
//Fills previous data
const initBody = JSON.stringify({});

const request = new Request(`${server}/`, { method: 'POST', initBody });
fetch(request, { headers: { 'Content-Type': 'application/json' }})
.then((response) => response.json()) 
  .then((response) => {
    let contract;
    container.innerHTML += response.result.html;
    response.result.buttonIds.forEach(element => {
      contract = new ethers.Contract(element.contract, element.interface, provider);
      document.getElementById(element.id).addEventListener("click", async () => {        
        const signer = provider.getSigner();        
        await contract.connect(signer).approve();
      });

      contract.on('Approved', () => {
        document.getElementById(element.id).className = "complete";
        document.getElementById(element.id).innerText = "✓ It's been approved!";
        
        const abody = JSON.stringify({"contract": contract.address, "arbiter": contract.arbiter, "beneficiary": contract.beneficiary, "value":contract.value, "status":true});
        
        const approveRequest = new Request(`${server}/approve`, { method: 'POST', body:abody });
        
        fetch(approveRequest, { headers: { 'Content-Type': 'application/json' }})
        .then((response) => response.json());
      });
    });
  });

export default async function addContract(id, contract, arbiter, beneficiary, value) {

  let buttonId;
console.log('new contract',contract);
  const body = JSON.stringify({
    contract: contract.address, arbiter: arbiter, beneficiary: beneficiary, value:value, status:false
  });

  const deployRequest = new Request(`${server}/deploy`, { method: 'POST', body });

  fetch(deployRequest, { headers: { 'Content-Type': 'application/json' }})
  .then((response) => response.json()) 
  .then((response) => {
    buttonId = response.result.buttonId;
    container.innerHTML += response.result.html;
    
    document.getElementById(buttonId).addEventListener("click", async () => {
      const signer = provider.getSigner();
      await contract.connect(signer).approve();
    });
  });
 
  contract.on('Approved', () => {
    document.getElementById(buttonId).className = "complete";
    document.getElementById(buttonId).innerText = "✓ It's been approved!";
      //send /approve 
      const approveRequest = new Request(`${server}/approve`, { method: 'POST', body });
      fetch(approveRequest, { headers: { 'Content-Type': 'application/json' }})
      .then((response) => response.json());
  });
}

