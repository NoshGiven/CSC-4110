const express = require('express');
const mysql = require('mysql');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(express.json());

// Create a connection pool to handle database connections
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root_password',
  database: process.env.DB_DATABASE || 'my_database',
});

// Store URL metadata in the database
app.post('/metadata', async (req, res) => {
  const { url } = req.body;

  try {
    // Fetch the URL and extract metadata
    const { data: html } = await axios.get(url);
    const metadata = extractMetadata(html);

    // Store the URL and metadata in the database
    const query = 'INSERT INTO url_metadata (url, metadata) VALUES (?, ?)';
    pool.query(query, [url, JSON.stringify(metadata)], (error) => {
      if (error) {
        console.error('Error storing URL metadata:', error);
        res.status(500).json({ error: 'An error occurred' });
        return;
      }

      res.json({ message: 'URL metadata stored successfully' });
    });
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).json({ error: 'An error occurred while fetching the URL' });
  }
});

// Retrieve URL metadata from the database
app.get('/metadata/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT metadata FROM url_metadata WHERE id = ?';

  pool.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error retrieving URL metadata:', error);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'URL metadata not found' });
      return;
    }

    const metadata = JSON.parse(results[0].metadata);
    res.json(metadata);
  });
});

// Extract metadata from HTML using Cheerio
function extractMetadata(html) {
  const $ = cheerio.load(html);

  // Extract relevant metadata from the HTML
  const title = $('title').text().trim();
  const description = $('meta[name="description"]').attr('content');
  const keywords = $('meta[name="keywords"]').attr('content');

  // Return the extracted metadata as an object
  return { title, description, keywords };
}

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});