const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "mydb",
    password: "newpassword123",  // your password
    port: 5432,
});

module.exports = pool;
