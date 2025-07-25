import { WeatherForm } from "@/components/weather-form";
import { RequestForm } from "@/components/request-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Weather System
          </h1>
          <p className="text-muted-foreground text-lg">
            Submit weather requests and retrieve stored results
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 items-start">
          {/* Weather Form Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Submit Weather Request
            </h2>
            <div className="flex flex-col items-stretch">
              <WeatherForm />
            </div>
          </div>

          {/* Data Lookup Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Lookup Weather Data
            </h2>
            <div className="flex flex-col items-stretch">
              <RequestForm />
            </div>
          </div>
        </div>

      </div>
    </div>

  );
}
