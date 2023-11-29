# WalletProject


The Wallet Project is a Node.js backend application designed to manage financial transactions within a virtual wallet system. It provides functionality to credit and debit amounts, cancel transactions, and view current balance and transaction history.



## Features

- Credit and debit operations to a wallet.
- Cancellation of credit/debit transactions.
- Viewing the current balance of a wallet.
- Accessing the passbook (transaction history) of a wallet.


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.


### Prerequisites

Things you need to install  and how to install them:

- Node.js
- SQL Server
- Git

- 

### Installing

## A step-by-step series of examples that tell you how to get a development environment running:


1.Clone the repository:

git clone https://github.com/ciscoprogrammer/WalletProject.git




2.Navigate to the project directory:


cd   WalletProject




3.Install dependencies:

npm install


Set up the database by running the SQL script found in ./sq//setup.sql


4.Start the server:

node server.js
.

### API Endpoints

  POST /wallet/:walletId/credit - Credit amount to wallet.

  POST /wallet/:walletId/debit - Debit amount from wallet.

  DELETE /wallet/:walletId/transaction/:transactionId - Cancel a specific transaction.

  GET /wallet/:walletId/balance - Get the current balance of the wallet.

  GET /wallet/:walletId/passbook - Get the transaction history of the wallet.
  


## Built With

  Node.js - The runtime server environment.

  Express - Web framework for Node.js.

  MSSQL - SQL driver for Node.js.



## License

This project is licensed under the MIT License:
