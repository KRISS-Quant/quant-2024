"use client";

import { useSearchParams } from 'next/navigation';
import CandlestickChart from "@/components/candlestick-chart";

export default function CandlestickPage() {
  const searchParams = useSearchParams();
  const algorithm = searchParams.get('algorithm') || "SMA Golden Cross Strategy";
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <CandlestickChart algorithm = {algorithm} />
    </div>
  );
}