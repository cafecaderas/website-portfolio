import { Scope } from "@/components/canvas/Scope";
import { PlaceholderImage } from "@/components/chrome/PlaceholderImage";
import { nowPlayingContent } from "@/lib/content/lab";

export function NowPlayingBar() {
  return (
    <div className="nowbar">
      <PlaceholderImage
        src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=200&q=70"
        alt="Album cover placeholder"
        className="cover"
        sizes="56px"
        showTag={false}
      />
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
