"use client"

export interface UserLocation {
  lat: number
  lon: number
  city: string
  region: string
  country: string
}

const DEFAULT_LOCATION: UserLocation = {
  lat: 28.6139,
  lon: 77.209,
  city: "New Delhi",
  region: "Delhi",
  country: "India",
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
