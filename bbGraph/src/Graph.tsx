import { useState } from "react";
import "./graph.css"

function Graph() {

  // SVG graphs work from top-left instead of buttom left. So a lower value assigned to an y-coordinate === higher placement in the graph and vice versa. X coordinates function as usual 
  // x0 and y0 is the upper tip of the y axis. 

  // The two variables below define the size of the SVG container which houses the graph. Not width and height of the graphs x and y axes

  const SVG_WIDTH = 710;
  const SVG_HEIGHT = 310;

  // Mock data

  const data: [string, number][] = [
    ["Jan", 90],
    ["Feb", 120],
    ["Mar", 100],
    ["Apr", 110],
    ["May", 130],
    ["Jun", 30],
    ["Jul", 150],
    ["Aug", 100],
    ["Sept", 130],
    ["Oct", 90],
    ["Nov", 140],
    ["Dec", 120],
  ];

  const data2: [string, number][] = [
    ["Mon", 20],
    ["Tue", 60],
    ["Wed", 40],
    ["Thu", 25],
    ["Fri", 35],
    ["Sat", 15],
    ["Sun", 5],
  ];

  const x0 = 2;
  const xAxisLength = SVG_WIDTH - x0 * 2; // The width needs to be subtracted by the starting point so that the graph itself becomes more 'centered' and doesn't hug the left wall of the graph. Multiplied by 2 in order to make it longer

  const y0 = 50;
  const yAxisLength = SVG_HEIGHT - y0 * 2; // The height needs to be subtracted by the starting point so that the graph itself becomes more 'centered' and doesn't hug the top wall of the graph. Multiplied by 2 in order to make it longer

  const xAxisY = y0 + yAxisLength; // The line that reaches from the top of the SVG container to the x-axis of the graph itself.

  // --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  // Code goes through every member of the array and compares it to the previous. Depending if the current value is higher/lower than the previous, the current value is assigned currMax or currMin respectively.
  // Infinity/-Infinity is used as a "reference" to ensure that the max/min number will always be larger/smaller than the reference number respectively. Can work without Infinity but will result in crash if no values are found in the array.

  // const findDataYMax = (data: [number, number])

  const dataYMax = data.reduce(
    (currMax, [_, dataY]) => Math.max(currMax, dataY),
    -Infinity
  );

  // const dataYMin = data.reduce(
  //   (currMin, [_, dataY]) => Math.min(currMin, dataY),
  //   Infinity
  // );

  const dataYMin = 0;

  // --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  const dataYRange = dataYMax - dataYMin; // Difference between smallest and largest number in the array. 

  const barPlotWidth = (xAxisLength / (data.length - 1)); // Evenly distributes space for each date.

  const numYTicks = 4;

  // Function to get the x and y coordinates for each data point
  const getDataPoint = (index: number, dataY: number) => {

    const x = x0 + index * barPlotWidth; // Shifts point to the right of the x-axis after each iteration of the data
    const yRatio = (dataY - dataYMin) / dataYRange; // Places current item's value in reference to the highest value of the dataRange. This ensures the Y coordinate of the item finds the right spot in the graph.
    const y = y0 + (1 - yRatio) * yAxisLength; // y0 is here in order to "push" the Y coordinate into the graph since it initially is out of bounds. 1 - yRatio * yAxisLength places the Y coordinate in reference to what the highest value is AND length of the yAxis
    return { x, y };
  };

  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string | null }>({
    x: 0,
    y: 0,
    label: null,
  });

  return (
    <svg className="graphContainer" width={SVG_WIDTH} height={SVG_HEIGHT}>

      {/* -------------------------- X axis -------------------------- */}
      <line
        x1={x0}
        y1={xAxisY}
        x2={xAxisLength + x0}
        y2={xAxisY}
        stroke="black"
      />
      {/* The "ticks" are made longer to simulate/draw out a graph */}
      {Array.from({ length: numYTicks }).map((_, index) => {
        const y = y0 + index * (yAxisLength / numYTicks);
        return (
          <g key={index}>
            <line x1={x0} y1={y} x2={xAxisLength + x0} y2={y} stroke="gray" />
          </g>
        );
      })}

      {/* -------------------------- Y axis -------------------------- */}

      <line x1={x0} y1={y0} x2={x0} y2={y0 + yAxisLength} stroke="black" />


      {/* -------------------------- Line graph -------------------------- */}

      {data.map(([date, dataY], index) => {
        const { x, y } = getDataPoint(index, dataY);

        return (
          <g key={index}>
            {/* Draw circles for data points */}
            <circle cx={x} cy={y} r={4} fill="#2C3340" />

            {/* Draw line segments between consecutive data points */}
            {/* The lines connecting the dots */}
            {index > 0 && (
              <line
                x1={getDataPoint(index - 1, data[index - 1][1]).x}
                y1={getDataPoint(index - 1, data[index - 1][1]).y}
                x2={x}
                y2={y}
                stroke="#2C3340"
                strokeWidth="1"
              />
            )}

            {/* Labels for each data point with the actual value */}

            <text className="dateLabel" x={x} y={xAxisY + 18} textAnchor="middle">
              {date}
            </text>

            <text className="dateLabel" x={x} y={xAxisY + 18} textAnchor="middle">
              {date}
            </text>

            <line
              x1={x}
              y1={50}
              x2={x}
              y2={xAxisY + 5}
              stroke="black"
              strokeWidth=""
            />
          </g>
        );
      })}

      <path
        d={data
          .map(([_, dataY], index) => {
            const { x, y } = getDataPoint(index, dataY);
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
          })
          .join(' ') + ` L ${xAxisLength + x0} ${xAxisY} L ${x0} ${xAxisY} Z`} // This closes the area at the bottom
        fill="rgba(44, 52, 64, 0.60)
"
      />
    </svg>
  );
}

export default Graph;
