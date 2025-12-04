import { useCallback, useRef } from "react";

type SoundName = "incorrect-buzz" | "correct-ding" | "countdown";

const SOUND_PATHS: Record<SoundName, string> = {
  "incorrect-buzz": "/sounds/incorrect-buzz.m4a",
  "correct-ding": "/sounds/Correct ding.m4a",
  countdown: "/sounds/Countdown.m4a",
};

/**
 * Custom hook for playing sounds with preloading and error handling
 */
export function useSound() {
  const audioCache = useRef<Map<SoundName, HTMLAudioElement>>(new Map());

  const getAudio = useCallback((soundName: SoundName): HTMLAudioElement => {
    if (!audioCache.current.has(soundName)) {
      const audio = new Audio(SOUND_PATHS[soundName]);
      audio.preload = "auto";
      audioCache.current.set(soundName, audio);
    }
    return audioCache.current.get(soundName)!;
  }, []);

  const playSound = useCallback(
    async (soundName: SoundName, volume: number = 1.0): Promise<void> => {
      try {
        const audio = getAudio(soundName);

        // Stop any current playback and reset to beginning
        // This prevents distortion from overlapping plays or playing from wrong position
        audio.pause();
        audio.currentTime = 0;
        audio.volume = Math.max(0, Math.min(1, volume));

        await audio.play();

        // Return a promise that resolves when the audio finishes playing
        return new Promise<void>((resolve, reject) => {
          const handleEnded = () => {
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("error", handleError);
            resolve();
          };

          const handleError = (error: Event) => {
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("error", handleError);
            reject(error);
          };

          audio.addEventListener("ended", handleEnded, { once: true });
          audio.addEventListener("error", handleError, { once: true });
        });
      } catch (error) {
        // Silently fail if autoplay is blocked or other errors occur
        // This is expected behavior in some browsers without user interaction
        console.warn(`Failed to play sound ${soundName}:`, error);
        // Resolve anyway so the caller doesn't hang
        return Promise.resolve();
      }
    },
    [getAudio]
  );

  const stopSound = useCallback((soundName: SoundName) => {
    const audio = audioCache.current.get(soundName);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);

  const stopAllSounds = useCallback(() => {
    audioCache.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);

  // Preload all sounds on mount
  const preloadSounds = useCallback(() => {
    Object.keys(SOUND_PATHS).forEach((soundName) => {
      getAudio(soundName as SoundName);
    });
  }, [getAudio]);

  return {
    playSound,
    stopSound,
    stopAllSounds,
    preloadSounds,
  };
}
