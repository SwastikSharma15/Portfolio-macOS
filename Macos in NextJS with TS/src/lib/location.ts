"use client"

export interface UserLocation {
  lat: number
  lon: number
  city: string
  region: string
  country: string
}

export interface WeatherInfo {
  city: string
  tempC: number
  tempF: number
  tempMaxC: number
  tempMinC: number
  tempMaxF: number
  tempMinF: number
  condition: string
  icon: string
  hourly: Array<{ time: string; temp: number; icon: string }>
  daily: Array<{ day: string; tempMax: number; tempMin: number; icon: string }>
}

const DEFAULT_LOCATION: UserLocation = {
  lat: 28.6139,
  lon: 77.209,
  city: "New Delhi",
  region: "Delhi",
  country: "India",
}

const weatherCodeMap: Record<number, { condition: string; icon: string }> = {
  0: { condition: "Clear Sky", icon: "☀️" },
  1: { condition: "Mainly Clear", icon: "🌤️" },
  2: { condition: "Partly Cloudy", icon: "⛅" },
  3: { condition: "Overcast", icon: "☁️" },
  45: { condition: "Foggy", icon: "🌫️" },
  48: { condition: "Depositing Rime Fog", icon: "🌫️" },
  51: { condition: "Light Drizzle", icon: "🌦️" },
  53: { condition: "Moderate Drizzle", icon: "🌧️" },
  55: { condition: "Dense Drizzle", icon: "🌧️" },
  61: { condition: "Slight Rain", icon: "🌧️" },
  63: { condition: "Moderate Rain", icon: "🌧️" },
  65: { condition: "Heavy Rain", icon: "🌧️" },
  71: { condition: "Slight Snow", icon: "❄️" },
  73: { condition: "Moderate Snow", icon: "❄️" },
  75: { condition: "Heavy Snow", icon: "❄️" },
  80: { condition: "Rain Showers", icon: "🌦️" },
  81: { condition: "Moderate Rain Showers", icon: "🌧️" },
  82: { condition: "Violent Rain Showers", icon: "⛈️" },
  95: { condition: "Thunderstorm", icon: "⛈️" },
}

export async function getUserLocation(): Promise<UserLocation> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      resolve(DEFAULT_LOCATION)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lon = pos.coords.longitude
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
          if (res.ok) {
            const data = await res.json()
            const addr = data.address || {}
            const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || "My Location"
            const region = addr.state || addr.region || ""
            const country = addr.country || ""
            resolve({ lat, lon, city, region, country })
            return
          }
        } catch (e) {
          console.error("Failed reverse geocoding:", e)
        }
        resolve({ lat, lon, city: "Current Location", region: "", country: "" })
      },
      (err) => {
        console.warn("Geolocation denied or error, fallback to default:", err)
        resolve(DEFAULT_LOCATION)
      },
      { timeout: 8000, maximumAge: 60000 }
    )
  })
}

export async function getWeatherForLocation(lat: number, lon: number, cityName: string): Promise<WeatherInfo> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      const current = data.current || {}
      const hourly = data.hourly || {}
      const daily = data.daily || {}

      const code = current.weather_code ?? 0
      const weatherInfo = weatherCodeMap[code] || { condition: "Clear", icon: "☀️" }
      const tempC = Math.round(current.temperature_2m ?? 24)
      const tempF = Math.round((tempC * 9) / 5 + 32)

      const tempMaxC = Math.round(daily.temperature_2m_max?.[0] ?? tempC + 4)
      const tempMinC = Math.round(daily.temperature_2m_min?.[0] ?? tempC - 4)

      const hourlyList = (hourly.time || []).slice(0, 6).map((t: string, idx: number) => {
        const dateObj = new Date(t)
        const hourLabel = idx === 0 ? "Now" : dateObj.toLocaleTimeString([], { hour: "numeric" })
        const hCode = hourly.weather_code?.[idx] ?? code
        const hTemp = Math.round(hourly.temperature_2m?.[idx] ?? tempC)
        return {
          time: hourLabel,
          temp: hTemp,
          icon: weatherCodeMap[hCode]?.icon || "☀️",
        }
      })

      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      const dailyList = (daily.time || []).slice(0, 5).map((t: string, idx: number) => {
        const dObj = new Date(t)
        const dLabel = idx === 0 ? "Today" : daysOfWeek[dObj.getDay()]
        const dCode = daily.weather_code?.[idx] ?? code
        return {
          day: dLabel,
          tempMax: Math.round(daily.temperature_2m_max?.[idx] ?? tempC + 3),
          tempMin: Math.round(daily.temperature_2m_min?.[idx] ?? tempC - 3),
          icon: weatherCodeMap[dCode]?.icon || "☀️",
        }
      })

      return {
        city: cityName,
        tempC,
        tempF,
        tempMaxC,
        tempMinC,
        tempMaxF: Math.round((tempMaxC * 9) / 5 + 32),
        tempMinF: Math.round((tempMinC * 9) / 5 + 32),
        condition: weatherInfo.condition,
        icon: weatherInfo.icon,
        hourly: hourlyList,
        daily: dailyList,
      }
    }
  } catch (e) {
    console.error("Failed fetching Open-Meteo weather:", e)
  }

  return {
    city: cityName || "New Delhi",
    tempC: 24,
    tempF: 75,
    tempMaxC: 28,
    tempMinC: 18,
    tempMaxF: 82,
    tempMinF: 64,
    condition: "Sunny",
    icon: "☀️",
    hourly: [
      { time: "Now", temp: 24, icon: "☀️" },
      { time: "1PM", temp: 25, icon: "☀️" },
      { time: "2PM", temp: 26, icon: "🌤️" },
      { time: "3PM", temp: 25, icon: "🌤️" },
      { time: "4PM", temp: 24, icon: "☀️" },
    ],
    daily: [
      { day: "Today", tempMax: 28, tempMin: 18, icon: "☀️" },
      { day: "Tue", tempMax: 29, tempMin: 19, icon: "☀️" },
      { day: "Wed", tempMax: 27, tempMin: 17, icon: "🌦️" },
      { day: "Thu", tempMax: 28, tempMin: 18, icon: "🌤️" },
      { day: "Fri", tempMax: 30, tempMin: 20, icon: "☀️" },
    ],
  }
}
