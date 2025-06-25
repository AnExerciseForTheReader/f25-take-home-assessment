"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function RequestForm() {
  const [weatherId, setWeatherId] = useState("");
  const [weatherData, setWeatherData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    if (!weatherId.trim()) {
      setError("Please enter a weather data ID.");
      setWeatherData(null);
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const response = await fetch(`http://localhost:8000/weather/${weatherId}`);

      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
      } else {
        const err = await response.json();
        setError(err.detail || "Failed to retrieve weather data.");
      }
    } catch {
      setError("Network error: Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Weather Data Lookup</CardTitle>
        <CardDescription>
          Enter your weather data ID to retrieve stored information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="weather-id">Weather ID</Label>
          <Input
            id="weather-id"
            placeholder="Enter UUID here"
            value={weatherId}
            onChange={(e) => setWeatherId(e.target.value)}
          />
        </div>

        <Button onClick={handleFetch} disabled={loading} className="w-full">
          {loading ? "Fetching..." : "Fetch Weather Data"}
        </Button>

        {error && (
          <div className="bg-red-900/20 text-red-500 border border-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {weatherData && (
          <div className="bg-green-900/10 text-green-700 border border-green-500 p-4 rounded-md space-y-1 text-sm">
            <p>
              <strong>Date:</strong> {weatherData.date}
            </p>
            <p>
              <strong>Location:</strong> {weatherData.location}
            </p>
            {weatherData.notes && (
              <p>
                <strong>Notes:</strong> {weatherData.notes}
              </p>
            )}
            {weatherData.weather && weatherData.weather.current && (
                <div className="mt-2 flex items-center space-x-3">
                    <img
                    src={weatherData.weather.current.weather_icons[0]}
                    alt={weatherData.weather.current.weather_descriptions[0]}
                    width={40}
                    height={40}
                    className="inline-block"
                    />
                    <div>
                    <p>
                        <strong>Temperature:</strong> {weatherData.weather.current.temperature}°C
                    </p>
                    <p>
                        <strong>Conditions:</strong> {weatherData.weather.current.weather_descriptions.join(", ")}
                    </p>
                    <p>
                        <strong>Humidity:</strong> {weatherData.weather.current.humidity}%
                    </p>
                    </div>
                </div>
                )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
