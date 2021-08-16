import {ethers} from 'ethers';
const server = "http://localhost:3000";

const provider = new ethers.providers.Web3Provider(ethereum);

export default async function addContract(id, contract, arbiter, beneficiary, value) {

  //const buttonId = `approve-${id}`;
  let buttonId;
  const container = document.getElementById("container");
  //container.innerHTML += createHTML(buttonId, arbiter, beneficiary, value);

  const body = JSON.stringify({
    contract: contract.address, arbiter: arbiter, beneficiary: beneficiary, value:value, status:false
  });

  const deployRequest = new Request(`${server}/deploy`, { method: 'POST', body });

  fetch(deployRequest, { headers: { 'Content-Type': 'application/json' }})
  .then((response) => response.json()) 
  .then((response) => {
    buttonId = response.result.buttonId;
    container.innerHTML += response.result.html;
    console.log('response button',response.result.buttonId,' and html: ',response.result.html); 
    document.getElementById(buttonId).addEventListener("click", async () => {
      const signer = provider.getSigner();
      await contract.connect(signer).approve();
    });
  });
 
  contract.on('Approved', () => {
    body[status] = true;
    document.getElementById(buttonId).className = "complete";
    document.getElementById(buttonId).innerText = "✓ It's been approved!";
    //send /approve 
    const approveRequest = new Request(`${server}/approve`, { method: 'POST', body });
    fetch(approveRequest, { headers: { 'Content-Type': 'application/json' }})
    .then((response) => response.json());
  });
  console.log('btnid before eventlistener',buttonId);
}

