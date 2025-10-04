# Open-Meteo Migration Guide

## What Changed

The weather integration has been migrated from **AccuWeather** to **Open-Meteo**.

### Benefits
- ✅ **No API key required** - Open-Meteo is free and doesn't require authentication
- ✅ **Better coverage** - Works worldwide with high-quality data
- ✅ **More weather codes** - Supports WMO standard weather codes with detailed conditions

## Configuration Changes

### Before (AccuWeather)
```javascript
personal: {
  location: {
    city: 'Columbus',
    state: 'Ohio',
    locationKey: '18363_PC', // AccuWeather location key
  },
}

weather: {
  enabled: true,
  apiKey: process.env.WEATHER_API_KEY || '',
  provider: 'accuweather',
}
```

### After (Open-Meteo)
```javascript
personal: {
  location: {
    city: 'San Diego',
    state: 'California',
    latitude: '32.7157',   // Decimal degrees
    longitude: '-117.1611', // Decimal degrees
  },
}

weather: {
  enabled: true,
  provider: 'open-meteo', // No API key needed!
}
```

## How to Find Your Coordinates

1. Go to [Google Maps](https://maps.google.com)
2. Right-click on your location
3. Click the coordinates to copy them
4. Format: `latitude, longitude` (e.g., `32.7157, -117.1611`)

Or use [Open-Meteo's search](https://open-meteo.com/) to find your city.

## Weather Emoji Mapping

Open-Meteo uses **WMO Weather Interpretation Codes**. The mapping is now in `build-svg.js`:

| Code | Condition | Emoji |
|------|-----------|-------|
| 0 | Clear sky | ☀️ |
| 1 | Mainly clear | 🌤️ |
| 2 | Partly cloudy | 🌥️ |
| 3 | Overcast | ☁️ |
| 45, 48 | Fog | 🌫️ |
| 61-65 | Rain | 🌧️ |
| 71-77 | Snow | ❄️/🌨️/☃️ |
| 95-99 | Thunderstorm | ⛈️ |

Full mapping available in `build-svg.js` lines 12-43.

## API Details

**Endpoint**: `https://api.open-meteo.com/v1/forecast`

**Parameters**:
- `latitude` - Decimal degrees
- `longitude` - Decimal degrees  
- `daily=weather_code,temperature_2m_max` - Daily forecast data
- `temperature_unit=fahrenheit` - Temperature unit
- `timezone=auto` - Automatic timezone detection

**Documentation**: https://open-meteo.com/en/docs

## Removed from config.js

The `weatherEmojis` mapping object has been removed from `config.js` since WMO codes are now handled directly in `build-svg.js`.
