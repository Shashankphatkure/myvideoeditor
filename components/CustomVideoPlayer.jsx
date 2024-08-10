import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";

const CustomVideoPlayer = ({
  currentVideo,
  timelineItems,
  currentTime,
  onProgress,
  onDuration,
}) => {
  const playerRef = useRef(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(currentTime, "seconds");
    }
  }, [currentTime]);

  const getCurrentItem = () => {
    let totalDuration = 0;
    for (let item of timelineItems) {
      if (
        currentTime >= totalDuration &&
        currentTime < totalDuration + (item.trimEnd - item.trimStart)
      ) {
        return item;
      }
      totalDuration += item.trimEnd - item.trimStart;
    }
    return null;
  };

  const applyVideoEffect = (video) => {
    const currentItem = getCurrentItem();
    if (currentItem && currentItem.effect) {
      switch (currentItem.effect) {
        case "grayscale":
          video.style.filter = "grayscale(100%)";
          break;
        case "sepia":
          video.style.filter = "sepia(100%)";
          break;
        case "invert":
          video.style.filter = "invert(100%)";
          break;
        case "blur":
          video.style.filter = "blur(5px)";
          break;
        default:
          video.style.filter = "none";
      }
    } else {
      video.style.filter = "none";
    }
  };

  const applyAudioEffects = () => {
    const currentItem = getCurrentItem();
    if (currentItem) {
      setVolume(currentItem.volume || 1);
      // Note: Fade effects would require more complex audio processing
      // which is not easily achievable with ReactPlayer alone
    } else {
      setVolume(1);
    }
  };

  useEffect(() => {
    const video = playerRef.current?.getInternalPlayer();
    if (video) {
      applyVideoEffect(video);
    }
    applyAudioEffects();
  }, [currentTime, timelineItems]);

  return (
    <ReactPlayer
      ref={playerRef}
      url={currentVideo}
      width="100%"
      height="100%"
      playing={true}
      controls={true}
      playbackRate={playbackRate}
      volume={volume}
      onProgress={onProgress}
      onDuration={onDuration}
      config={{
        file: {
          attributes: {
            crossOrigin: "anonymous",
          },
        },
      }}
    />
  );
};

export default CustomVideoPlayer;
