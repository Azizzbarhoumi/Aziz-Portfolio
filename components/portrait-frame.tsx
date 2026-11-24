import Image from "next/image";

export function PortraitFrame() {
  return (
    <div className="portrait-composition">
      <span className="portrait-overline">PORTFOLIO / 2026</span>
      <div className="portrait-stage">
        <div className="portrait-frame">
          <Image
            src="/images/ahmed-aziz-portrait.webp"
            alt="Portrait of Ahmed Aziz Barhoumi in an office"
            fill
            priority
            sizes="(max-width: 700px) 42vw, (max-width: 900px) 31vw, 34vw"
            className="portrait-image"
          />
        </div>
        <span className="portrait-crosshair" aria-hidden="true">+</span>
      </div>
      <div className="portrait-caption"><span>AHMED AZIZ BARHOUMI</span><span>AI / DS — 01</span></div>
    </div>
  );
}

export default PortraitFrame;
