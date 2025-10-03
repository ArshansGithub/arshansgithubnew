# iMessage Chat SVG Generator 💬

A fully configurable, animated iMessage-style chat SVG generator. Perfect for GitHub profiles, personal websites, or any creative use.

[![](https://raw.githubusercontent.com/jasonlong/jasonlong/main/chat.svg)](https://bsky.app/profile/jasonlong.me)

## ✨ Features

- **🎨 Fully Configurable**: Customize messages, timing, colors, and behavior via a single config file
- **⚡ Dynamic Data**: Automatically fetch and display weather, work duration, and current day
- **🎭 Authentic iMessage Look**: Maintains the classic iMessage bubble design with light/dark mode support
- **🎬 Smooth Animations**: Typing indicators and message slide-ins with configurable timing
- **🖱️ Interactive**: Click to pause/resume animations, clickable messages, hover effects
- **📱 Responsive**: Scales beautifully at any size
- **🌙 Dark Mode**: Automatic dark mode support via CSS media queries

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd arshansgithubnew
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your chat**
   
   Edit `config.js` to customize your messages, personal info, and styling:
   ```javascript
   export default {
     personal: {
       name: 'Your Name',
       location: {
         city: 'Your City',
         state: 'Your State',
       },
       // ... more config
     },
     messages: [
       {
         id: 'greeting',
         text: "Hi, I'm {{name}}",
         // ... message config
       },
       // ... more messages
     ],
   }
   ```

4. **Generate your SVG**
   ```bash
   node build-svg.js
   ```

   Your animated chat SVG will be created at `chat.svg`!

## 📝 Configuration Guide

### Personal Information

```javascript
personal: {
  name: 'Jason',
  location: {
    city: 'Columbus',
    state: 'Ohio',
    locationKey: '18363_PC', // AccuWeather location key
  },
  work: {
    currentCompany: 'PlanetScale',
    currentRole: 'product designer',
    previousCompany: 'GitHub',
    startDate: '2020-12-14', // Format: YYYY-MM-DD
  },
  social: {
    platform: 'Bluesky',
    url: 'https://bsky.app/profile/jasonlong.me',
  },
}
```

### Messages

Each message can be single or multi-line with template variables:

```javascript
messages: [
  {
    id: 'greeting',
    text: "Hi, I'm {{name}}", // Single line
    lines: 1,
    width: 150,
    height: 42,
    clickable: false,
  },
  {
    id: 'location_weather',
    text: [
      "I live in {{location.city}}, {{location.state}} where it's supposed to be",
      "{{weather.temp_f}}° F ({{weather.temp_c}}° C) and {{weather.emoji}} today."
    ],
    lines: 2,
    width: 430,
    height: 65,
    usesWeather: true, // Fetches real weather data
  },
  {
    id: 'social_link',
    text: [
      "Find me at",
      "{{social.url}}"
    ],
    clickable: true,
    clickUrl: '{{social.url}}',
    linkLine: 1, // Makes line 2 clickable
  }
]
```

### Template Variables

Available template variables:
- `{{name}}` - Your name
- `{{location.city}}` - Your city
- `{{location.state}}` - Your state
- `{{weather.temp_f}}` - Temperature in Fahrenheit
- `{{weather.temp_c}}` - Temperature in Celsius
- `{{weather.emoji}}` - Weather emoji
- `{{work.role}}` - Your current role
- `{{work.current}}` - Current company
- `{{work.previous}}` - Previous company
- `{{work.duration}}` - Time at current company (auto-calculated)
- `{{social.platform}}` - Social platform name
- `{{social.url}}` - Social profile URL
- `{{day}}` - Current day of week

### Animation Settings

```javascript
animation: {
  enabled: true,
  showTypingIndicator: true,
  typingDuration: 1.5, // seconds
  typingDelay: 0.7,
  messageSlideInDuration: 0.2,
  pauseOnClick: true, // Click SVG to pause/resume
  loop: false,
}
```

### Styling

```javascript
styling: {
  // Light mode
  bubbleColor: '#e9e9eb',
  textColor: '#242424',
  linkColor: '#0079ff',
  
  // Dark mode
  bubbleColorDark: '#3b3b3d',
  textColorDark: '#dcdcdc',
  linkColorDark: '#0c82f9',
  
  // Typography
  fontSize: 18,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  
  // Bubble
  bubbleRadius: 18,
  messageSpacing: 6,
  
  // Interactions
  enableHover: true,
  hoverOpacity: 0.8,
}
```

### Interactive Features

```javascript
interactive: {
  pauseControl: true,        // Click to pause/play animation
  enableMessageClicks: true, // Enable clickable messages
  hoverEffects: true,        // Show hover effects on messages
}
```

### Weather API Setup

To enable weather data:

1. Sign up for a free [AccuWeather API key](https://developer.accuweather.com/)
2. Find your location key at [AccuWeather](https://www.accuweather.com/)
3. Set your API key as an environment variable:
   ```bash
   export WEATHER_API_KEY=your_api_key_here
   node build-svg.js
   ```

Or disable weather:
```javascript
weather: {
  enabled: false,
}
```

## 🎨 Example Configs

Check the `examples/` directory for pre-made configurations:

- **`config-minimal.js`** - Simple 3-message chat
- **`config-portfolio.js`** - Portfolio/resume style
- **`config-fun.js`** - Playful configuration with emojis

## 🛠️ Advanced Usage

### Custom Message Layouts

Control message width and height precisely:

```javascript
{
  id: 'custom',
  text: "Your message",
  autoWidth: false,  // Disable auto-width
  width: 300,        // Custom width
  height: 42,        // Custom height
}
```

### Disable Animations

For a static SVG:

```javascript
animation: {
  enabled: false,
  showTypingIndicator: false,
}
```

### Custom Color Schemes

Create your own color theme:

```javascript
styling: {
  bubbleColor: '#FFE5E5',      // Light pink
  textColor: '#1A1A1A',
  linkColor: '#FF6B6B',
  
  bubbleColorDark: '#2C1B1B',
  textColorDark: '#FFE5E5',
  linkColorDark: '#FF8989',
}
```

## 📊 Output

The generator creates a self-contained SVG file with:
- ✅ Embedded CSS and animations
- ✅ No external dependencies
- ✅ Works anywhere (GitHub, websites, etc.)
- ✅ Automatic dark mode support
- ✅ Interactive features (if enabled)

## 🔧 Troubleshooting

**Weather not working?**
- Ensure `WEATHER_API_KEY` environment variable is set
- Check that `locationKey` is correct
- Weather will fallback to default values if API fails

**Messages overlapping?**
- Adjust `height` values in message config
- Increase `messageSpacing` in styling config

**Animations not smooth?**
- Adjust timing values in `animation` config
- Try increasing `typingDelay` for better pacing

## 📦 Dependencies

- `got` - HTTP requests for weather API
- `js-quantities` - Temperature unit conversion
- `date-fns` - Date formatting for work duration

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - see LICENSE file for details

## 💡 Tips

1. **Test locally first**: Open the generated SVG in a browser to preview
2. **Optimize messages**: Keep text concise for better mobile viewing
3. **Use emojis**: They render beautifully in SVG with the emoji class
4. **Experiment with timing**: Adjust animation timings to match your style
5. **Version control**: Keep multiple config files for different purposes

## 🌟 Showcase

Using this project? Share your creation! Open a PR to add your profile to the showcase.

---

Made with ❤️ by the community
