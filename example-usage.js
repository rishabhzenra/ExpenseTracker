const pool = require("./db");

async function setupAndInsert() {
    try {
        // 1. Create a table
        console.log("Creating 'users' table...");
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100) UNIQUE NOT NULL
            );
        `);
        console.log("✅ Table created or already exists.");

        // 2. Insert a record
        const insertQuery = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *";
        const values = ["John Doe", "john@example.com"];

        console.log("Inserting user...");
        const res = await pool.query(insertQuery, values);
        console.log("✅ User inserted:", res.rows[0]);

        // 3. Fetch all users
        console.log("Fetching all users...");
        const allUsers = await pool.query("SELECT * FROM users");
        console.table(allUsers.rows);

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await pool.end(); // Always close the pool when done
    }
}

setupAndInsert();
