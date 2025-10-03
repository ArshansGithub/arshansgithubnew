# Migration Guide: Old → New System

## What Changed?

Your iMessage chat SVG project has been **completely transformed** from hard-coded to fully configurable! 🎉

### Before ❌
- Hard-coded messages in `template.svg`
- Hard-coded personal info in `build-svg.js`
- Limited customization
- Manual SVG editing required

### After ✅
- Everything configured in `config.js`
- Dynamic SVG generation
- Template variables for dynamic data
- Interactive features (click to pause, hover effects)
- Multiple example configurations
- Comprehensive documentation

## New File Structure

```
arshansgithubnew/
├── config.js                 # ⭐ Main configuration file
├── build-svg.js              # ⭐ Completely rewritten generator
├── chat.svg                  # Generated output (auto-created)
├── README-NEW.md             # Full documentation
├── QUICKSTART.md             # Quick start guide
├── MIGRATION.md              # This file
├── examples/
│   ├── config-minimal.js     # Minimal example
│   ├── config-portfolio.js   # Portfolio example
│   └── config-fun.js         # Fun example
└── [old files]
    ├── template.svg          # ⚠️ No longer used
    ├── index.html            # Old demo
    └── README.md             # Old readme
```

## Key Features Added

### 1. **Configuration-Based** 🎨
Everything is now controlled via `config.js`:
- Messages and content
- Colors and styling
- Animation timing
- Interactive features
- Weather settings

### 2. **Template Variables** 📝
Use dynamic placeholders in your messages:
```javascript
text: "Hi, I'm {{name}} from {{location.city}}"
// Automatically replaced with your config values
```

### 3. **Interactive SVG** 🖱️
- **Click to pause/play**: Click anywhere on the SVG to pause/resume animation
- **Hover effects**: Messages fade slightly on hover
- **Clickable messages**: Messages can open URLs when clicked

### 4. **Better Animations** 🎬
- Configurable timing for typing indicators
- Smooth slide-in animations
- Automatic position calculations
- All timing values customizable

### 5. **Weather Integration** ☀️
- Automatic weather fetching from AccuWeather API
- Fallback values if API unavailable
- Easy to enable/disable

### 6. **Work Duration** 💼
- Automatically calculates how long you've been at your current job
- Updates every time you generate the SVG
- Uses human-readable format (e.g., "almost 5 years")

## How to Use the New System

### Step 1: Edit config.js
Open `config.js` and update your information:

```javascript
personal: {
  name: 'Your Name',           // Your name
  location: {
    city: 'Your City',
    state: 'Your State',
  },
  work: {
    currentCompany: 'Company',
    currentRole: 'role',
    startDate: '2023-01-15',   // When you started
  },
  social: {
    platform: 'Twitter',
    url: 'https://twitter.com/you',
  },
}
```

### Step 2: Customize Messages
Edit the `messages` array in `config.js`:

```javascript
messages: [
  {
    id: 'greeting',
    text: "Hi, I'm {{name}} 👋",
    width: 150,
    height: 42,
  },
  // Add more messages...
]
```

### Step 3: Generate
```bash
node build-svg.js
```

That's it! Your `chat.svg` is ready to use.

## Configuration Overview

### Canvas Settings
```javascript
canvas: {
  width: 550,
  height: 684,  // Auto-calculated if needed
}
```

### Animation Settings
```javascript
animation: {
  enabled: true,
  showTypingIndicator: true,
  typingDuration: 1.5,        // seconds
  pauseOnClick: true,
}
```

### Styling
```javascript
styling: {
  bubbleColor: '#e9e9eb',     // Light mode
  bubbleColorDark: '#3b3b3d', // Dark mode
  fontSize: 18,
  bubbleRadius: 18,           // Border radius
  messageSpacing: 6,          // Gap between messages
}
```

### Messages
```javascript
messages: [
  {
    id: 'unique_id',
    text: "Message with {{variables}}",
    // For multi-line:
    text: [
      "First line",
      "Second line"
    ],
    width: 300,
    height: 42,  // 42 for 1 line, 65 for 2 lines, 88 for 3 lines
    clickable: false,
    clickUrl: null,
  }
]
```

## iMessage Styling Preserved ✅

All the authentic iMessage styling has been maintained:

- ✅ Gray bubble colors (`#e9e9eb` light, `#3b3b3d` dark)
- ✅ System font stack (San Francisco/SF Pro)
- ✅ 18px font size with -0.02em letter spacing
- ✅ 18px border radius on bubbles
- ✅ Proper bubble tail (circles)
- ✅ Typing indicator with three dots
- ✅ Message spacing and layout
- ✅ Dark mode support
- ✅ Link colors (`#0079ff` light, `#0c82f9` dark)

## Template Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `{{name}}` | Your name | Jason |
| `{{location.city}}` | City | Columbus |
| `{{location.state}}` | State | Ohio |
| `{{weather.temp_f}}` | Temp (F) | 72 |
| `{{weather.temp_c}}` | Temp (C) | 22 |
| `{{weather.emoji}}` | Weather icon | ☀️ |
| `{{work.current}}` | Current company | PlanetScale |
| `{{work.previous}}` | Previous company | GitHub |
| `{{work.role}}` | Your role | product designer |
| `{{work.duration}}` | Time at job | almost 5 years |
| `{{social.platform}}` | Social platform | Bluesky |
| `{{social.url}}` | Social URL | https://... |
| `{{day}}` | Day of week | Friday |

## Examples

### Try Pre-made Configs

We've created three example configurations for you:

**1. Minimal (3 messages)**
```bash
cp examples/config-minimal.js config.js
node build-svg.js
```

**2. Portfolio (7 messages, professional)**
```bash
cp examples/config-portfolio.js config.js
node build-svg.js
```

**3. Fun (7 messages, personality)**
```bash
cp examples/config-fun.js config.js
node build-svg.js
```

## Breaking Changes

⚠️ **The old workflow no longer works**

**Old way:**
1. Edit `template.svg` manually
2. Replace placeholders with string replacement
3. Limited to specific placeholders

**New way:**
1. Edit `config.js`
2. Run `node build-svg.js`
3. Any number of customizable messages

**Files no longer used:**
- `template.svg` - No longer needed, SVG is generated
- `index.html` - Old demo file
- Old `README.md` - Replaced by `README-NEW.md`

## Backwards Compatibility

Your old SVG files (`chat.svg`, `chat-new.svg`) will be **overwritten** when you run the new build script. If you want to keep them, rename them first:

```bash
mv chat.svg chat-old.svg
mv chat-new.svg chat-new-old.svg
```

## Benefits of New System

1. **No SVG Editing** - Everything in one config file
2. **Unlimited Messages** - Add as many as you want
3. **Dynamic Data** - Weather and work duration auto-update
4. **Template Variables** - Reusable configuration
5. **Interactive** - Click to pause, hover effects
6. **Examples** - Three ready-to-use configs
7. **Documentation** - Comprehensive guides
8. **Type Safety** - All values validated
9. **Maintainable** - Easy to update and customize
10. **Extensible** - Add your own features easily

## Next Steps

1. ✅ Read `QUICKSTART.md` for immediate usage
2. ✅ Try the example configs in `examples/`
3. ✅ Customize `config.js` for your needs
4. ✅ Read `README-NEW.md` for full documentation
5. ✅ Generate your SVG and share it!

## Questions?

- Check `README-NEW.md` for comprehensive documentation
- Review example configs in `examples/` folder
- The build script provides helpful error messages

---

Enjoy your new configurable iMessage chat generator! 🚀
