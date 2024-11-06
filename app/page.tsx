import ParticleGraph from "@/components/ParticleGraph";

export default function Home() {
  return (
    <div
      className="flex h-screen"
      style={{
        color: "var(--text-base)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full p-8">
        <div className="flex flex-col items-center justify-center md:items-center md:justify-center md:col-span-5">
          <h1 className="text-6xl font-bold">KRISS QUANT</h1>
          <h1 className="text-6xl font-bold mb-5">BackTesting</h1>
          <h3 className="text-xl text-center md:text-left mb-5">
            View predictive model of real-time stock chart
          </h3>
          {/* Put parameter selection component below */}
          <div className="w-[500px] h-[500px] border-2"></div>
        </div>
        <div className="hidden md:flex justify-start items-start md:col-span-7">
          <ParticleGraph />
        </div>
      </div>
    </div>
  );
}
