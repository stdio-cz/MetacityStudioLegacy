export function StyleDetailPanel(props: { className?: string }) {
    return null;

    /*
    const [style, setStyle] = React.useState<Style | null>(null);
    const [node, setNode] = React.useState<MetadataNode | null>(null);

    React.useEffect(() => {
        setStyle(getStyleGlobal(keychain));
        setNode(findNode(keychain));
    }, [keychain, styles]);

    if (!style || !node) return null;

    return (
        <div
            className={clsx(
                'bg-white rounded-md border w-[300px] max-h-[50%] flex flex-col',
                props.className
            )}
        >
            <div className="flex flex-row items-center text-neutral-500 lowercase p-4">
                <MetadataTitle categories={keychain} />
            </div>
            <div className="overflow-auto">
                {node.values?.type === MetadataType.NUMBER && (
                    <StyleDetailNumber values={node.values as MetadataNumberValue} style={style} />
                )}
                {node.values?.type === MetadataType.STRING && (
                    <StyleDetailString values={node.values as MetadataStringValue} style={style} />
                )}
            </div>
        </div>
    );
}

function StyleDetailNumber(props: { values: MetadataNumberValue; style: Style }) {
    return (
        <div className="p-4">
            <HistogramGradientStrip map={props.style.map} values={props.values} />
        </div>
    );
}

interface HistogramGradientStripProps {
    map: { [key: number]: vec3 };
    values: MetadataNumberValue;
}

function HistogramGradientStrip(props: HistogramGradientStripProps) {
    const { map, values } = props;
    const { unique, min, range, histogram, histogramColors } = getNumericStats(map, values);
    const maxHistoValue = Math.max(...histogram);
    const gradient = getGradientStyle(unique, map, min, range);
    const ytickCount = 5;
    const yticks = new Array(ytickCount).fill(0).map((_, index) => {
        const percent = index / (ytickCount - 1);
        const value = min + percent * range;
        return value.toFixed(2);
    });

    return (
        <div className="flex flex-col">
            <div className="flex flex-row w-full h-[50px] space-x-1 mb-1 items-end">
                {histogram.map((value, index) => (
                    <div
                        key={index}
                        className="flex-1 h-full rounded"
                        style={{
                            height: `${(value * 100) / maxHistoValue}%`,
                            background: `rgb(${histogramColors[index * 3] * 255}, ${
                                histogramColors[index * 3 + 1] * 255
                            }, ${histogramColors[index * 3 + 2] * 255})`,
                        }}
                        title={`${value} records`}
                    ></div>
                ))}
            </div>
            <div
                className="rounded w-full h-8"
                style={{
                    background: `linear-gradient(to right, ${gradient})`,
                }}
            ></div>
            <div className="flex flex-row space-x-1 mr-1 justify-between">
                {yticks.map((value, index) => (
                    <div key={index} className="text-xs text-neutral-400 text-right">
                        {value}
                    </div>
                ))}
            </div>
        </div>
    );
}

function getGradientStyle(
    unique: number[],
    map: { [key: number]: vec3 },
    min: number,
    range: number
) {
    return unique
        .map((value) => {
            const color = map[value];
            const percent = (value - min) / range;
            return `rgb(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}) ${percent * 100}%`;
        })
        .join(', ');
}

function getNumericStats(map: { [key: number]: vec3 }, values: MetadataNumberValue) {
    let unique = Object.keys(map).map((key) => Number(key));
    unique = unique.sort((a, b) => a - b);

    let min = Infinity;
    let max = -Infinity;
    for (const value of unique) {
        min = Math.min(min, value);
        max = Math.max(max, value);
    }

    let range = max - min;
    if (range === 0) range = 1;

    const bins = 10;
    const histogram = new Array(bins + 1).fill(0);
    const histogramColors = new Array(3 * (bins + 1)).fill(0);

    for (const value of values.values) {
        const percent = (value - min) / range;
        const index = Math.floor(percent * bins);
        histogramColors[index * 3 + 0] =
            (histogram[index] * histogramColors[index * 3 + 0] + map[value][0]) /
            (histogram[index] + 1);
        histogramColors[index * 3 + 1] =
            (histogram[index] * histogramColors[index * 3 + 1] + map[value][1]) /
            (histogram[index] + 1);
        histogramColors[index * 3 + 2] =
            (histogram[index] * histogramColors[index * 3 + 2] + map[value][2]) /
            (histogram[index] + 1);
        histogram[index] += 1;
    }

    return { unique, min, range, histogram, histogramColors };
}

function StyleDetailString(props: { values: MetadataStringValue; style: Style }) {
    const { values, style } = props;

    let keys = Object.keys(style.map).map((key) => String(key));

    return (
        <div className="p-4">
            <OverflowContainer>
                <div>
                    {keys.map((key, index) => (
                        <div key={`${key}_${index}`} className="flex flex-row items-center">
                            <div
                                className="w-4 h-4 mr-2 rounded"
                                style={{
                                    background: `rgb(${style.map[key][0] * 255}, ${
                                        style.map[key][1] * 255
                                    }, ${style.map[key][2] * 255})`,
                                }}
                            ></div>
                            <div>{key}</div>
                        </div>
                    ))}
                </div>
            </OverflowContainer>
        </div>
    );*/
}
