import { Component, OnInit} from '@angular/core';
import { CustomValidators } from 'ng2-validation';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Web3Service} from '../../util/web3.service';
import { MatSnackBar } from '@angular/material';

declare let require: any;
const affogatonetwork_artifacts = require('../../../../build/contracts/AffogatoNetwork.json');

@Component({
  selector: 'app-meta-sender',
  templateUrl: './meta-sender.component.html',
  styleUrls: ['./meta-sender.component.css']
})
export class MetaSenderComponent implements OnInit {
  accounts: string[];
  AffogatoNetwork: any;
  showqrfarm: boolean = false;
  showqrcoffe: boolean = false;

  model = {
    auditCode: 'number',
    cuppingFinalNote: 'number',
    producerName: 'string',
    farmName:'string',
    village:'string',
    municipality:'string',
    department:'string',
    country:'string',
    batchSize:'string',
    altitude:'number',
    process:'string',
    variety:'string',
    balance: 0,
    account: ''
    };


  farms = [
   {value: 'el carmen', viewValue: 'El Carmen'},
   {value: 'del angus', viewValue: 'Del Angus'},
   {value: 'el quetzal', viewValue: 'El Quetzal'}
];

  status = '';

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {
    console.log('Constructor: ' + web3Service);
  }

  ngOnInit(): void {
    console.log('OnInit: ' + this.web3Service);
    this.watchAccount();
    this.web3Service.artifactsToContract(affogatonetwork_artifacts)
      .then((AffogatoNetworkAbstraction) => {
       this.AffogatoNetwork = AffogatoNetworkAbstraction;
     });
 }

  watchAccount() {
  this.web3Service.accountsObservable.subscribe((accounts) => {
    this.accounts = accounts;
    this.model.account = accounts[0];
  });
}

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 3000});
  }

async addFarm(){
  if (!this.AffogatoNetwork) {
  this.setStatus('AffogatoNetwork is not loaded, unable to send transaction');
  return;
}

  const producerName = this.model.producerName;
  const farmName = this.model.farmName;
  const village = this.model.village;
  const municipality = this.model.municipality;
  const department = this.model.department;
  const country = this.model.country;

  console.log('set data' + producerName + 'and' + farmName + 'and' + village +'and' + municipality + 'and' + department + 'and' + country);

this.setStatus('Initiating transaction... (please wait)');
try {
  const deployedAffogatoNetwork = await this.AffogatoNetwork.deployed();
  const transaction = await deployedAffogatoNetwork.addFarm.sendTransaction(producerName, farmName, village, municipality, department, country, {from: this.model.account});

  if (!transaction) {
    this.setStatus('Transaction failed!');
  } else {
    this.setStatus('Transaction complete!');
  }
} catch (e) {
  console.log(e);
  this.setStatus('Error sending info; see log.');
}
}

  async addCoffeeBatch() {
    const auditCode = this.model.auditCode;
    const cuppingFinalNote = this.model.cuppingFinalNote;
    const batchSize = this.model.batchSize;
    const altitude = this.model.altitude;
    const process = this.model.process;
    const variety = this.model.variety;
  }

  setCode(e){
    this.model.auditCode = e.target.value;
    console.log('Setting amount: ' + e.target.value);
  }
  setNote(e){
    this.model.cuppingFinalNote = e.target.value;
  }
  setSize(e){
    this.model.batchSize = e.target.value;
  }
  setAltitude(e){
    this.model.altitude = e.target.value;
  }
  setProces(e){
    this.model.process = e.target.value;
  }
  setVariety(e){
    this.model.variety = e.target.value;
  }

  setProducer(e){
    this.model.producerName = e.target.value;
  }

  setFarmN(e){
    this.model.farmName = e.target.value;
  }

  setVillage(e){
    this.model.village = e.target.value;
  }

  setMuni(e){
    this.model.municipality = e.target.value;
  }
  setDepart(e){
    this.model.department = e.target.value;
  }
  setCountry(e){
    this.model.country = e.target.value;
  }


}
