## 🔗 Public base URLs

- **Repository:** 
  `https://github.com/uthumany/radio-api`

- **Base raw API (v1):** 
  `https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api`

- **Base raw API (v2):** 
  `https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/v2`

***

## 🌐 Public endpoints (v2)

- All stations (multi-quality, fastest-ready):

```txt
GET https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/v2/radio.json
```

- Single station by ID:

```txt
GET https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/v2/stations/{id}.json
```

Example:
```txt
GET https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/v2/stations/1.json
```

- Single station by slug:

```txt
GET https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/v2/stations/holy-quran-radio-cairo.json
```

- Background sounds catalog:

```txt
GET https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/v2/background-sounds.json
```

- Background sounds per station:

```txt
GET https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/v2/station-backgrounds.json
```

- Latency/uptime health snapshot:

```txt
GET https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/v2/health.json
```


🔁 Backward-compatible v1 endpoint

- Current v1 stations (single quality):

```txt
GET https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/stations.json
```
