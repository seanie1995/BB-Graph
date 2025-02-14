import { useState, useEffect } from "react";
import "./graph.css";

function App() {
    const [dataWithMoms, setData] = useState<[string, number, string][]>([]);
    const [dataWithoutMoms, setutanMomsData] = useState<[number, string][]>([]);
    const [tooltip, setTooltip] = useState<{ x: number, y: number, value: number, visible: boolean }>({
        x: 0,
        y: 0,
        value: 0,
        visible: false
    });

    const [checkBoxes, setCheckBoxes] = useState({
        exklMoms: false,
        inklMoms: true,
        printVersion: false

    })

    const [inklMomsHeights, setInklMomsHeights] = useState<number[]>([]);

    useEffect(() => {
        const inklMomsValues: number[] = dataWithMoms.map(([_, v]) => {
            const yRatio: number = (v - dataYMin) / dataYRange
            return yRatio * xAxisLength
        })

        setInklMomsHeights(inklMomsValues);

    }, [dataWithMoms]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setCheckBoxes((prev) => ({
            ...prev,
            [name]: checked

        }));
    };

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
        if (dataWithMoms.length > 0) {
            const vatRate: number = 0.25;
            const barColor: string = "#3f5721"

            // Removing the months, leaving only the value and color
            const dataNoMonths: [number, string][] = dataWithMoms.map(([m, v, c]) => [v, c]);

            // Applying the VAT calculation
            const dataMoms = dataNoMonths.map(([value, color]) => {
                const priceWithoutMoms: number = value - (value * vatRate); // Now 'value' is a number
                const newColor: string = barColor;

                return [priceWithoutMoms, newColor] as [number, string];
            });
            setutanMomsData(dataMoms);
        }
    }, [dataWithMoms]);



    const SVG_WIDTH = 670;
    const SVG_HEIGHT = 250;

    const x0 = 0;
    const xAxisLength = SVG_WIDTH - x0 * 2;

    const y0 = 0;
    const yAxisLength = SVG_HEIGHT - y0 * 2;

    const xAxisY = y0 + yAxisLength;

    const dataYMax = (dataWithMoms ?? []).reduce(
        (currMax, [_, dataY]) => Math.max(currMax, dataY),
        -Infinity
    );
    const dataYMin = 0;
    const dataYRange = dataYMax - dataYMin;
    const numYTicks = dataWithMoms?.length / 2;

    const barPlotWidth = xAxisLength / ((dataWithMoms?.length ?? 1));

    return (
        <div>
            <div className="mainContainer">
                <svg className='graphContainer' width={SVG_WIDTH} height={SVG_HEIGHT}>
                    {/* X axis */}
                    <line x1={x0} y1={xAxisY} x2={x0 + xAxisLength} y2={xAxisY} stroke="grey" />
                    {/* Y axis */}
                    <line x1={x0} y1={y0} x2={x0} y2={y0 + yAxisLength} stroke="grey" />
                    <line x1={xAxisLength} y1={y0} x2={xAxisLength} y2={y0 + yAxisLength} stroke="grey" />

                    {/* Y axis labels */}
                    {!checkBoxes.printVersion && Array.from({ length: numYTicks }).map((_, index) => {
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


                    {/* --------------------------- BARS INKL MOMS --------------------------- */}

                    {checkBoxes.inklMoms && dataWithMoms.map(([date, dataY, color], index) => {
                        const x = x0 + index * barPlotWidth;
                        const yRatio = (dataY - dataYMin) / dataYRange;
                        const y = y0 + (1 - yRatio) * yAxisLength;
                        const height = yRatio * yAxisLength;
                        const sidePadding = 14;

                        console.log(dataY)

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
                                {checkBoxes.printVersion && <text className="barData" x={x + barPlotWidth / 2} y={((yAxisLength - height) - 4)} textAnchor={"middle"} fill="black"  >
                                    {dataY + ":-"}
                                </text>}

                            </g>
                        );
                    })}

                    {/* --------------------------- BARS EXKL MOMS --------------------------- */}

                    {checkBoxes.exklMoms && dataWithoutMoms.map(([dataY, color], index) => {
                        const x = x0 + index * barPlotWidth;
                        const yRatio = (dataY - dataYMin) / dataYRange;
                        const y = y0 + (1 - yRatio) * yAxisLength;
                        const height = yRatio * yAxisLength;
                        const sidePadding = 14;

                        return (
                            <g className="momsGraph" key={index}>
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
                                {checkBoxes.printVersion && <text className="barData" x={x + barPlotWidth / 2} y={((yAxisLength - height) + 16)} textAnchor={"middle"} fill="white"  >
                                    {dataY + ":-"}
                                </text>}

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
            <div className="radioBox">
                <div className="checkboxWrapper">
                    <input type="checkbox"
                        name="exklMoms"
                        checked={checkBoxes.exklMoms}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="exklMoms">Exkl Moms</label>
                </div>
                {/* <div className="checkboxWrapper">
                    <input type="checkbox" 
                    name="inklMoms"
                    checked={checkBoxes.inklMoms}
                    onChange={handleCheckboxChange} />
                    <label htmlFor="option2">Inkl Moms</label>
                </div> */}
                <div className="checkboxWrapper">
                    <input type="checkbox"
                        name="printVersion"
                        checked={checkBoxes.printVersion}
                        onChange={handleCheckboxChange} />
                    <label htmlFor="option3">Print Version</label>
                </div>
            </div>
        </div>
    );
}

export default App;
