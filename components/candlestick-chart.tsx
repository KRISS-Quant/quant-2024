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

// Candlestick Chart Component
const CandlestickChart: React.FC = () => {
  const [series, setSeries] = useState<any[]>([]);
  useEffect(() => {
    // Format the ticker data for the candlestick chart. Below is the JSON Format.
    // [
    //     [
    //       1591258320000,      	// Open time
    //       "9640.7",       	 	// Open
    //       "9642.4",       	 	// High
    //       "9640.6",       	 	// Low
    //       "9642.0",      	 	 	// Close (or latest price)
    //       "206", 			 		// Volume
    //       1591258379999,       	// Close time
    //       "2.13660389",    		// Base asset volume
    //       48,             		// Number of trades
    //       "119",    				// Taker buy volume
    //       "1.23424865",      		// Taker buy base asset volume
    //       "0" 					// Ignore.
    //     ]
    //   ]
    const candlestickData = tickerData.map((item: any) => ({
      x: new Date(item[0]), // Open time
      y: [
        parseFloat(item[1]), // Open
        parseFloat(item[2]), // High
        parseFloat(item[3]), // Low
        parseFloat(item[4]), // Close
      ],
    }));

    // Set the formatted data to the series state
    setSeries([
      { name: "Candlestick", type: "candlestick", data: candlestickData },
    ]);
  }, []);

  // Define the chart options
  const options: ApexOptions = {
    chart: {
      type: "candlestick",
      zoom: {
        enabled: true,
        autoScaleYaxis: true, // Automatically scales the y-axis on zoom
      },
    },
    title: {
      text: "APPLE INC. (AAPL)",
      align: "left",
      style: {
        color: "var(--text-base)", // Use CSS variable for text color
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "var(--text-grey)", // Set x-axis label color
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
        style: {
          colors: "var(--text-grey)", // Set y-axis label color
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
      borderColor: "rgba(128, 128, 128, 0.3)", // Set grid line color with 0.3 opacity
      strokeDashArray: 0, // Solid lines
      xaxis: {
        lines: {
          show: true, // Show x-axis grid lines
        },
      },
    },
  };

  return (
    // Container for the chart with border and background color
    <div
      className="w-[75vw] h-[80vh] p-5"
      style={{
        borderColor: "var(--border-primary)", // Use CSS variable for border color
      }}
    >
      <Chart
        options={options}
        series={series}
        type="candlestick"
        height="100%"
        width="100%"
      />
    </div>
  );
};

export default CandlestickChart;
