'use client';

import { useRef, useCallback } from 'react';
import { useJukeboxStore } from '@/lib/store/jukeboxStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type YouTubePlayer = any;

export function useYouTube() {
  const playerRef = useRef<YouTubePlayer>(null);
  const { isPlaying, volume, setIsPlaying, setPlayerReady } = useJukeboxStore();

  const onReady = useCallback(
    (event: { target: YouTubePlayer }) => {
      playerRef.current = event.target;
      event.target.setVolume(volume);
      setPlayerReady(true);
    },
    [volume, setPlayerReady]
  );

  const onStateChange = useCallback(
    (event: { data: number }) => {
      // YouTube player states: -1=unstarted, 0=ended, 1=playing, 2=paused, 3=buffering, 5=cued
      if (event.data === 1) setIsPlaying(true);
      if (event.data === 2 || event.data === 0) setIsPlaying(false);
    },
    [setIsPlaying]
  );

  const togglePlay = useCallback(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [isPlaying]);

  const setVolume = useCallback((vol: number) => {
    playerRef.current?.setVolume(vol);
  }, []);

  const loadVideo = useCallback((videoId: string) => {
    playerRef.current?.loadVideoById(videoId);
  }, []);

  const getCurrentTime = useCallback((): number => {
    return playerRef.current?.getCurrentTime?.() ?? 0;
  }, []);

  return { playerRef, onReady, onStateChange, togglePlay, setVolume, loadVideo, getCurrentTime };
}
