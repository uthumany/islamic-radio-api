# Radio Stations JSON API

A free, open-source JSON API providing direct access to Islamic radio station streaming URLs and comprehensive metadata. Perfect for integrating live radio streams into web applications, mobile apps, and custom streaming clients.

## 📱 API Endpoints

### Primary JSON API Endpoint

**Get All Radio Stations:**
```
https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/stations.json
```

This endpoint returns a complete JSON array of all available radio stations with their streaming URLs and metadata.

---

## 📋 Available Radio Stations

The API provides access to the following four Islamic radio stations:

| # | Station Name | Country | Stream Format | Genre |
|---|---|---|---|---|
| 1 | Holy Quran Radio Cairo | Egypt | MP3 | Quran, Islamic |
| 2 | Quran Radio Tafsir | Multiple | Unknown | Quran, Tafsir, Religious |
| 3 | Islam2Day Radio Channel 1 | Egypt | Unknown | Quran, Islamic |
| 4 | VosCast Station | Multiple | Unknown | Islamic Audio |

---

## 🔗 Direct Stream URLs

You can use these URLs directly in any audio player or streaming application:

1. **Holy Quran Radio Cairo**: `https://stream.radiojar.com/8s5u5tpdtwzuv`
2. **Quran Radio Tafsir**: `http://66.45.232.131:9992/`
3. **Islam2Day Radio Channel 1**: `http://islam2day.tv:3000/`
4. **VosCast Station**: `http://station.voscast.com/5a1b3c82d8b3f/`

---

## 📚 Documentation

**Full API Documentation:**
```
https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/README.md
```

This includes:
- Complete field descriptions
- Response format specifications
- Usage examples in JavaScript, Python, and cURL
- Integration patterns for React, Vue.js, and other frameworks
- Error handling guidelines

---

## 💻 Quick Integration Examples

### JavaScript/Fetch

```javascript
fetch('https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/stations.json')
  .then(response => response.json())
  .then(data => {
    console.log(`Found ${data.total} stations`);
    data.stations.forEach(station => {
      console.log(`${station.name}: ${station.streamUrl}`);
    });
  })
  .catch(error => console.error('Error:', error));
```

### HTML5 Audio Player

```html
<audio controls>
  <source src="https://stream.radiojar.com/8s5u5tpdtwzuv" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>
```

### Python

```python
import requests

response = requests.get('https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/stations.json')
data = response.json()

for station in data['stations']:
    print(f"{station['name']}: {station['streamUrl']}")
```

### cURL

```bash
curl https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/stations.json | jq '.stations[] | {name, streamUrl}'
```

---

## 🌐 GitHub Repository

**Repository URL:**
```
https://github.com/uthumany/radio-api
```

**Repository Features:**
- Public repository with full source code
- Comprehensive README with examples
- MIT-compatible project structure
- Ready for contributions and forks
- All files tracked in Git with commit history

---

## 📋 JSON Response Structure

The API returns data in the following format:

```json
{
  "status": "success",
  "version": "1.0.0",
  "timestamp": "2025-12-06T16:15:00Z",
  "total": 4,
  "stations": [
    {
      "id": 1,
      "name": "Holy Quran Radio Cairo",
      "nameAr": "إذاعة القرآن الكريم من القاهرة",
      "description": "Live Quran recitations from Cairo, Egypt",
      "country": "Egypt",
      "language": "Arabic",
      "genre": ["Quran", "Islamic", "Religious"],
      "streamUrl": "https://stream.radiojar.com/8s5u5tpdtwzuv",
      "streamFormat": "mp3",
      "bitrate": "128",
      "website": "https://www.holyquranradio.com/",
      "status": "active",
      "lastChecked": "2025-12-06T16:15:00Z"
    }
  ],
  "metadata": {
    "apiVersion": "1.0.0",
    "updateFrequency": "weekly",
    "license": "CC0-1.0"
  }
}
```

---

## 🚀 Deployment & Hosting

The API is currently hosted on **GitHub's raw content delivery network**, which provides:

- ✅ **Free hosting** - No cost, no limits
- ✅ **High availability** - Global CDN distribution
- ✅ **CORS enabled** - Works from any web domain
- ✅ **Fast delivery** - Cached globally for performance
- ✅ **No authentication** - Direct access to JSON data
- ✅ **Version control** - Full Git history and rollback capability

### Alternative Hosting Options

If you want to set up GitHub Pages or other hosting platforms, you can:

1. **GitHub Pages** - Enable in repository settings (Settings → Pages → Source: main branch)
2. **Netlify** - Connect repository for automatic deployments
3. **Vercel** - Deploy with zero configuration
4. **Cloudflare Pages** - Global CDN with automatic deployments
5. **Firebase Hosting** - Google's static hosting service

---

## 🔄 How to Update the API

To add new radio stations or update existing ones:

1. Clone the repository:
   ```bash
   git clone https://github.com/uthumany/radio-api.git
   cd radio-api
   ```

2. Edit the stations file:
   ```bash
   nano client/public/api/stations.json
   ```

3. Add or modify station entries following the existing format

4. Commit and push changes:
   ```bash
   git add client/public/api/stations.json
   git commit -m "Add new radio station: [Station Name]"
   git push origin main
   ```

5. Changes will be live within seconds

---

## ⚠️ License & Usage Rights

This API is provided under the **Creative Commons Zero (CC0-1.0)** license, which means:

- ✅ Free to use for any purpose (commercial or personal)
- ✅ No attribution required
- ✅ Can be modified and redistributed
- ✅ No warranty or liability

---

## 📞 Support & Contributions

- **GitHub Issues**: Report bugs or request features at https://github.com/uthumany/radio-api/issues
- **Contributions**: Pull requests are welcome! Please verify streams work before submitting
- **Documentation**: Check `/api/README.md` for detailed API documentation

---

## 🎯 Next Steps

1. **Test the API** - Use the endpoints above to fetch and play radio streams
2. **Integrate into your app** - Use the code examples provided
3. **Share with others** - Fork the repository and contribute new stations
4. **Monitor availability** - Keep an eye on stream URLs and report dead links

---

## 📋 API Statistics

- **Total Stations**: 4
- **API Version**: 1.0.0
- **Last Updated**: 2025-12-06
- **Response Format**: JSON
- **CORS Support**: Yes
- **Rate Limiting**: None
- **Authentication**: Not required

---

## 🔐 Important Notes

- This API provides links to third-party streaming services
- Stream availability depends on the external providers
- Users are responsible for ensuring compliance with applicable laws and terms of service
- The maintainers are not responsible for stream uptime or content
