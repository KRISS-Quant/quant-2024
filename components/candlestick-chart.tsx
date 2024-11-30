"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Import Dummy data from Klines.json
import tickerData from "../klines.json";
import { AlignTopIcon } from "@radix-ui/react-icons";
import { get } from "node:https";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Dynamically import the ApexCharts component with no server-side rendering
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Candlestick Chart
interface CandlestickChartProps {
  algorithm: string;
}

// Candlestick Chart Component
const CandlestickChart: React.FC<CandlestickChartProps> = ({ algorithm }) => {
  const [series, setSeries] = useState<any[]>([]);
  const [tickerData, setTickerData] = useState<any[]>([]);
  const [candlestickData, setCandlestickData] = useState<
    {
      x: Date; // Open time
      y: number[];
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =
          algorithm === "SMA Golden Cross Strategy"
            ? await fetch("/api/strats/sma/basic")
            : await fetch("/api/strats/rsi/basic");
        const data = await response.json();
        if (data && data.ohlc_data && data.ohlc_data.primary) {
          setTickerData(data.ohlc_data.primary);
        } else {
          console.error("Unexpected data structure:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [algorithm]);

  useEffect(() => {
    if (tickerData.length > 0) {
      const formattedData = formatCandlestickData(tickerData);
      setCandlestickData(formattedData);
    }
  }, [tickerData]);

  const formatCandlestickData = (data: any[]) => {
    if (!data || data.length === 0) return [];
    console.log("formatcandlestickdatacalled");
    return data.map((item: any) => ({
      x: new Date(item[0]),
      y: [
        parseFloat(item[1]), // Open
        parseFloat(item[2]), // High
        parseFloat(item[3]), // Low
        parseFloat(item[4]), // Close
      ],
    }));
  };

  // Calculate SMA values (dummy calculation)
  const calculateSMA = (period: number) => {
    if (!tickerData) {
      return []; // Return an empty array if tickerData is undefined
    }

    return tickerData.map((item: any, index: number) => ({
      x: new Date(item[0]),
      y: parseFloat(item[4]) + (period === 50 ? 100 : 200), // Dummy calculation
    }));
  };

  // Calculate RSI (dummy calculation for example)
  const calculateRSI = () => {
    if (!tickerData) {
      return []; // Return an empty array if tickerData is undefined
    }

    return tickerData.map((item: any) => ({
      x: new Date(item[0]),
      y: Math.random() * 100, // Dummy RSI value
    }));
  };

  // Fetch data from the API
  // const fetchData = async (algorithm: string) => {
  //   try {
  //     const response =
  //       algorithm === "SMA Golden Cross Strategy"
  //         ? await fetch("/api/strats/sma/basic")
  //         : await fetch("/api/strats/rsi/basic");
  //     const data = await response.json();
  //     if (data && data.ohlc_data && data.ohlc_data.primary) {
  //       setTickerData(data.ohlc_data.primary);
  //     } else {
  //       console.error("Unexpected data structure:", data);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // useEffect(() => {
  //   if (tickerData.length > 0) {
  //     setCandlestickData(formatCandlestickData());
  //   }
  // }, [tickerData]);

  // useEffect(() => {
  //   fetchData(algorithm);
  // }, [algorithm]);

  useEffect(() => {
    console.log("Ticker Data:", tickerData);
    console.log("Candlestick Data:", candlestickData);
  }, [tickerData, candlestickData]);

  useEffect(() => {
    // Set the formatted data to the series state (Updated)
    if (algorithm === "SMA Golden Cross Strategy" && tickerData.length > 0) {
      setSeries([
        {
          name: "Candlestick",
          type: "candlestick",
          data: candlestickData,
        },
        {
          name: "SMA 50",
          type: "line",
          data: calculateSMA(50),
        },
        {
          name: "SMA 200",
          type: "line",
          data: calculateSMA(200),
        },
      ]);
    } else if (algorithm === "RSI Strategy") {
      setSeries([
        {
          name: "Candlestick",
          type: "candlestick",
          data: candlestickData,
        },
      ]);
    }
  }, [candlestickData]);

  // Define the chart options
  const CandlestickOptions: ApexOptions = {
    chart: {
      type: "candlestick",
      id: "candles",
      height: algorithm === "RSI Strategy" ? "75%" : 350,
      group: "charts",
      parentHeightOffset: 0,
      zoom: {
        enabled: true,
        autoScaleYaxis: true, // Automatically scales the y-axis on zoom
      },
      foreColor: "#fff",
    },

    title: {
      text: "BTC/USDT",
      align: "left",
      style: {
        color: "var(--text-base)", // Use CSS variable for text color
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "var(--text-base)", // Set x-axis label color
        },
      },
      axisBorder: {
        show: true,
        color: "var(--text-grey)", // Set x-axis border color
      },
    },
    yaxis: {
      tickAmount: 10, // Set the number of ticks on the y-axis
      labels: {
        minWidth: 75,
        align: "left",
        formatter: function (val) {
          return val.toFixed(1);
        },
        style: {
          colors: "var(--text-base)", // Set y-axis label color
        },
      },
    },
    plotOptions: {
      candlestick: {
        colors: {
          upward: "#5380D8", // Blue color for upward movement
          downward: "#EA1212", // Red color for downward movement
        },
        wick: {
          useFillColor: true, // Use the same color for the wick as the body
        },
      },
    },
    grid: {
      padding: {
        left: 10,
        right: 10,
      },
      borderColor: "rgba(128, 128, 128, 0.3)", // Set grid line color with 0.3 opacity
      strokeDashArray: 0, // Solid lines
      xaxis: {
        lines: {
          show: true, // Show x-axis grid lines
        },
      },
    },
    tooltip: {
      theme: "dark", // Dark theme for tooltip
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
      x: {
        show: true,
        format: "dd MMM",
      },
      y: {
        title: {
          formatter: (seriesName) => seriesName,
        },
      },
      marker: {
        show: true,
      },
      items: {
        display: "flex",
      },
      fixed: {
        enabled: false,
        position: "topRight",
        offsetX: 0,
        offsetY: 0,
      },
    },
    stroke: {
      curve: "smooth",
      width: [2, 0.5, 0.5], // candlestick, sma_short, sma_long
      colors: ["#000", "#FFFF00", "#00ff00"], // temporary color selections
    },
    legend: {
      labels: {
        colors: "var(--text-base)",
      },
      markers: {
        fillColors: ["#000", "#FFFF00", "#00ff00"],
      },
    },
  };

  const rsiOptions: ApexOptions = {
    chart: {
      type: "line",
      id: "rsi",
      height: "25%",
      group: "charts",
      parentHeightOffset: 0,
      toolbar: {
        autoSelected: "pan",
        show: false,
      },
    },
    title: {
      text: "RSI",
      align: "left",
      style: { color: "var(--text-base)" },
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        minWidth: 75,
        align: "left",
        formatter: function (val) {
          return val.toFixed(0);
        },
        style: { colors: "var(--text-base)" },
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: { colors: "var(--text-base)" },
        show: false,
      },
    },
    grid: {
      padding: {
        left: 10,
        right: 10,
      },
    },
    stroke: {
      curve: "smooth",
      width: [1], // rsi
      colors: ["#a0aaba"], // temporary color selection
    },
  };

  console.log(candlestickData);

  return (
    // Container for the chart with border and background color
    <div
      className="w-[75vw] h-[80vh] p-5"
      style={{
        borderColor: "var(--border-primary)", // Use CSS variable for border color
      }}
    >
      {candlestickData.length > 0 && (
        <Chart
          options={CandlestickOptions}
          series={series}
          type="candlestick"
          height={algorithm === "RSI Strategy" ? "70%" : "100%"}
          width="100%"
        />
      )}

      {algorithm === "RSI Strategy" && candlestickData.length > 0 && (
        <Chart
          options={rsiOptions}
          series={[
            {
              name: "RSI",
              type: "line",
              data: calculateRSI(),
            },
          ]}
          type="line"
          height="30%"
          width="100%"
        />
      )}
    </div>
  );
};

export default CandlestickChart;
