"use client"

import { useState, useEffect } from "react"
import { Search, Navigation, Loader2, MapPin } from "lucide-react"
import { getUserLocation, UserLocation } from "@/lib/location"

export function MapsApp() {
  const [location, setLocation] = useState<UserLocation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  const fetchCurrentLocation = async () => {
    setLoading(true)
    const loc = await getUserLocation()
    setLocation(loc)
    setLoading(false)
  }

  useEffect(() => {
    fetchCurrentLocation()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSearching(true)
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
      if (res.ok) {
        const results = await res.json()
        if (results && results.length > 0) {
          const first = results[0]
          setLocation({
            lat: parseFloat(first.lat),
            lon: parseFloat(first.lon),
            city: first.display_name.split(",")[0],
            region: first.display_name.split(",").slice(1, 3).join(","),
            country: "",
          })
        }
      }
    } catch (err) {
      console.error("Search error:", err)
    } finally {
      setSearching(false)
    }
  }

  const lat = location?.lat ?? 28.6139
  const lon = location?.lon ?? 77.209
  const cityName = location?.city || "Current Location"

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        html, body, #map { width: 100%; height: 100%; margin: 0; padding: 0; background: #e5e7eb; }
        .leaflet-container { width: 100%; height: 100%; }
        .custom-pin {
          background-color: #3b82f6;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 0 12px rgba(59,130,246,0.6);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 14px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false, tap: true, touchZoom: true, dragging: true }).setView([${lat}, ${lon}], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        var pinIcon = L.divIcon({
          className: 'custom-pin',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        L.marker([${lat}, ${lon}], { icon: pinIcon }).addTo(map).bindPopup("<b>${cityName}</b>").openPopup();
      </script>
    </body>
    </html>
  `

  return (
    <div className="h-full w-full bg-white flex flex-col pt-12 select-none relative">
      {/* Search Header */}
      <div className="px-4 pb-3 pt-1 border-b bg-white/95 backdrop-blur-md relative z-30 pointer-events-auto">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={loading ? "Locating your position..." : location?.city ? `Search near ${location.city}...` : "Search for a place or address"}
            className="w-full h-10 bg-gray-100/90 border border-gray-200 rounded-xl pl-10 pr-10 text-black placeholder-gray-500 outline-none text-sm focus:bg-white focus:border-blue-500 transition-all pointer-events-auto"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          {searching ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500 animate-spin" />
          ) : (
            searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center font-bold pointer-events-auto cursor-pointer"
              >
                ✕
              </button>
            )
          )}
        </form>
      </div>

      {/* Map View Area */}
      <div className="flex-1 relative bg-gray-100">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-20 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
            <span className="text-sm font-medium">Getting your location...</span>
          </div>
        ) : (
          <iframe
            key={`${lat}-${lon}`}
            title="Interactive Map"
            srcDoc={leafletHTML}
            className="w-full h-full border-0 pointer-events-auto"
          />
        )}

        {/* Floating Location Card */}
        {location && !loading && (
          <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-gray-200/60 flex items-center justify-between z-30 pointer-events-auto">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm text-gray-900 truncate">{location.city}</div>
                <div className="text-xs text-gray-500 truncate">{location.region || location.country || "Current Location"}</div>
              </div>
            </div>
            <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full flex-shrink-0">
              Live GPS
            </span>
          </div>
        )}

        {/* Locate Me Button */}
        <div className="absolute bottom-8 right-4 z-30 pointer-events-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              fetchCurrentLocation()
            }}
            className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-gray-200/80 flex items-center justify-center text-blue-500 active:scale-90 transition-all cursor-pointer pointer-events-auto"
            title="Locate Me"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Navigation className="h-5 w-5 fill-blue-500" />}
          </button>
        </div>
      </div>
    </div>
  )
}
