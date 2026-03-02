# Safe.101 — Shelters in the Republic of Cyprus

Static website for **safe.101.cy**: find civil defence shelters in the Republic of Cyprus using your GPS location or by searching for an address or point of interest.

## Features

- **Use my location** — Share your GPS position to see the nearest shelters on the map and in a list.
- **Search by address or place** — Geocoding via OpenStreetMap Nominatim (Cyprus); results show nearest shelters.
- **Map** — Leaflet map with CARTO light tiles; shelter markers and optional user/search location marker.
- **Official sources** — Links to Cyprus Civil Defence (Gov.cy, Ministry of Interior) and the official **SafeCY** mobile app (App Store & Google Play).

## Data

- Shelter data: `shelters_full_en.json` (English) from Cyprus Civil Defence.
- Geocoding: [Nominatim](https://nominatim.openstreetmap.org/) (OpenStreetMap).

## Run locally

Serve the project over HTTP (required for `fetch` and geolocation):

```bash
# Python 3
python3 -m http.server 8080

# Node (npx)
npx serve .

# Then open http://localhost:8080
```

## Official references

- [Civil Defence — Gov.cy](https://www.gov.cy/moi/en/civil-defense/)
- [Civil Defence Department — Ministry of Interior](https://www.moi.gov.cy/moi/cd/cd.nsf/home_en/home_en?openform)
- **SafeCY app**: [App Store](https://apps.apple.com/cy/app/safecy/id6746747464) · [Google Play](https://play.google.com/store/apps/details?id=com.moi.safecy)
- [SafeCY Privacy Policy](https://safecy.moi.gov.cy/data/privacypolicy.html)

*This site is not an official government site. For the official mobile experience, use the SafeCY app.*
