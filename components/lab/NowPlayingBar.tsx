import { Scope } from "@/components/canvas/Scope";
import { nowPlayingContent } from "@/lib/content/lab";

export function NowPlayingBar() {
  return (
    <div className="nowbar">
      <span className="lab">
        <span className="led-dot animate__animated animate__pulse animate__infinite" />
        {nowPlayingContent.label}
      </span>
      <span className="sc">
        <Scope mode="bars" />
      </span>
      <span className="rt mono">{nowPlayingContent.readout}</span>
    </div>
  );
}
