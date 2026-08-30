"use client";

import { useState } from "react";
import { isAudioEngineOn, startAudioEngine, stopAudioEngine } from "@/components/canvas/audio-engine";

/**
 * The one user gesture that unlocks real audio site-wide (browsers block
 * autoplay). Everything the audio engine drives — the oscilloscopes, the
 * tape transport, the shader hero — already falls back to a synthetic idle
 * signal when this is off, so toggling it never breaks anything visually.
 */
export function SignalToggle() {
  const [on, setOn] = useState(false);

  const toggle = () => {
    if (isAudioEngineOn()) {
      stopAudioEngine();
      setOn(false);
    } else {
      startAudioEngine();
      setOn(true);
    }
  };

  return (
    <button type="button" className="signal-toggle mono" onClick={toggle} aria-pressed={on}>
      {on && <span className="led-dot animate__animated animate__pulse animate__infinite" />}
      SIGNAL: {on ? "ON" : "OFF"}
    </button>
  );
}
