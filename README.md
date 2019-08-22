# Affogato Core
Affogato's Core Smart Contract functions as a Data and Reputation Layer, used for building a Coffee Economy on Ethereum

[![Build Status](https://travis-ci.com/crisgarner/affogato.svg?token=iyjjdAsC583CYX8hJTmX&branch=master)](https://travis-ci.com/crisgarner/affogato)

## Getting Started

Clone the project on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need truffle, ganache in order to run the project. 

```
npm install -g truffle
npm install -g ganache-cli
git clone git@github.com:AffogatoNetwork/Core.git
cd core
npm install
```

### Installing and Testing

Run ganache application or the cli in order to start testing

```
ganache-cli
```

Compile the project

```
truffle compile 
```

Affogato uses Chai as an assertion library

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
