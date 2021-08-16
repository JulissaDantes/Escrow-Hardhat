import {ethers} from 'ethers';
import deploy from './deploy';
import addContract from './addContract';
import "./index.scss";

let contracts = 0;
async function newContract() {

  const beneficiary = document.getElementById("beneficiary").value;
  const arbiter = document.getElementById("arbiter").value;
  const unit = document.getElementById("ddlamount").value;
  
  let value = ethers.BigNumber.from(document.getElementById("wei").value);
  if(unit !== "wei"){    
    value = ethers.utils.parseUnits(value.toString(), unit);
  }
  
  const contract = await deploy(arbiter, beneficiary, value);
  addContract(++contracts, contract, arbiter, beneficiary, value);
}

document.getElementById("deploy").addEventListener("click", newContract);
