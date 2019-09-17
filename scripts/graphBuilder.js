
const fs = require('fs');
const path = require("path");
var shell = require('shelljs');

const argv = require('minimist')(process.argv.slice(2));

fs.readFileAsync = function(filename, enc) {
  return new Promise(function(resolve, reject) {
      fs.readFile(filename, enc, function(err, data){
          if (err) 
              reject(err); 
          else
              resolve(data);
      });
  });
};


const network = argv["network"];

if (!network){
  throw new Error("Network argument is required");
}

var Contracts = [
  "ActorFactory",
  "CertificateFactory",
  "CoffeeBatchFactory",
  "CupProfileFactory",
  "FarmFactory"
];

shell.cp('-R', path.resolve(__dirname, `../sg_affogato/subgraph_template.yaml`), path.resolve(__dirname, `../sg_affogato/subgraph.yaml`))
const mappings = Contracts.map((contract) => {
  const fileData = fs.readFileSync(path.resolve(__dirname, `../build/contracts/${contract}.json`), 'utf8');
  contractObject =  JSON.parse(fileData);
  const mapped = {name: contractObject.contractName, abi: contractObject.abi, address: contractObject.networks[network.toString()].address};  
  const replacevar = (`<${mapped.name}_address>`);
  console.log(replacevar)
  shell.sed('-i', replacevar, `'${mapped.address}'`, path.resolve(__dirname, `../sg_affogato/subgraph.yaml`));
  fs.writeFile(`${mapped.name}.abi`, JSON.stringify(mapped.abi, null, 2), 'utf8', () => {}) 

  return mapped;  
});