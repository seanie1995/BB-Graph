const SVG_WIDTH = 700;
const SVG_HEIGHT = 300;

const data: [string, number][] = [
  ["Jan", 12],
  ["Feb", 14],
  ["Mar", 12],
  ["Apr", 10],
  ["May", 5],
  ["Jun", 18],
  ["Jul", 0],
  ["Aug", 12],
  ["Sept", 14],
  ["Oct", 12],
  ["Nov", 10],
  ["Dec", 5],
];

function Graph() {
  const x0 = 50;
  const xAxisLength = SVG_WIDTH - x0 * 2;

  const y0 = 50;
  const yAxisLength = SVG_HEIGHT - y0 * 2;

  const xAxisY = y0 + yAxisLength;

  const dataYMax = data.reduce(
    (currMax, [_, dataY]) => Math.max(currMax, dataY),
    -Infinity
  );
  const dataYMin = data.reduce(
    (currMin, [_, dataY]) => Math.min(currMin, dataY),
    Infinity
  );
  const dataYRange = dataYMax - dataYMin;

  const numYTicks = 5;

  const barPlotWidth = xAxisLength / data.length;

  return (
    <svg width={SVG_WIDTH} height={SVG_HEIGHT}>
      {/* -------------------------- X axis -------------------------- */}
      <line
        x1={x0}
        y1={xAxisY}
        x2={x0 + xAxisLength}
        y2={xAxisY}
        stroke="grey"
      />
      <text x={x0 + xAxisLength + 5} y={xAxisY + 4}>
        Månad
      </text>

      {/* -------------------------- Y axis -------------------------- */}
      <line x1={x0} y1={y0} x2={x0} y2={y0 + yAxisLength} stroke="grey" />
      {Array.from({ length: numYTicks }).map((_, index) => {
        const y = y0 + index * (yAxisLength / numYTicks);

        const yValue = Math.round(dataYMax - index * (dataYRange / numYTicks));

        return (
          <g key={index}>
            <line x1={x0} y1={y} x2={x0 - 5} y2={y} stroke="grey" />
            <text x={x0 - 5} y={y + 5} textAnchor="end">
              {yValue}
            </text>
          </g>
        );
      })}
      <text x={x0} y={y0 - 8} textAnchor="middle">
        $
      </text>

      {/* -------------------------- Bar plots -------------------------- */}
      {data.map(([month, dataY], index) => {
        const x = x0 + index * barPlotWidth; // x-position of each bar

        const yRatio = (dataY - dataYMin) / dataYRange; // 

        const y = y0 + (1 - yRatio) * yAxisLength; // Calculate Y-position 
        const height = yRatio * yAxisLength; // Calculate bar height

        const sidePadding = 10;

        return (
          <g key={index}>
            <rect
              x={x + sidePadding / 2}
              y={y}
              width={barPlotWidth - sidePadding}
              height={height}
            />
            <text x={x + barPlotWidth / 2} y={xAxisY + 16} textAnchor="middle">
              {month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default Graph;