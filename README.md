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

Run ganache application or the cli in order to start testing

```
ganache-cli -p 8545
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

With ganache runing just migrate the project and you will be ready.

```
truffle migrate 
``` 

## Authors

* **Cristian Espinoza** - *Initial work* - [Crisgarner](https://github.com/crisgarner)
