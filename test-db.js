const pool = require("./db");

async function testConnection() {
    try {
        const res = await pool.query("SELECT NOW()");
        console.log("✅ Connection Successful!");
        console.log("Current Time from DB:", res.rows[0].now);
        await pool.end(); // Close the pool after testing
    } catch (err) {
        console.error("❌ Connection Failed!");
        console.error(err.message);
        process.exit(1);
    }
}

testConnection();
