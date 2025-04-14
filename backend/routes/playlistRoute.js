const express = require('express');
const router = express.Router();
const db = require('../db'); // your MySQL db connection

// Get all playlists (fetching from 'playlist' table)
router.get('/playlists', (req, res) => {
  db.query('SELECT Playlist_name FROM playlist', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Get songs in a playlist
router.get('/playlists/:name', (req, res) => {
  const name = req.params.name;
  db.query(
    'SELECT Song_name FROM playlistsummary WHERE Playlist_name = ?',
    [name],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// Add song to playlist
router.post('/playlists/add', (req, res) => {
    console.log('Hit the /api/playlists/add route!'); // Added log
    console.log('Request body:', req.body); // Added log
    const { playlist, song } = req.body;
    console.log('Playlist name:', playlist, 'Song name:', song); // Added log
    db.query(
      'INSERT INTO playlistsummary (Playlist_name, Song_name, Total_Songs) VALUES (?, ?, 1)',
      [playlist, song],
      (err) => {
        console.log('Inside db.query callback'); // Added log
        if (err) {
          console.error('Error adding song to playlist:', err);
          return res.status(500).json({ error: err });
        }
        res.json({ message: 'Song added to playlist' });
      }
    );
  });
// Delete song from playlist
router.post('/playlists/delete', (req, res) => {
  const { playlist, song } = req.body;
  db.query(
    'DELETE FROM playlistsummary WHERE Playlist_name = ? AND Song_name = ?',
    [playlist, song],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Song removed from playlist' });
    }
  );
});

router.post('/test-save', (req, res) => {
  res.json({ message: 'Test save route hit!' });
});

// ✅ Create a new playlist
router.post('/playlists/save', (req, res) => {
  const { userId, playlistName } = req.body;

  // Insert the new playlist into the playlist table
  const query = 'INSERT INTO playlist (Playlist_name) VALUES (?)';
  db.query(query, [playlistName], (err, results) => {
    if (err) {
      console.error('Error creating new playlist:', err);
      return res.status(500).json({ error: 'Failed to create new playlist' });
    }
    res.status(201).json({ message: 'New playlist created successfully!' });
  });
});

module.exports = router;