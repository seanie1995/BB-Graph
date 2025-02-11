import { useState, useEffect } from "react"
import "./graph.css"

function App() {

    const [data, setData] = useState<[string, number, string][]>([]);

    useEffect(() => {
        fetch("/data/dates.json")
            .then((response) => response.json())
            .then((json: { data: { month: string, value: number, color: string }[] }) => {
                console.log(json)
                const formattedData: [string, number, string][] = json.data.map(item => [item.month, item.value, item.color]);
                setData(formattedData);
                console.log("You made it here!");
            })
            .catch((error) => console.error(error));
    }, [])

    const SVG_WIDTH = 640;
    const SVG_HEIGHT = 300;

    const x0 = 0;
    const xAxisLength = SVG_WIDTH - x0 * 2;

    const y0 = 0;
    const yAxisLength = SVG_HEIGHT - y0 * 2;

    const xAxisY = y0 + yAxisLength;

    const dataYMax = (data ?? []).reduce(
        (currMax, [_, dataY]) => Math.max(currMax, dataY),
        -Infinity
    ) + 10;
    const dataYMin = 0;

    const dataYRange = dataYMax - dataYMin;

    const numYTicks = 5;

    const barPlotWidth = xAxisLength / ((data?.length ?? 1));

    return (
        <div>
            <svg className='graphContainer' width={SVG_WIDTH} height={SVG_HEIGHT}>
                {/* X axis */}
                <line
                    x1={x0}
                    y1={xAxisY}
                    x2={x0 + xAxisLength}
                    y2={xAxisY}
                    stroke="grey"
                />

                {/* Y axis */}
                <line x1={x0} y1={y0} x2={x0} y2={y0 + yAxisLength} stroke="grey" />

                <line x1={xAxisLength} y1={y0} x2={xAxisLength} y2={y0 + yAxisLength} stroke="grey" />

                {Array.from({ length: numYTicks }).map((_, index) => {

                    const y = y0 + index * (yAxisLength / numYTicks);

                    const yValue = Math.round(dataYMax - index * (dataYRange / numYTicks));

                    let formattedValue

                    if (yValue >= 100000) {
                        formattedValue = (yValue / 10000) + "M"
                    }
                    else if (yValue >= 1000) {
                        formattedValue = Math.round(yValue / 1000) + "K"
                    }
                    else {
                        formattedValue = yValue
                    }

                    return (
                        <g key={index}>
                            <line x1={x0 - 5} y1={y} x2={xAxisLength} y2={y} stroke="grey" />
                            <text className="valueLabel" x={x0 - 5} y={y + 5} textAnchor="end" fill="black">
                                {formattedValue}
                            </text>
                        </g>
                    );


                })}

                {/* Bar plots */}
                {data.map(([date, dataY, color], index) => {

                    const x = x0 + index * barPlotWidth;

                    const yRatio = (dataY - dataYMin) / dataYRange;

                    const y = y0 + (1 - yRatio) * yAxisLength;
                    const height = yRatio * yAxisLength;

                    const sidePadding = 15;

                    return (
                        <g key={index}>
                            <rect
                                x={x + sidePadding / 2}
                                y={y}
                                width={barPlotWidth - sidePadding}
                                height={height}
                                fill={color}

                            />
                            <text className="dateLabel" x={x + barPlotWidth / 2} y={xAxisY + 16} textAnchor="middle">
                                {date}
                            </text>

                        </g>
                    );
                })}
            </svg>
        </div>

    );
}

export default App;