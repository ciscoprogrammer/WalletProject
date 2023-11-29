const sql = require('mssql');

const config = {
  user: 'dblogin', // Your new SQL Server authentication login
  password: 'ciscoidhu', // The password for the SQL Server authentication login
  server: 'DESKTOP-8HGJDKS', // Your server name
  database: 'WalletProjectDB', // Your database name
  options: {
     
    trustServerCertificate: true, // Change to false for production
    //trustedConnection: true // Use Windows Authentication
  }
};

async function getConnection() {
  try {
      const pool = await sql.connect(config);
      return pool;
  } catch (error) {
      console.error('SQL error', error);
  }
}

module.exports = {
 getConnection,
 sql
};
