import { useState, useEffect } from "react";
import "./graph.css";

function App() {
    const [data, setData] = useState<[string, number, string][]>([]);
    const [vatData, setVatData] = useState<[number, string][]>([]);
    const [tooltip, setTooltip] = useState<{ x: number, y: number, value: number, visible: boolean }>({
        x: 0,
        y: 0,
        value: 0,
        visible: false
    });

    useEffect(() => {
        fetch("/data/dates.json")
            .then((response) => response.json())
            .then((json: { data: { month: string, value: number, color: string }[] }) => {
                const formattedData: [string, number, string][] = json.data.map(item => [item.month, item.value, item.color]);
                setData(formattedData);
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            const vatRate: number = 0.20;
            const orange: string = "#FFA500"
            
            // Removing the months, leaving only the value and color
            const dataNoMonths: [number, string][] = data.map(([m, v, c]) => [v, c]);
    
            // Applying the VAT calculation
            const dataMoms = dataNoMonths.map(([value, color]) => {
                const priceWithMoms: number = value * vatRate; // Now 'value' is a number
                const newColor: string = orange;
                
                return [priceWithMoms, newColor] as [number, string];
            });
            setVatData(dataMoms);
        }
    }, [data]);
    
    const SVG_WIDTH = 710;
    const SVG_HEIGHT = 230;

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
    const numYTicks = data?.length / 2;

    const barPlotWidth = xAxisLength / ((data?.length ?? 1));

    return (
        <div style={{ position: "relative" }}>
            <svg className='graphContainer' width={SVG_WIDTH} height={SVG_HEIGHT}>
                {/* X axis */}
                <line x1={x0} y1={xAxisY} x2={x0 + xAxisLength} y2={xAxisY} stroke="grey" />
                {/* Y axis */}
                <line x1={x0} y1={y0} x2={x0} y2={y0 + yAxisLength} stroke="grey" />
                <line x1={xAxisLength} y1={y0} x2={xAxisLength} y2={y0 + yAxisLength} stroke="grey" />

                {/* Y axis labels */}
                {Array.from({ length: numYTicks }).map((_, index) => {
                    const y = y0 + index * (yAxisLength / numYTicks);
                    const yValue = Math.round(dataYMax - index * (dataYRange / numYTicks));

                    let formattedValue;
                    if (yValue >= 1000000) {
                        formattedValue = (yValue / 1000000).toFixed(1) + "M";
                    } else if (yValue >= 1000) {
                        formattedValue = Math.round(yValue / 1000) + "K";
                    } else {
                        formattedValue = yValue;
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
                    const sidePadding = 14;

                    return (
                        <g key={index}>
                            <rect
                                x={x + sidePadding / 2}
                                y={y}
                                width={barPlotWidth - sidePadding}
                                height={height}
                                fill={color}
                                onMouseEnter={(e) =>
                                    setTooltip({
                                        x: e.clientX,
                                        y: e.clientY,
                                        value: dataY,
                                        visible: true
                                    })
                                }
                                onMouseMove={(e) =>
                                    setTooltip((prev) => ({
                                        ...prev,
                                        x: e.clientX,
                                        y: e.clientY
                                    }))
                                }
                                onMouseLeave={() =>
                                    setTooltip((prev) => ({ ...prev, visible: false }))
                                }
                            />
                          
                            <text className="dateLabel" x={x + barPlotWidth / 2} y={xAxisY + 16} textAnchor={"middle"} >
                                {date}
                            </text>

                            {/* <text className="barData" x={x + barPlotWidth / 2} y={(( yAxisLength - height) - 8)} textAnchor={"middle"} fill="black" transform={`rotate(-45, ${x + barPlotWidth / 2}, ${(yAxisLength - height) - 18})`} >
                                {dataY}
                            </text> */}
                        </g>
                    );
                })}
            </svg>

            {/* Tooltip */}
            {tooltip.visible && (
                <div
                    style={{
                        position: "absolute",
                        left: tooltip.x + 10,
                        top: tooltip.y + 10,
                        background: "rgba(0,0,0,0.8)",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        pointerEvents: "none",
                        fontSize: "14px",
                        fontFamily: "Arial"
                    }}
                >
                    {tooltip.value + ":-"}
                </div>
            )}
        </div>
    );
}

export default App;
