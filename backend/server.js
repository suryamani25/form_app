import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql2';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: 'password', 
  database: 'form_app', 
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

// POST endpoint to handle form submission
app.post('/submit', (req, res) => {
  const { name, email, phone, address, role } = req.body;

  // Validate input (you can add more validation here)
  if (!name || !email || !phone || !address || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = 'INSERT INTO users (name, email, phone, address, role) VALUES (?, ?, ?, ?, ?)';
  
  db.execute(query, [name, email, phone, address, role], (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      return res.status(500).json({ message: 'Error submitting data to the database.' });
    }

    // Return success message
    res.status(200).json({ message: 'User data submitted successfully!' });
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
