// Add to your existing routes

// Add song to playlist
router.post('/playlist/add', async (req, res) => {
    const { playlistName, songName } = req.body;
    try {
      await db.execute('INSERT INTO playlistsummary (Playlist_name, Song_name) VALUES (?, ?)', [playlistName, songName]);
      res.json({ success: true, message: 'Song added to playlist.' });
    } catch (err) {
      console.error('Error adding song to playlist:', err);
      res.status(500).json({ success: false, message: 'Failed to add song.' });
    }
  });
  
  // Delete song from playlist
  router.post('/playlist/delete', async (req, res) => {
    const { playlistName, songName } = req.body;
    try {
      await db.execute('DELETE FROM playlistsummary WHERE Playlist_name = ? AND Song_name = ?', [playlistName, songName]);
      res.json({ success: true, message: 'Song removed from playlist.' });
    } catch (err) {
      console.error('Error deleting song from playlist:', err);
      res.status(500).json({ success: false, message: 'Failed to delete song.' });
    }
  });
  
  // Get playlist songs
  router.get('/playlist/:name', async (req, res) => {
    const playlistName = req.params.name;
    try {
      const [songs] = await db.execute('SELECT Song_name FROM playlistsummary WHERE Playlist_name = ?', [playlistName]);
      res.json(songs);
    } catch (err) {
      console.error('Error fetching playlist:', err);
      res.status(500).json({ error: 'Error fetching playlist' });
    }
  });
  