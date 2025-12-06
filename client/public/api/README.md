# Radio Stations JSON API

A free, open-source JSON API providing access to Islamic radio station streaming URLs and metadata.

## Overview

This API serves as a centralized repository for Islamic radio stations, including Quran recitations, tafsir (interpretation), and Islamic content. All data is provided in JSON format and can be easily integrated into web applications, mobile apps, or streaming clients.

## API Endpoints

### Get All Stations

**Endpoint:** `GET /api/stations.json`

**Description:** Returns a complete list of all available radio stations with their streaming URLs and metadata.

**Response Format:**

```json
{
  "status": "success",
  "version": "1.0.0",
  "timestamp": "2025-12-06T16:15:00Z",
  "total": 4,
  "stations": [
    {
      "id": 1,
      "name": "Station Name",
      "nameAr": "اسم المحطة",
      "description": "Station description",
      "country": "Country",
      "language": "Language",
      "genre": ["Genre1", "Genre2"],
      "streamUrl": "https://stream.example.com/url",
      "streamFormat": "mp3",
      "bitrate": "128",
      "website": "https://station.example.com",
      "status": "active",
      "lastChecked": "2025-12-06T16:15:00Z"
    }
  ],
  "metadata": {
    "apiVersion": "1.0.0",
    "updateFrequency": "weekly"
  }
}
```

## Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unique identifier for the station |
| `name` | string | Station name in English |
| `nameAr` | string | Station name in Arabic |
| `description` | string | Brief description of the station's content |
| `country` | string | Country or region of origin |
| `language` | string | Primary broadcast language |
| `genre` | array | Content categories (e.g., "Quran", "Tafsir", "Islamic") |
| `streamUrl` | string | Direct URL to the audio stream |
| `streamFormat` | string | Audio format (e.g., "mp3", "aac", "unknown") |
| `bitrate` | string | Stream bitrate in kbps (if known) |
| `website` | string | Official website URL |
| `status` | string | Current status ("active", "inactive", "testing") |
| `lastChecked` | string | ISO 8601 timestamp of last verification |

## Usage Examples

### JavaScript/Fetch

```javascript
// Fetch all stations
fetch('/api/stations.json')
  .then(response => response.json())
  .then(data => {
    console.log(`Found ${data.total} stations`);
    data.stations.forEach(station => {
      console.log(`${station.name}: ${station.streamUrl}`);
    });
  })
  .catch(error => console.error('Error:', error));
```

### Python

```python
import requests
import json

response = requests.get('https://your-domain.com/api/stations.json')
data = response.json()

for station in data['stations']:
    print(f"{station['name']}: {station['streamUrl']}")
```

### cURL

```bash
curl https://your-domain.com/api/stations.json | jq '.stations[] | {name, streamUrl}'
```

## Available Stations

The API currently provides access to the following Islamic radio stations:

1. **Holy Quran Radio Cairo** - Direct streaming from Egypt with high-quality Quran recitations
2. **Quran Radio Tafsir** - Quran recitations with scholarly interpretation
3. **Islam2Day Radio Channel 1** - Islamic content and Quran recitations
4. **VosCast Station** - Islamic audio content via VosCast platform

## CORS Support

The API supports Cross-Origin Resource Sharing (CORS), allowing requests from any domain. This enables seamless integration into web applications.

## Rate Limiting

No rate limiting is currently enforced. However, we recommend implementing reasonable caching on the client side to reduce server load.

## Data Format

All responses are provided in UTF-8 encoded JSON format. Timestamps follow the ISO 8601 standard.

## Error Handling

In case of errors, the API returns appropriate HTTP status codes:

- **200 OK** - Request successful
- **404 Not Found** - Endpoint or resource not found
- **500 Internal Server Error** - Server-side error

## Integration with Streaming Clients

The `streamUrl` field can be directly used with:

- HTML5 `<audio>` elements
- Media player libraries (e.g., Plyr, Video.js, HLS.js)
- Streaming applications (e.g., VLC, Kodi)
- Custom radio player applications

## Example HTML5 Audio Player

```html
<audio controls>
  <source src="STREAM_URL_FROM_API" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>
```

## License

This API and its data are provided under the Creative Commons Zero (CC0-1.0) license, allowing free use, modification, and distribution without attribution requirements.

## Contributing

To add new radio stations or update existing information, please submit a pull request to the GitHub repository.

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

## Disclaimer

This API provides links to third-party streaming services. The maintainers are not responsible for the availability, content, or legality of external streams. Users are responsible for ensuring their use complies with applicable laws and terms of service.

## Version History

- **v1.0.0** (2025-12-06) - Initial release with 4 Islamic radio stations
