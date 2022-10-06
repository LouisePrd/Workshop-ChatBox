import React, {useState} from "react";
import './Playlist.css';

const Playlist = ({ playlist, setSelectedItem, childToParent }) => {

    // const [selectedItem, setSelectedItem] = useState(null);
    // console.log(selectedItem);

    return (
        <div className='playlist'>
                {playlist.map((item, index) => (
                  <div className='playlistItem' key={index} onClick={() => {childToParent(item.track.id)}}>
                    <img className='playlistItemImg' src={item.track.album.images[0].url} alt="cd" />
                    <div className='playlistItemText'>
                      <p className='playlistItemTextp'>{item.track.name}</p>
                      <p className='playlistItemTextp'>{item.track.artists[0].name}</p>
                    </div>
                  </div>
                ))}
            </div>
    );
};

export default Playlist;