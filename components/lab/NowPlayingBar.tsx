import { Scope } from "@/components/canvas/Scope";

export function NowPlayingBar() {
  return (
    <div className="nowbar">
      <span className="lab">
        <span className="led-dot animate__animated animate__pulse animate__infinite" />
        NOW PLAYING
      </span>
      <span className="sc">
        <Scope mode="bars" />
      </span>
      <span className="rt mono">After Hours — 03:12AM take · 145 BPM</span>
    </div>
  );
}
