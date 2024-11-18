const express = require('express');
const mysql = require('mysql2/promise'); // Use promise-based mysql2 for async/await
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MySQL Database Connection
let db;
(async () => {
  try {
    db = await mysql.createConnection({
      host: DB_HOST,       // Your MySQL server host
      user: DB_USER,            // Your MySQL username
      password: DB_PASSWORD, // Your MySQL password
      database: DB_NAME,    // Your database name
    });
    console.log('Connected to MySQL database');
  } catch (err) {
    console.error('Error connecting to MySQL database:', err.message);
    process.exit(1); // Exit if connection fails
  }
})();

// Routes
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/users', async (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    res.status(400).send('Username and email are required');
    return;
  }
  try {
    const query = 'INSERT INTO users (username, email) VALUES (?, ?)';
    const [result] = await db.execute(query, [username, email]);
    res.status(201).send({ id: result.insertId, username, email });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/users/:id', async (req, res) => {
  const { username, email } = req.body;
  const { id } = req.params;
  if (!username || !email) {
    res.status(400).send('Username and email are required');
    return;
  }
  try {
    const query = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
    await db.execute(query, [username, email, id]);
    res.send('User updated successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM users WHERE id = ?';
    await db.execute(query, [id]);
    res.send('User deleted successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start Server
app.listen(8080, () => {
  console.log('Server running on port 8080');
});
