import ParticleGraph from "@/components/particle-graph";
import { ParameterSelectionComponent } from "@/components/parameter-selection-component";

export default function Home() {
  return (
    <div className="flex h-screen">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full p-8">
        <div className="flex flex-col items-center justify-center md:items-center md:justify-center md:col-span-5">
          <h1 className="text-6xl font-bold mb-1 font-jomolhari">
            KRISS QUANT
          </h1>
          <h1 className="text-6xl font-bold mb-8 font-jomolhari">
            Backtesting
          </h1>
          <h3 className="text-xl text-center md:text-left mb-8 font-jomolhari">
            View predictive model of real-time stock chart
          </h3>
          {/* Put parameter selection component below */}
          <ParameterSelectionComponent isMainPage={true} />
        </div>
        <div className="md:flex justify-start items-start md:col-span-7">
          <ParticleGraph />
        </div>
      </div>
    </div>
  );
}
