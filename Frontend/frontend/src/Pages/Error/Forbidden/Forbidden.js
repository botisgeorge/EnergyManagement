import React from 'react';

function VideoPlayer() {
  return (
    <div>
      <h1>This area is restricted</h1>
      <video width="340" height="620" autoPlay muted>
        <source src="naughty.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoPlayer;
