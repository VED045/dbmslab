const express = require('express');
const router = express.Router();
const db = require('../db'); // your MySQL db connection

// Get all playlists (fetching from 'playlist' table)
// router.get('/playlists', (req, res) => {
//  db.query('SELECT Playlist_name FROM playlist', (err, results) => {
//    if (err) return res.status(500).json({ error: err });
//    res.json(results);
//  });
// });

router.get('/playlists', (req, res) => {
  db.query('SELECT * FROM playlist', (err, results) => { // Changed to SELECT *
    if (err) {
      console.error('Error fetching playlists:', err);
      return res.status(500).json({ error: err });
    }
    console.log('Playlists fetched:', results); // Added logging
    const playlistNames = results.map(row => ({ Playlist_name: row.Playlist_name }));
    res.json(playlistNames);
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
  const query = 'INSERT INTO playlist (Playlist_name, user_id) VALUES (?, ?)'; // Added user_id
  db.query(query, [playlistName, userId], (err, results) => { // Added userId to the query
    if (err) {
      console.error('Error creating new playlist:', err);
      return res.status(500).json({ error: 'Failed to create new playlist' });
    }
    res.status(201).json({ message: 'New playlist created successfully!' });
  });
});

// // INCORRECT CODE - COMMENTED OUT OR DELETE THIS BLOCK
// router.post('/playlists/save', (req, res) => {
//   const { userId, playlistName } = req.body;
//
//   const query = 'SELECT * FROM playlist LIMIT 1'; // Simple select query
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error querying playlist table:', err);
//       return res.status(500).json({ error: 'Failed to query playlist table' });
//     }
//     console.log('Successfully queried playlist table:', results);
//     res.status(200).json({ message: 'Successfully queried playlist table', results });
//   });
// });

module.exports = router;