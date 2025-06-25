from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uvicorn
import uuid
import httpx

app = FastAPI(title="Weather Data System", version="1.0.0")
API_KEY = "66e1de381f4e59ca5c4568d28d5b90c6"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for weather data
weather_storage: Dict[str, Dict[str, Any]] = {}

class WeatherRequest(BaseModel):
    date: str
    location: str
    notes: Optional[str] = ""

class WeatherResponse(BaseModel):
    id: str

async def get_weather(location: str, date: str) -> dict:
    url = "http://api.weatherstack.com/historical"
    params = {
        "access_key": API_KEY,
        "query": location,
        "historical_date": date,
        "hourly": 1,
        "interval": 24
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()

        if "error" in data:
            raise ValueError(data["error"]["info"])

        return data

@app.post("/weather", response_model=WeatherResponse)
async def create_weather_request(request: WeatherRequest):
    """
    You need to implement this endpoint to handle the following:
    1. Receive form data (date, location, notes)
    2. Calls WeatherStack API for the location
    3. Stores combined data with unique ID in memory
    4. Returns the ID to frontend
    """
    try:
        weather_data = await get_weather(request.location, request.date)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    weather_id = str(uuid.uuid4())
    weather_storage[weather_id] = {
        "id": weather_id,
        "date": request.date,
        "location": request.location,
        "notes": request.notes,
        "weather": weather_data
    }

    return WeatherResponse(id=weather_id)


@app.get("/weather/{weather_id}")
async def get_weather_data(weather_id: str):
    """
    Retrieve stored weather data by ID.
    This endpoint is already implemented for the assessment.
    """
    if weather_id not in weather_storage:
        raise HTTPException(status_code=404, detail="Weather data not found")
    
    return weather_storage[weather_id]


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)