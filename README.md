# Affogato Network
Affogato Network Smart Contract for building a Coffee Economy on Ethereum

[![Build Status](https://travis-ci.com/crisgarner/affogato.svg?token=iyjjdAsC583CYX8hJTmX&branch=master)](https://travis-ci.com/crisgarner/affogato)

## Getting Started

Clone the project on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need truffle, ganache, HD wallet, dotenv and chain in order to run the project

```
npm install truffle-hdwallet-provider-privkey
npm install dotenv
npm install chai
npm install -g truffle
npm install -g ganache-cli
```

### Installing and Testing

Run ganache application or the cli in order to start testing with the network 1234

```
ganache-cli -i 1234
```

Compile the project

```
truffle compile 
```

End with running the tests. Affogato uses Chai as an assertion library 

```
truffle test 
```

## Deployment


### Local Testnet

With ganache runing just migrate the project with the network 1234 and you will be ready.

```
truffle migrate --network development
``` 

### Rinkeby Testnet

Create a .env file with the following values:

```
MNENOMIC="MNEMONIC KEY OF ACCOUNT WITH RINKEBY ETH"
RINKEBY_API_URL="Rinkeby api URL"
``` 

Run migration with the rinkeby network

```
truffle migrate --network rinkeby
``` 

## Authors

* **Cristian Espinoza** - *Initial work* - [Crisgarner](https://github.com/crisgarner)
