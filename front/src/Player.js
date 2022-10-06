import React, {useEffect, useState} from "react";

const useAudio = (url) => {
    const [audio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);
  
    const togglePlayback = () => setPlaying(!playing);
  
    useEffect(() => {
      if (playing) {
        audio.play();
      }
      else {
        audio.pause();
      }
    }, [playing]);
  
    useEffect(() => {
      audio.addEventListener('ended', () => setPlaying(false));
      return () => {
        audio.removeEventListener('ended', () => setPlaying(false));
      };
    }, []);
  
    return [playing, togglePlayback];
  };
  
  const AudioPlayer = ({ url }) => {
    const [playing, togglePlayback] = useAudio(url);
  
    return (
      <button onClick={togglePlayback} icon labelPosition="left">
        <img name={playing ? 'pause' : 'play'} />
        {playing ? 'Pause' : 'Play'}
      </button>
    );
  };

export default AudioPlayer;