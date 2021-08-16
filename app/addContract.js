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
  .then((response) => response.json()) //2
  .then((response) => {
    buttonId = response.result.buttonId;
    container.innerHTML += response.result.html;
    console.log('response ',response); //3
  });
 
  contract.on('Approved', () => {
    document.getElementById(buttonId).className = "complete";
    document.getElementById(buttonId).innerText = "✓ It's been approved!";
    //send /approve and buttingid
  });


  document.getElementById(buttonId).addEventListener("click", async () => {
    const signer = provider.getSigner();
    await contract.connect(signer).approve();
  });
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
