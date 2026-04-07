import { Box, Button, ButtonGroup, Typography } from "@mui/material";

export interface SalesChartDataPoint {
    period: string;
    amount: number;
}

interface SalesChartProps {
    data: SalesChartDataPoint[];
    period?: "monthly" | "quarterly" | "yearly";
    chartType?: "line" | "bar";
    onPeriodChange?: (period: "monthly" | "quarterly" | "yearly") => void;
}

const CHART_HEIGHT = 200;
const CHART_PADDING_LEFT = 60;
const CHART_PADDING_BOTTOM = 30;

export const SalesChart = ({
    data,
    period = "monthly",
    chartType = "bar",
    onPeriodChange,
}: SalesChartProps) => {
    const maxAmount = Math.max(...data.map((d) => d.amount), 1);
    const chartWidth = Math.max(data.length * 60 + CHART_PADDING_LEFT + 20, 300);
    const viewBoxHeight = CHART_HEIGHT + CHART_PADDING_BOTTOM + 20;

    const gridLines = [0, 25, 50, 75, 100];

    const getX = (index: number) => CHART_PADDING_LEFT + index * 60 + 20;
    const getY = (amount: number) => CHART_HEIGHT - (amount / maxAmount) * (CHART_HEIGHT - 20);

    return (
        <Box>
            {onPeriodChange && (
                <Box sx={{ mb: 2, display: "flex", gap: 1 }}>
                    <ButtonGroup size="small" variant="outlined">
                        {(["monthly", "quarterly", "yearly"] as const).map((p) => (
                            <Button
                                key={p}
                                variant={period === p ? "contained" : "outlined"}
                                onClick={() => onPeriodChange(p)}
                            >
                                {p === "monthly" ? "月次" : p === "quarterly" ? "四半期" : "年次"}
                            </Button>
                        ))}
                    </ButtonGroup>
                </Box>
            )}
            {data.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                    データがありません
                </Typography>
            ) : (
                <Box
                    component="svg"
                    role="img"
                    aria-label="売上推移グラフ"
                    sx={{ width: "100%", height: 280, overflow: "visible" }}
                    viewBox={`0 0 ${chartWidth} ${viewBoxHeight}`}
                >
                    {/* Grid lines */}
                    {gridLines.map((pct) => {
                        const y = CHART_HEIGHT - (pct / 100) * (CHART_HEIGHT - 20);
                        return (
                            <g key={pct}>
                                <line
                                    x1={CHART_PADDING_LEFT}
                                    y1={y}
                                    x2={chartWidth - 10}
                                    y2={y}
                                    stroke="#c4c6cf"
                                    strokeDasharray="4,4"
                                    strokeWidth={0.5}
                                />
                                <text
                                    x={CHART_PADDING_LEFT - 5}
                                    y={y + 4}
                                    fontSize="8"
                                    textAnchor="end"
                                    fill="#74777f"
                                >
                                    {Math.round((maxAmount * pct) / 100).toLocaleString()}
                                </text>
                            </g>
                        );
                    })}

                    {/* X-axis */}
                    <line
                        x1={CHART_PADDING_LEFT}
                        y1={CHART_HEIGHT}
                        x2={chartWidth - 10}
                        y2={CHART_HEIGHT}
                        stroke="#c4c6cf"
                    />

                    {/* Y-axis */}
                    <line
                        x1={CHART_PADDING_LEFT}
                        y1={10}
                        x2={CHART_PADDING_LEFT}
                        y2={CHART_HEIGHT}
                        stroke="#c4c6cf"
                    />

                    {/* Y-axis label */}
                    <text
                        x={10}
                        y={CHART_HEIGHT / 2}
                        fontSize="9"
                        fill="#74777f"
                        textAnchor="middle"
                        transform={`rotate(-90, 10, ${CHART_HEIGHT / 2})`}
                    >
                        売上金額
                    </text>

                    {/* Data */}
                    {chartType === "bar"
                        ? data.map((d, i) => {
                              const x = getX(i);
                              const barH = (d.amount / maxAmount) * (CHART_HEIGHT - 20);
                              const y = CHART_HEIGHT - barH;
                              return (
                                  <g key={d.period}>
                                      <rect
                                          x={x}
                                          y={y}
                                          width={30}
                                          height={barH}
                                          fill="#002045"
                                          opacity={0.85}
                                      >
                                          <title>{`${d.period}: ¥${d.amount.toLocaleString()}`}</title>
                                      </rect>
                                      <text
                                          x={x + 15}
                                          y={CHART_HEIGHT + 15}
                                          fontSize="9"
                                          textAnchor="middle"
                                          fill="#74777f"
                                      >
                                          {d.period}
                                      </text>
                                  </g>
                              );
                          })
                        : data.map((d, i) => {
                              const x = getX(i) + 15;
                              const y = getY(d.amount);
                              return (
                                  <g key={d.period}>
                                      {i > 0 && (
                                          <line
                                              x1={getX(i - 1) + 15}
                                              y1={getY(data[i - 1].amount)}
                                              x2={x}
                                              y2={y}
                                              stroke="#002045"
                                              strokeWidth={2}
                                          />
                                      )}
                                      <circle cx={x} cy={y} r={4} fill="#002045">
                                          <title>{`${d.period}: ¥${d.amount.toLocaleString()}`}</title>
                                      </circle>
                                      <text
                                          x={x}
                                          y={CHART_HEIGHT + 15}
                                          fontSize="9"
                                          textAnchor="middle"
                                          fill="#74777f"
                                      >
                                          {d.period}
                                      </text>
                                  </g>
                              );
                          })}

                    {/* Legend */}
                    <rect
                        x={CHART_PADDING_LEFT}
                        y={viewBoxHeight - 12}
                        width={12}
                        height={10}
                        fill="#002045"
                        opacity={0.85}
                    />
                    <text
                        x={CHART_PADDING_LEFT + 16}
                        y={viewBoxHeight - 3}
                        fontSize="9"
                        fill="#74777f"
                    >
                        売上
                    </text>
                </Box>
            )}
        </Box>
    );
};
