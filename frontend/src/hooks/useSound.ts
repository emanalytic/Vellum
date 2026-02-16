import { useCallback } from 'react';

const SOUNDS = {
  // Light pen click for general buttons
  CLICK: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  
  // Paper rustle/page flip for navigation
  TABS: 'https://assets.mixkit.co/active_storage/sfx/255/255-preview.mp3',
  
  // Pencil/Pen scribble for completing/adding tasks
  SCRIBBLE: 'https://assets.mixkit.co/active_storage/sfx/1110/2571-preview.mp3', 
  
  // Soft pop for opening modals/menus
  POP: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  
  // Paper crumble for deleting/archiving
  CRUMBLE: 'https://cdn.pixabay.com/audio/2022/03/15/audio_7314798a44.mp3',
  
  // Subtle pencil tip sound for "Start" timer
  START: 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3',
};

export const useSound = () => {
  const play = useCallback((url: string, volume = 0.15) => {
    // Check localStorage for the setting (synced with App preferences)
    const soundSetting = localStorage.getItem('vellum_sound_enabled');
    if (soundSetting === 'false') return;

    const audio = new Audio(url);
    audio.volume = volume;
    audio.play().catch(() => {});
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
