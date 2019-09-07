
const fs = require('fs');
const path = require("path");

const argv = require('minimist')(process.argv.slice(2));

const network = argv["network"];

if (!network){
  throw new Error("Network argument is required");
}
console.log(argv)
var Contracts = [
  "ActorFactory",
  "CertificateFactory",
  "CoffeeBatchFactory",
  "CupProfileFactory",
  "FarmFactory"
];

var mappings = []
mappings = Contracts.map((contract) =>{
  const contents =  fs.readFileSync(path.resolve(__dirname, `../build/contracts/${contract}.json`), 'utf8');
  contractObject =  JSON.parse(contents);
  console.log(contractObject.networks[network].address)
  return {contractName: contractObject.contractName, abi: contractObject.abi};
});