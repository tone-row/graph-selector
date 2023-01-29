export const toPercent = (decimal: number, fixed = 0) =>
  `${(decimal * 100).toFixed(0)}%`;

export function CustomizedAxisTick(props: any) {
  const { x, y, stroke, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-35)"
      >
        {payload.value}
      </text>
    </g>
  );
}
