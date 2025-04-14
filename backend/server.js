const express = require('express');
const cors = require('cors');
const db = require('./db');
const playlistRoutes = require('./routes/playlistRoute');
const authRoutes = require('./routes/authRoutes'); // Adjust the path if necessary
const app = express();

// ✅ Apply CORS before routes
app.use(cors({
  origin: 'http://localhost:5173', // allow your frontend port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ✅ Routes come after CORS middleware
app.use('/api', playlistRoutes);
app.use('/api', authRoutes); // Or app.use('/auth', authRoutes);
// Song route
app.get('/songs', (req, res) => {
  const query = `
    SELECT Song.Song_name, Artist.Artist_name, 
           Song.Genre, Song.Duration, Song.Released_date
    FROM Song
    JOIN Artist ON Song.Artist_id = Artist.Artist_id;
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching songs:", err);
      return res.status(500).json({ error: "Failed to fetch songs" });
    }
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000 🎵');
});
