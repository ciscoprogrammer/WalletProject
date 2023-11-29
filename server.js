const express = require('express');
const app = express();
const db = require('./config//sqlConnection'); 

app.use(express.json());

// Credit transaction endpoint
app.post('/wallet/:walletId/credit', async (req, res) => {
    const { walletId } = req.params;
    const { amount } = req.body;

    if (amount <= 0) {
        return res.status(400).send('Amount must be greater than zero');
    }

    try {
        const pool = await db.getConnection();
        await pool.request()
            .input('walletId', db.sql.Int, walletId)
            .input('amount', db.sql.Decimal(10, 2), amount)
            .query('UPDATE Wallets SET Balance = Balance + @amount WHERE WalletId = @walletId');

        await pool.request()
            .input('walletId', db.sql.Int, walletId)
            .input('type', db.sql.VarChar, 'CREDIT')
            .input('amount', db.sql.Decimal(10, 2), amount)
            .query("INSERT INTO Transactions (WalletId, Type, Amount, Status) VALUES (@walletId, @type, @amount, 'Active')");

        res.json({ message: 'Amount credited successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Debit transaction endpoint
app.post('/wallet/:walletId/debit', async (req, res) => {
    const { walletId } = req.params;
    const { amount } = req.body;

    if (amount <= 0) {
        return res.status(400).send('Amount must be greater than zero');
    }

    try {
        const pool = await db.getConnection();
        const { recordset } = await pool.request()
            .input('walletId', db.sql.Int, walletId)
            .query('SELECT Balance FROM Wallets WHERE WalletId = @walletId');

        const currentBalance = recordset[0].Balance;
        if (currentBalance < amount) {
            return res.status(400).send('Insufficient balance');
        }

        await pool.request()
            .input('walletId', db.sql.Int, walletId)
            .input('amount', db.sql.Decimal(10, 2), amount)
            .query('UPDATE Wallets SET Balance = Balance - @amount WHERE WalletId = @walletId');

        await pool.request()
            .input('walletId', db.sql.Int, walletId)
            .input('type', db.sql.VarChar, 'DEBIT')
            .input('amount', db.sql.Decimal(10, 2), amount)
            .query("INSERT INTO Transactions (WalletId, Type, Amount, Status) VALUES (@walletId, @type, @amount, 'Active')");

        res.json({ message: 'Amount debited successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Transaction cancellation endpoint
app.delete('/wallet/:walletId/transaction/:transactionId', async (req, res) => {
    const { walletId, transactionId } = req.params;

    try {
        const pool = await db.getConnection();
        const { recordset } = await pool.request()
            .input('walletId', db.sql.Int, walletId)
            .input('transactionId', db.sql.Int, transactionId)
            .query('SELECT Type, Amount, Status FROM Transactions WHERE TransactionId = @transactionId AND WalletId = @walletId');

        if (recordset.length === 0) {
            return res.status(404).send('Transaction not found');
        }

        const { Type, Amount, Status } = recordset[0];
        if (Status !== 'Active') {
            return res.status(400).send('Transaction is not active');
        }

        // Revert the transaction
        const updateBalanceQuery = Type === 'CREDIT' ? 
            'UPDATE Wallets SET Balance = Balance - @amount WHERE WalletId = @walletId' :
            'UPDATE Wallets SET Balance = Balance + @amount WHERE WalletId = @walletId';

        await pool.request()
            .input('walletId', db.sql.Int, walletId)
            .input('amount', db.sql.Decimal(10, 2), Amount)
            .query(updateBalanceQuery);

        // Update transaction status
        await pool.request()
            .input('transactionId', db.sql.Int, transactionId)
            .query('UPDATE Transactions SET Status = \'Cancelled\' WHERE TransactionId = @transactionId');

        res.json({ message: 'Transaction cancelled successfully' });
    } catch (err) {
        console.error(err);
       
        //console.error(err);
        res.status(500).send('Server error');
    }
});

// Fetching current balance endpoint
app.get('/wallet/:walletId/balance', async (req, res) => {
    const { walletId } = req.params;

    try {
        const pool = await db.getConnection();
        const { recordset } = await pool.request()
            .input('walletId', db.sql.Int, walletId)
            .query('SELECT Balance FROM Wallets WHERE WalletId = @walletId');

        if (recordset.length === 0) {
            return res.status(404).send('Wallet not found');
        }

        res.json({ balance: recordset[0].Balance });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Fetching transaction history (passbook) endpoint
app.get('/wallet/:walletId/passbook', async (req, res) => {
    const { walletId } = req.params;

    try {
        const pool = await db.getConnection();
        const { recordset } = await pool.request()
            .input('walletId', db.sql.Int, walletId)
            .query('SELECT * FROM Transactions WHERE WalletId = @walletId');

        res.json({ transactions: recordset });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
