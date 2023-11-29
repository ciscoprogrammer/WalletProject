USE WalletProjectDB;

CREATE TABLE Wallets (
    WalletId INT PRIMARY KEY IDENTITY,
    Balance DECIMAL(12, 2) NOT NULL,
    WalletType NVARCHAR(50)
);

CREATE TABLE Transactions (
    TransactionId INT PRIMARY KEY IDENTITY,
    WalletId INT NOT NULL FOREIGN KEY REFERENCES Wallets(WalletId),
    Type NVARCHAR(10) CHECK (Type IN ('CREDIT', 'DEBIT')),
    Amount DECIMAL(10, 2) CHECK (Amount > 0),
    Timestamp DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(50) CHECK (Status IN ('Active', 'Cancelled'))
);



