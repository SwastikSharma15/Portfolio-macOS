"use client"

import { Widget } from "./widget"
import { useState, useEffect } from "react"

export function Weather() {
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=Cupertino&appid=YOUR_API_KEY&units=imperial",
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setWeatherData(data)
      } catch (error) {
        console.error("Error fetching weather data:", error)
      }
    }

    fetchWeatherData()
  }, [])

  const content = (
    <div className="flex flex-col items-center text-white">
      {weatherData ? (
        <>
          <div className="text-lg">{weatherData.name}</div>
          <div className="text-7xl font-thin my-2">{Math.round(weatherData.main.temp)}°</div>
          <div className="text-xl mb-1 flex items-center gap-2">
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />{" "}
            {weatherData.weather[0].description}
          </div>
          <div className="text-sm">
            H:{Math.round(weatherData.main.temp_max)}° L:
            {Math.round(weatherData.main.temp_min)}°
          </div>
          <div className="w-full mt-12 space-y-4">
            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-sm font-medium mb-2">HOURLY FORECAST</div>
              <div className="flex justify-between">
                {["Now", "11AM", "12PM", "1PM", "2PM"].map((time, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="text-sm">{time}</div>
                    <div className="text-2xl my-1">☀️</div>
                    <div className="text-sm">{Math.round(weatherData.main.temp + i)}°</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/20 rounded-xl p-4">
              <div className="text-sm font-medium mb-2">10-DAY FORECAST</div>
              <div className="space-y-3">
                {["Today", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="w-16 text-sm">{day}</div>
                    <div className="text-xl">☀️</div>
                    <div className="flex gap-2">
                      <span className="text-sm">{Math.round(weatherData.main.temp_min + i)}°</span>
                      <span className="text-sm text-white/70">{Math.round(weatherData.main.temp_max + i)}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )

  return <Widget title="Weather" content={content} className="bg-gradient-to-br from-blue-400 to-blue-600" />
}
