import { useCallback } from 'react';

const SOUNDS = {
  CLICK: '/sounds/click.mp3',      // Pen click
  TABS: '/sounds/tabs.mp3',        // Paper rustle (Tabs/Navigation)
  SCRIBBLE: '/sounds/scribble.mp3', // Pencil scribble (Success)
  POP: '/sounds/pop.mp3',          // Soft pop (Modals)
  CRUMBLE: '/sounds/crumble.mp3',  // Paper crumble (Delete)
  START: '/sounds/timer.mp3',      // Timer tick
};

export const useSound = () => {
  const play = useCallback((url: string, volume = 0.15) => {
    // Check localStorage for the setting (synced with App preferences)
    const soundSetting = localStorage.getItem('vellum_sound_enabled');
    if (soundSetting === 'false') return;

    const audio = new Audio(url);
    audio.volume = volume;
    audio.play().catch(() => {
    });
  }, []);

  return {
    playClick: () => play(SOUNDS.CLICK, 0.1),
    playTabs: () => play(SOUNDS.TABS, 0.2),
    playSuccess: () => play(SOUNDS.SCRIBBLE, 0.15),
    playPop: () => play(SOUNDS.POP, 0.1),
    playDelete: () => play(SOUNDS.CRUMBLE, 0.1),
    playTimer: () => play(SOUNDS.START, 0.15),
  };
};
