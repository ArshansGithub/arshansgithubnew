# Quick Start Guide 🚀

Get your custom iMessage chat SVG up and running in minutes!

## Installation

```bash
npm install
```

## Basic Usage

### 1. Generate with Default Config

```bash
node build-svg.js
```

This creates `chat.svg` using the configuration in `config.js`.

### 2. Customize Your Chat

Open `config.js` and modify:

**Personal Info:**
```javascript
personal: {
  name: 'Your Name',
  location: {
    city: 'Your City',
    state: 'Your State',
  },
  work: {
    currentCompany: 'Your Company',
    currentRole: 'your role',
    startDate: '2023-01-15', // YYYY-MM-DD
  },
  social: {
    platform: 'Twitter',
    url: 'https://twitter.com/yourhandle',
  },
}
```

**Messages:**
```javascript
messages: [
  {
    id: 'greeting',
    text: "Hey! I'm {{name}} 👋",
    width: 180,
    height: 42,
    clickable: false,
  },
  // Add more messages...
]
```

### 3. Regenerate

```bash
node build-svg.js
```

## Template Variables

Use these in your message text:

- `{{name}}` - Your name
- `{{location.city}}` - City
- `{{location.state}}` - State
- `{{work.current}}` - Current company
- `{{work.role}}` - Current role
- `{{work.duration}}` - Time at company (auto-calculated!)
- `{{social.platform}}` - Social platform
- `{{social.url}}` - Social URL
- `{{day}}` - Current day of week
- `{{weather.temp_f}}` - Temperature in F (if weather enabled)
- `{{weather.temp_c}}` - Temperature in C (if weather enabled)
- `{{weather.emoji}}` - Weather emoji (if weather enabled)

## Examples

### Try Pre-made Configs

We've included example configurations:

**Minimal (3 messages):**
```bash
cp examples/config-minimal.js config.js
node build-svg.js
```

**Portfolio:**
```bash
cp examples/config-portfolio.js config.js
node build-svg.js
```

**Fun:**
```bash
cp examples/config-fun.js config.js
node build-svg.js
```

## Common Customizations

### Change Colors

```javascript
styling: {
  bubbleColor: '#FFE5E5',     // Pink bubbles
  textColor: '#1A1A1A',
  linkColor: '#FF6B6B',
}
```

### Adjust Animation Speed

```javascript
animation: {
  typingDuration: 1.0,        // Faster typing (default: 1.5)
  typingDelay: 0.5,           // Quicker delays (default: 0.7)
}
```

### Disable Animations

```javascript
animation: {
  enabled: false,
  showTypingIndicator: false,
}
```

### Add Clickable Messages

```javascript
{
  id: 'link',
  text: ["Check out my site:", "https://mysite.com"],
  width: 300,
  height: 65,
  clickable: true,
  clickUrl: 'https://mysite.com',
  linkLine: 1,  // Make line 2 clickable
}
```

## Interactive Features

The generated SVG includes:

✅ **Click to pause/play** - Click anywhere on the SVG to pause/resume animation
✅ **Hover effects** - Messages slightly fade on hover
✅ **Clickable links** - Messages can open URLs
✅ **Dark mode** - Automatic dark mode support

To disable interactive features:
```javascript
interactive: {
  pauseControl: false,
  enableMessageClicks: false,
  hoverEffects: false,
}
```

## Weather Setup (Optional)

1. Get a free API key from [AccuWeather](https://developer.accuweather.com/)
2. Find your location key at [AccuWeather.com](https://www.accuweather.com/)
3. Set environment variable:
   ```bash
   export WEATHER_API_KEY=your_key_here
   ```
4. Enable in config:
   ```javascript
   weather: {
     enabled: true,
     apiKey: process.env.WEATHER_API_KEY,
   },
   personal: {
     location: {
       locationKey: 'YOUR_LOCATION_KEY',
     }
   }
   ```

## Use in GitHub Profile

1. Generate your SVG: `node build-svg.js`
2. Commit `chat.svg` to your repository
3. Add to your README.md:
   ```markdown
   ![](https://raw.githubusercontent.com/username/repo/main/chat.svg)
   ```

Or make it clickable:
```markdown
[![](https://raw.githubusercontent.com/username/repo/main/chat.svg)](https://yoursite.com)
```

## Tips

- Keep messages concise for better mobile viewing
- Test locally by opening the SVG in a browser
- Use emojis to add personality!
- Experiment with animation timing to find your rhythm
- Keep a backup of your config before making major changes

## Troubleshooting

**SVG not animating?**
- Check that `animation.enabled` is `true`
- Open in a modern browser (Safari, Chrome, Firefox)

**Messages overlapping?**
- Increase `height` values in message configs
- Adjust `messageSpacing` in styling

**Weather not working?**
- Verify `WEATHER_API_KEY` environment variable is set
- Check `locationKey` is correct
- Weather will use fallback values if API fails

## Next Steps

Check out the full [README-NEW.md](README-NEW.md) for comprehensive documentation!

---

Happy chatting! 💬✨
