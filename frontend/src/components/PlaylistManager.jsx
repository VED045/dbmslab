import React, { useEffect, useState } from 'react';
import './playlist.css';
import SaveToLibrary from './saveToPlaylist'; // Adjust path if needed

const PlaylistManager = () => {
    const userId = localStorage.getItem('userId');
    const [songs, setSongs] = useState([]);
    const [backendPlaylists, setBackendPlaylists] = useState([]); // State to hold playlists from the backend
    const [selectedPlaylist, setSelectedPlaylist] = useState(''); // Initialize with an empty string
    const [newPlaylist, setNewPlaylist] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPlaylistSongs, setCurrentPlaylistSongs] = useState([]); // To store songs of the selected playlist
    const [artistFilter, setArtistFilter] = useState(''); // State to store the selected artist for filtering

    // Fetch all songs
    useEffect(() => {
        fetch('http://localhost:3000/songs')
            .then(res => res.json())
            .then(data => setSongs(data));
    }, []);

    // Fetch playlists from the backend
    useEffect(() => {
        fetch('http://localhost:3000/api/playlists')
            .then(res => res.json())
            .then(data => {
                setBackendPlaylists(data);
                // Set the initial selected playlist to the first one if available
                if (data.length > 0) {
                    setSelectedPlaylist(data[0].Playlist_name);
                }
            });
    }, []); // Empty dependency array means this runs once after the initial render

    // Function to fetch songs for the selected playlist
    const fetchSongsForPlaylist = (playlistName) => {
        if (playlistName) {
            fetch(`http://localhost:3000/api/playlists/${playlistName}`)
                .then(res => res.json())
                .then(data => setCurrentPlaylistSongs(data));
        } else {
            setCurrentPlaylistSongs([]);
        }
    };

    // Update currentPlaylistSongs when selectedPlaylist changes
    useEffect(() => {
        fetchSongsForPlaylist(selectedPlaylist);
    }, [selectedPlaylist]);

    const addToPlaylist = (song) => {
        // This function now needs to call the backend to add the song to the selected playlist
        fetch('http://localhost:3000/api/playlists/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playlist: selectedPlaylist, song: song.Song_name }),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.message); // Song added successfully
                fetchSongsForPlaylist(selectedPlaylist); // Refresh the song list
            });
    };

    const removeFromPlaylist = (song) => {
        // This function now needs to call the backend to remove the song from the selected playlist
        fetch('http://localhost:3000/api/playlists/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playlist: selectedPlaylist, song: song.Song_name }),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.message); // Song removed successfully
                fetchSongsForPlaylist(selectedPlaylist); // Refresh the song list
            });
    };

    const handleNewPlaylist = () => {
        if (newPlaylist.trim()) {
            // Call the backend to create the new playlist
            fetch('http://localhost:3000/api/playlists/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, playlistName: newPlaylist }),
            })
                .then(res => res.json())
                .then(data => {
                    alert(data.message); // New playlist created successfully!
                    // After creating, fetch the updated list of playlists
                    fetch('http://localhost:3000/api/playlists')
                        .then(res => res.json())
                        .then(updatedPlaylists => {
                            setBackendPlaylists(updatedPlaylists);
                            setSelectedPlaylist(newPlaylist); // Select the newly created playlist
                        });
                    setNewPlaylist('');
                });
        }
    };

    const handleArtistClick = (artistName) => {
        setArtistFilter(artistName);
    };

    const clearArtistFilter = () => {
        setArtistFilter('');
    };

    const filteredSongs = songs.filter(song => {
        const searchMatch = song.Song_name.toLowerCase().includes(searchTerm.toLowerCase());
        const artistMatch = artistFilter ? song.Artist_name === artistFilter : true;
        return searchMatch && artistMatch;
    });

    return (
        <div className="playlist-wrapper">
            <h1>🎵 Playlist Manager</h1>

            <div className="playlist-controls">
                <select value={selectedPlaylist} onChange={(e) => setSelectedPlaylist(e.target.value)}>
                    {backendPlaylists.map((playlist, idx) => (
                        <option key={idx} value={playlist.Playlist_name}>{playlist.Playlist_name}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="New playlist name"
                    value={newPlaylist}
                    onChange={(e) => setNewPlaylist(e.target.value)}
                />
                <button onClick={handleNewPlaylist}>➕ Add Playlist</button>
            </div>

            <input
                type="text"
                className="search-input"
                placeholder="🔍 Search songs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="songs-section">
                <div className="song-list">
                    <h2>All Songs</h2>
                    {artistFilter && (
                        <div style={{ marginBottom: '10px' }}>
                            Filtering by artist: <strong>{artistFilter}</strong> <button onClick={clearArtistFilter}>Show All</button>
                        </div>
                    )}
                    {filteredSongs.map((song, idx) => (
                        <div key={idx} className="song-card">
                            <span>{song.Song_name} - </span>
                            <span
                                className="artist"
                                style={{ cursor: 'pointer', color: '#60A5FA' }}
                                onClick={() => handleArtistClick(song.Artist_name)}
                            >
                                {song.Artist_name}
                            </span>
                            <button onClick={() => addToPlaylist(song)}>Add ➕</button>
                        </div>
                    ))}
                </div>

                <div className="playlist-view">
                    <h2>{selectedPlaylist}</h2>
                    {currentPlaylistSongs.map((song, idx) => (
                        <div key={idx} className="song-card">
                            <span>{song.Song_name} - {song.Artist_name}</span>
                            <button onClick={() => removeFromPlaylist(song)}>Remove ❌</button>
                        </div>
                    ))}

                    {currentPlaylistSongs.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                            {/* The SaveToLibrary component now creates a new playlist, so its purpose might need to be renamed or re-evaluated */}
                            {/* <SaveToLibrary userId={userId} playlistName={selectedPlaylist} /> */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlaylistManager;