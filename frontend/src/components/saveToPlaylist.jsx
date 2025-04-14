import axios from 'axios';

const SaveToLibrary = ({ userId, playlistName }) => {
  const handleSave = async () => {
    console.log('Saving playlist with name:', playlistName); // Add this line
    try {
      const res = await axios.post('http://localhost:3000/api/playlists/save', {
        userId,
        playlistName,
      });
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert('Error saving playlist');
    }
  };
  return <button onClick={handleSave}>Save Playlist</button>;
};

export default SaveToLibrary;