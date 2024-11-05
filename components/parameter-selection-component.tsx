"use client";

import { SetStateAction, useState } from "react";
import { SelectCustom } from "@/components/ui/select-custom";
import { Button } from "./ui/button";
import { DateTimePickerCustom } from "./ui/date-time-picker-custom";
import { z } from "zod";
import { useRouter } from "next/navigation";

const algorithms = ["SMA Golden Cross Strategy", "RSI Strategy"]; //Initial Strategies
//const algorithms = ["SMA", "EMA", "Pair", "Bollinger", "RSI"];
const ticker = ["BTCUSDT", "ETHUSDT"];
const intervals = ["1m", "5m", "15m", "30m", "1h", "4h", "1d"];

// Validation schema for SMA parameters
const SMAParamsSchema = z.object({
  longer: z.number().min(10).max(200),
  shorter: z.number().min(10).max(200),
});

// Validation schema for RSI parameters
const RSIParamsSchema = z.object({
  lowThreshold: z.number().min(10).max(40),
  highThreshold: z.number().min(60).max(90),
});

// Define the props type
interface ParameterSelectionComponentProps {
  isMainPage?: boolean; // Make it optional
}

export function ParameterSelectionComponent({
  isMainPage = false,
}: ParameterSelectionComponentProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
  const [smaParams, setSmaParams] = useState({ longer: 50, shorter: 20 });
  const [rsiParams, setRsiParams] = useState({
    lowThreshold: 30,
    highThreshold: 70,
  });
  const router = useRouter();

  // Handle the algorithm change to render different parameter selection options
  const handleAlgorithmChange = (algorithm: SetStateAction<string>) => {
    setSelectedAlgorithm(algorithm);
  };

  const handleSmaChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setSmaParams((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleRsiChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setRsiParams((prev) => ({ ...prev, [name]: Number(value) }));
  };

  // Validate the parameters before making the API call
  const validateParams = () => {
    try {
      if (selectedAlgorithm === "SMA Golden Cross Strategy") {
        SMAParamsSchema.parse(smaParams);
      } else if (selectedAlgorithm === "RSI") {
        RSIParamsSchema.parse(rsiParams);
      }
      alert("Please select valid range of parameters.");
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.errors[0].message);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  // Handle rendering UI change based on the main page
  var goButtonClass =
    "w-full bg-btn-secondary hover:bg-btn-accent text-primary";
  var numberInputClass =
    "h-7 p-4 justify-center bg-transparent border rounded-md border-secondary";
  if (isMainPage) {
    goButtonClass =
      "w-full bg-btn-primary text-secondary hover:bg-btn-accent hover:text-primary";
    numberInputClass =
      "h-7 p-4 justify-center bg-transparent border rounded-md border-primary";
  }

  const handleStartBacktesting = () => {
    router.push(`/candlestick?algorithm=${encodeURIComponent(selectedAlgorithm)}`);
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-4 w-[80%] mx-auto">
      <SelectCustom
        items={ticker}
        placeholder="Select Ticker"
        isMainPage={isMainPage}
      />
      {/* <SelectCustom items={algorithms} placeholder="Select Algorithm" /> */}
      <SelectCustom
        items={algorithms}
        placeholder="Select Algorithm"
        onChange={handleAlgorithmChange}
        isMainPage={isMainPage}
      />

      <SelectCustom
        items={intervals}
        placeholder="Select Time Interval"
        isMainPage={isMainPage}
      />
      {selectedAlgorithm === "SMA Golden Cross Strategy" && (
        <div>
          <div className="text-sm"> Please Input Longer and Shorter SMA Values</div>
          <div className="flex flex-row w-full space-x-10 justify-center whitespace-nowrap px-3 py-2 text-sm">
            <input
              type="number"
              name="longer"
              value={smaParams.longer}
              onChange={handleSmaChange}
              placeholder="Longer"
              min="10"
              max="200"
              className={numberInputClass}
            />
            <input
              type="number"
              name="shorter"
              value={smaParams.shorter}
              onChange={handleSmaChange}
              placeholder="Shorter"
              min="10"
              max="200"
              className={numberInputClass}
            />
          </div>
        </div>
      )}

      {selectedAlgorithm === "RSI Strategy" && (
        <div>
          <div className="text-sm"> Please Input Low/High Thresholds For RSI Values</div>

          <div className="flex flex-row w-full space-x-10 justify-center whitespace-nowrap px-3 py-2 text-sm">
            <input
              type="number"
              name="lowThreshold"
              value={rsiParams.lowThreshold}
              onChange={handleRsiChange}
              placeholder="Low Threshold"
              min="10"
              max="40"
              className={numberInputClass}
            />
            <input
              type="number"
              name="highThreshold"
              value={rsiParams.highThreshold}
              onChange={handleRsiChange}
              placeholder="High Threshold"
              min="60"
              max="90"
              className={numberInputClass}
            />
          </div>
        </div>
      )}

      <DateTimePickerCustom isMainPage={isMainPage} />
      <Button
        className={goButtonClass}
        onClick={handleStartBacktesting}
      >
        Start Backtesting
      </Button>
    </div>
  );
}
