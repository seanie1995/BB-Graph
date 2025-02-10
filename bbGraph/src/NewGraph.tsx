import React from 'react'
import "./graph.css"

const NewGraph = () => {

    const SVG_WIDTH: number = 670;
    const SVG_HEIGHT: number = 200;

    const data: [string, number][] = [
        ["Jan", 90],
        ["Feb", 120],
        ["Mar", 100],
        ["Apr", 110],
        ["May", 130],
        ["Jun", 90],
        ["Jul", 150],
        ["Aug", 100],
        ["Sept", 130],
        ["Oct", 90],
        ["Nov", 140],
        ["Dec", 120],
    ];

    const x0 = 2;
    const y0 = 2;
    const xAxisLength = SVG_WIDTH - x0 * 2;
    const yAxisLength = SVG_HEIGHT - y0 * 2;
    const xAxisY = yAxisLength + y0;

    const dataYMax = data.reduce(
        (currMax, [_, dataY]) => Math.max(currMax, dataY),
        -Infinity
    ) + 10;

    const dataYMin = 0;

    const dataRange = dataYMax - dataYMin;

    const numYTicks = 4;

    const barPlotWidth = xAxisLength / (data.length - 1);

    const getDataPoints = (index: number, dataY: number) => {
        const x = x0 + index * barPlotWidth;
        const yRatio = (dataY - dataYMin) / dataRange;
        const y = y0 + (1 - yRatio) * yAxisLength;

        return { x, y };
    }
    return (
        <div>
            <svg className='graphContainer' width={SVG_WIDTH} height={SVG_HEIGHT}>

                {/* X Axis */}
                <line
                    x1={x0}
                    y1={xAxisY}
                    x2={xAxisLength + x0}
                    y2={xAxisY}
                    stroke="black"
                />

                {/* Y Axis */}
                <line
                    x1={x0}
                    y1={y0}
                    x2={x0}
                    y2={yAxisLength + y0}
                    stroke="black"
                />

                {/* Y Axis Right Side */}
                <line
                    x1={x0 + xAxisLength}
                    y1={y0}
                    x2={xAxisLength + x0}
                    y2={yAxisLength + y0}
                    stroke="black"
                />

                {/* X Axis Gridlines */}

                {Array.from({ length: numYTicks }).map((_, index) => {
                    const y = y0 + index * (yAxisLength / numYTicks);
                    return (
                        <g key={index}>
                            <line x1={x0} y1={y} x2={xAxisLength + x0} y2={y} stroke="gray" />
                        </g>
                    );
                })}

                {data.map(([date, dataY], index) => {

                    const { x, y } = getDataPoints(index, dataY);

                    return (
                        <g className="container" key={index}>
                            <circle
                                cx={x}
                                cy={y}
                                r={3}
                                fill="#2C3340"
                            />

                            {index > 0 && (
                                <line
                                    x1={getDataPoints(index - 1, data[index - 1][1]).x}
                                    y1={getDataPoints(index - 1, data[index - 1][1]).y}
                                    x2={x}
                                    y2={y}
                                    stroke="#2C3340"
                                    strokeWidth="1"
                                />
                            )}

                            <text className="dateLabel" x={x} y={xAxisY + 16} textAnchor="middle">
                                {date}
                            </text>

                            <line
                                x1={x}
                                y1={2}
                                x2={x}
                                y2={xAxisY + 5}
                                stroke="gray"
                                strokeWidth=""
                            />


                        </g>


                    );
                })}
                <path
                    d={data
                        .map(([_, dataY], index) => {
                            const { x, y } = getDataPoints(index, dataY);
                            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                        })
                        .join(' ') + ` L ${xAxisLength + x0} ${xAxisY} L ${x0} ${xAxisY} Z`} // This closes the area at the bottom
                    fill="rgba(44, 52, 64, 0.80)"
                />
            </svg>
        </div>
    )
}

export default NewGraph