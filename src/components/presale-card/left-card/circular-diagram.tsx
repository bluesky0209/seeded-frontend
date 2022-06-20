export interface GradientSVGProps {
  startColor: string;
  endColor: string;
  idCSS: string;
  rotation: number;
}

export default function GradientSVG(props: GradientSVGProps): JSX.Element {
  let { startColor, endColor, idCSS, rotation } = props;

  let gradientTransform = `rotate(${rotation})`;

  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={idCSS} gradientTransform={gradientTransform}>
          <stop offset='0%' stopColor={startColor} />
          <stop offset='100%' stopColor={endColor} />
        </linearGradient>
      </defs>
    </svg>
  );
}
