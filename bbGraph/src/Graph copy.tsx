// The two variables below define the size of the SVG container which houses the graph. Not width and height of the graphs x and y axes
import "./graph.css"

const SVG_WIDTH = 710;
const SVG_HEIGHT = 300;

// Mock data

const data: [string, number][] = [
  ["Jan", 100],
  ["Feb", 30],
  ["Mar", 140],
  ["Apr", 130],
  ["May", 185],
  ["Jun", 110],
  ["Jul", 70],
  ["Aug", 100],
  ["Sept", 160],
  ["Oct", 90],
  ["Nov", 140],
  ["Dec", 120],
];

const data2: [string, number][] = [
  ["Jan", 130],
  ["Feb", 140],
  ["Mar", 100],
  ["Apr", 70],
  ["May", 50],
  ["Jun", 160],
  ["Jul", 30],
  ["Aug", 90],
  ["Sept", 120],
  ["Oct", 110],
  ["Nov", 140],
  ["Dec", 100],
];

function Graph() {

  // SVG graphs work from top-left instead of buttom left. So a lower value assigned to an y-coordinate === higher placement in the graph and vice versa. X coordinates function as usual 
  // x0 and y0 is the upper tip of the y axis. 

  const x0 = 50;
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

  const barPlotWidth = xAxisLength / data.length; // Evenly distributes space for each month.

  const numYTicks = 4;

  // Function to get the x and y coordinates for each data point
  const getDataPoint = (index: number, dataY: number) => {

    const x = x0 + index * barPlotWidth; // Shifts point to the right of the x-axis after each iteration of the data
    const yRatio = (dataY - dataYMin) / dataYRange; // Places current item's value in reference to the highest value of the dataRange. This ensures the Y coordinate of the item finds the right spot in the graph.
    const y = y0 + (1 - yRatio) * yAxisLength; // y0 is here in order to "push" the Y coordinate into the graph since it initially is out of bounds. 1 - yRatio * yAxisLength places the Y coordinate in reference to what the highest value is AND length of the yAxis
    return { x, y };
  };

  return (
    <svg className="graphContainer" width={SVG_WIDTH} height={SVG_HEIGHT}>
      {/* -------------------------- X axis -------------------------- */}
      <line
        x1={x0}
        y1={xAxisY}
        x2={xAxisLength}
        y2={xAxisY}
        stroke="black"
      />

      {/* -------------------------- Y axis -------------------------- */}

      <line x1={x0} y1={y0} x2={x0} y2={y0 + yAxisLength} stroke="black" />
      {Array.from({ length: numYTicks }).map((_, index) => {
        const y = y0 + index * (yAxisLength / numYTicks);  
        return (
          <g key={index}>
            <line x1={x0} y1={y} x2={xAxisLength} y2={y} stroke="gray" />
          </g>
        );
      })}

      {/* -------------------------- Line graph -------------------------- */}

      {data.map(([month, dataY], index) => {
        const { x, y } = getDataPoint(index, dataY);

        return (
          <g key={index}>
            {/* Draw circles for data points */}
            <circle cx={x} cy={y} r={4} fill="black" />

            {/* Draw line segments between consecutive data points */}
            {index > 0 && (
              <line
                x1={getDataPoint(index - 1, data[index - 1][1]).x}
                y1={getDataPoint(index - 1, data[index - 1][1]).y}
                x2={x}
                y2={y}
                stroke="gray"
                strokeWidth="2"
              />
            )}

            {/* Labels for each data point with the actual value */}

            <text x={x} y={y - 8} textAnchor="middle" fontSize="12" fill="black">
              {/* {dataY} */}
            </text>

            <text x={x} y={xAxisY + 16} textAnchor="middle">
              {month}
            </text>
          </g>
        );
      })}
      
      {/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

      {data2.map(([_, dataY], index) => {
        const { x, y } = getDataPoint(index, dataY);

        return (
          <g key={index}>
            {/* Draw circles for data points */}
            <circle cx={x} cy={y} r={4} fill="black" />

            {/* Draw line segments between consecutive data points */}
            {index > 0 && (
              <line
                x1={getDataPoint(index - 1, data2[index - 1][1]).x}
                y1={getDataPoint(index - 1, data2[index - 1][1]).y}
                x2={x}
                y2={y}
                stroke="gray"
                strokeWidth="2"
              />
            )}

            {/* Labels for each data point with the actual value */}

            <text x={x} y={y - 8} textAnchor="middle" fontSize="12" fill="black">
              {/* {dataY} */}
            </text>

            {/* Month labels */}

            {/* Ticks for Months on X axis */}


              {/* Grid Lines */}
            <line
              x1={x}
              y1={50}
              x2={x}
              y2={xAxisY}
              stroke="black"
              strokeWidth=""
            />

          </g>
        );
      })}
    </svg>
  );
}

export default Graph;
