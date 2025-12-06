# Radio Stations JSON API

A free, open-source JSON API providing direct access to Islamic radio station streaming URLs and comprehensive metadata. Perfect for integrating live radio streams into web applications, mobile apps, and custom streaming clients.

## 🎙️ Features

- **Direct Stream URLs**: Get immediate access to live streaming endpoints without complex authentication
- **Comprehensive Metadata**: Station names (English & Arabic), descriptions, genres, and website links
- **CORS Enabled**: Seamless integration with web applications from any domain
- **JSON Format**: Simple, standardized data format for easy parsing and integration
- **Regularly Updated**: Stream URLs verified and updated on a weekly basis
- **Zero Dependencies**: Pure static JSON—no backend server required
- **Free & Open**: Creative Commons Zero license—use for any purpose

## 📡 Available Stations

The API currently provides access to four high-quality Islamic radio stations:

| Station | Country | Format | Genre |
|---------|---------|--------|-------|
| Holy Quran Radio Cairo | Egypt | MP3 | Quran, Islamic |
| Quran Radio Tafsir | Multiple | Unknown | Quran, Tafsir, Religious |
| Islam2Day Radio Channel 1 | Egypt | Unknown | Quran, Islamic |
| VosCast Station | Multiple | Unknown | Islamic Audio |

## 🚀 Quick Start

### Fetch All Stations

```javascript
fetch('/api/stations.json')
  .then(response => response.json())
  .then(data => console.log(data.stations));
```

### HTML5 Audio Player

```html
<audio controls>
  <source src="STREAM_URL_FROM_API" type="audio/mpeg">
</audio>
```

### Python Integration

```python
import requests

response = requests.get('https://your-domain.com/api/stations.json')
stations = response.json()['stations']

for station in stations:
    print(f"{station['name']}: {station['streamUrl']}")
```

## 📚 API Documentation

Full API documentation is available in `/api/README.md`, including:

- Complete endpoint specifications
- Field descriptions and data types
- Usage examples in multiple languages
- Error handling guidelines
- Integration patterns

## 🏗️ Project Structure

```
radio-api/
├── client/
│   └── public/
│       └── api/
│           ├── stations.json      # Main API data file
│           └── README.md          # API documentation
├── README.md                       # This file
└── .gitignore                      # Git configuration
```

## 💾 Data Format

All responses follow this structure:

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
      "streamUrl": "https://stream.example.com/url",
      "genre": ["Quran", "Islamic"],
      ...
    }
  ]
}
```

## 🔗 Integration Examples

### React Component

```jsx
import { useState, useEffect } from 'react';

export default function RadioPlayer() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetch('/api/stations.json')
      .then(r => r.json())
      .then(data => setStations(data.stations));
  }, []);

  return (
    <div>
      {stations.map(station => (
        <audio key={station.id} controls>
          <source src={station.streamUrl} type="audio/mpeg" />
        </audio>
      ))}
    </div>
  );
}
```

### Vue.js

```vue
<template>
  <div>
    <audio v-for="station in stations" :key="station.id" controls>
      <source :src="station.streamUrl" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script>
export default {
  data() {
    return { stations: [] };
  },
  mounted() {
    fetch('/api/stations.json')
      .then(r => r.json())
      .then(data => this.stations = data.stations);
  }
};
</script>
```

## 🌐 Hosting Options

This API can be hosted on any of these free platforms:

- **GitHub Pages** - Static hosting with custom domains
- **Netlify** - Continuous deployment from Git
- **Vercel** - Optimized for static content
- **Cloudflare Pages** - Global CDN with zero configuration
- **Firebase Hosting** - Google's static hosting service

## 📝 Adding New Stations

To contribute new radio stations:

1. Fork this repository
2. Edit `client/public/api/stations.json`
3. Add station details following the existing format
4. Submit a pull request with verification that streams are working

## ⚖️ License

This project is licensed under the Creative Commons Zero (CC0-1.0) license, which means:

- ✅ Use for any purpose (commercial or personal)
- ✅ Modify and redistribute
- ✅ No attribution required
- ✅ No warranty or liability

## 📋 Disclaimer

This API provides links to third-party streaming services. The maintainers are not responsible for:

- Stream availability or uptime
- Content accuracy or legality
- Terms of service compliance
- Copyright or licensing issues

Users are responsible for ensuring their use complies with applicable laws and the terms of service of each streaming provider.

## 🤝 Contributing

Contributions are welcome! Please:

1. Verify that stream URLs are working and stable
2. Provide accurate metadata
3. Follow the existing JSON format
4. Include any relevant documentation

## 📞 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Check existing documentation in `/api/README.md`
- Review the examples in this README

## 🔄 Version History

- **v1.0.0** (2025-12-06) - Initial release with 4 Islamic radio stations

---

**Last Updated**: 2025-12-06  
**API Version**: 1.0.0  
**Status**: Active
