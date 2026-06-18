"use client";

import { createChart, ColorType, type IChartApi, type ISeriesApi } from "lightweight-charts";
import { useEffect, useRef } from "react";

type Candle = { time: number; open: number; high: number; low: number; close: number };

/** Hyperliquid-style clean candlestick chart (TradingView lightweight-charts). */
export default function Chart({ candles }: { candles: Candle[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const chart: IChartApi = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(255,255,255,0.4)",
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.03)" },
        horzLines: { color: "rgba(255,255,255,0.04)" },
      },
      crosshair: { mode: 1, vertLine: { color: "rgba(255,255,255,0.2)", labelBackgroundColor: "#1a1a1d" }, horzLine: { color: "rgba(255,255,255,0.2)", labelBackgroundColor: "#1a1a1d" } },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.06)" },
      timeScale: { borderColor: "rgba(255,255,255,0.06)", timeVisible: true, secondsVisible: false },
      handleScale: { mouseWheel: true },
      autoSize: true,
    });

    const series: ISeriesApi<"Candlestick"> = chart.addCandlestickSeries({
      upColor: "#2ebd85",
      downColor: "#f6465d",
      borderVisible: false,
      wickUpColor: "#2ebd85",
      wickDownColor: "#f6465d",
      priceFormat: { type: "price", precision: 6, minMove: 0.000001 },
    });
    series.setData(candles as Parameters<typeof series.setData>[0]);
    chart.timeScale().fitContent();

    return () => chart.remove();
  }, [candles]);

  return <div ref={ref} className="h-full w-full" />;
}
