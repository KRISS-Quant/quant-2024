import ParticleGraph from "@/components/ParticleGraph";

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full p-8 font-jomolhari">
        <div className="flex flex-col items-center justify-center md:items-center md:justify-center md:col-span-5">
          <h1 className="text-6xl font-bold mb-1">KRISS QUANT</h1>
          <h1 className="text-6xl font-bold mb-8">Backtesting</h1>
          <h3 className="text-xl text-center md:text-left mb-8">
            View predictive model of real-time stock chart
          </h3>
          {/* Put parameter selection component below */}
          <div className="w-[400px] h-[400px] border-2"></div>
        </div>
        <div className="md:flex justify-start items-start md:col-span-7">
          <ParticleGraph />
        </div>
      </div>
    </div>
  );
}
