/**
 * iMessage Chat SVG Configuration
 * Customize your chat messages, timing, appearance, and behavior
 */

export default {
  // SVG Canvas Settings
  canvas: {
    width: 550,
    height: 684, // Auto-calculated based on messages if not specified
    viewBox: '0 0 550 684',
    backgroundColor: 'transparent',
  },

  // Animation Settings
  animation: {
    // Enable/disable animations
    enabled: true,
    // Show typing indicator before each message
    showTypingIndicator: true,
    // Duration of typing indicator animation (seconds)
    typingDuration: 1.5,
    // Delay before showing typing indicator (seconds)
    typingDelay: 0.7,
    // Message slide-in duration (seconds)
    messageSlideInDuration: 0.2,
    // Allow pausing/resuming animation on click
    pauseOnClick: true,
    // Loop animation
    loop: false,
  },

  // iMessage Styling (maintains authentic look)
  styling: {
    // Bubble colors (light mode)
    bubbleColor: '#e9e9eb',
    textColor: '#242424',
    linkColor: '#0079ff',
    
    // Bubble colors (dark mode)
    bubbleColorDark: '#3b3b3d',
    textColorDark: '#dcdcdc',
    linkColorDark: '#0c82f9',
    
    // Typography
    fontSize: 18,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    letterSpacing: '-0.02em',
    
    // Bubble styling
    bubbleRadius: 18,
    bubblePadding: 15,
    messageSpacing: 6, // Gap between messages (reduced for tight layout)
    
    // Hover effects
    enableHover: true,
    hoverOpacity: 0.8,
  },

  // Personal Information (for dynamic data)
  personal: {
    name: 'Jason',
    location: {
      city: 'Columbus',
      state: 'Ohio',
      // AccuWeather location key (get from accuweather.com)
      locationKey: '18363_PC',
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
      displayUrl: 'https://bsky.app/profile/jasonlong.me',
    },
  },

  // Weather Settings
  weather: {
    enabled: true,
    apiKey: process.env.WEATHER_API_KEY || '',
    // Use AccuWeather API (can be extended to support other services)
    provider: 'accuweather',
    // Show both Fahrenheit and Celsius
    showBothUnits: true,
    // Primary unit (F or C)
    primaryUnit: 'F',
  },

  // Messages Configuration
  messages: [
    {
      id: 'greeting',
      // Message text (can use template variables)
      text: "Hi, I'm {{name}}",
      // Message type: single-line or multi-line
      lines: 1,
      // Auto-calculate width based on text
      autoWidth: true,
      // Or specify custom width
      width: 150,
      height: 42,
      // Enable click interaction
      clickable: false,
      clickUrl: null,
    },
    {
      id: 'location_weather',
      text: [
        "I live in {{location.city}}, {{location.state}} where it's supposed to be",
        "{{weather.temp_f}}° F ({{weather.temp_c}}° C) and {{weather.emoji}} today.",
      ],
      lines: 2,
      autoWidth: true,
      width: 430,
      height: 65,
      clickable: false,
      // This message uses dynamic weather data
      usesWeather: true,
    },
    {
      id: 'work_info',
      text: [
        "I'm a {{work.role}}. I used to work at {{work.previous}},",
        "but I've been at {{work.current}} for {{work.duration}} now.",
      ],
      lines: 2,
      autoWidth: true,
      width: 446,
      height: 65,
      clickable: false,
      // This message uses dynamic work duration
      usesDuration: true,
    },
    {
      id: 'project_showcase',
      text: [
        "My favorite project is isometric-contributions. It's a",
        "browser extension that shows your GitHub",
        "contributions like this",
      ],
      lines: 3,
      autoWidth: true,
      width: 462,
      height: 88,
      clickable: false,
    },
    {
      id: 'social_link',
      text: [
        "You can find me on {{social.platform}} at",
        "{{social.url}}",
      ],
      lines: 2,
      autoWidth: true,
      width: 326,
      height: 65,
      clickable: true,
      clickUrl: '{{social.url}}',
      // Line 2 is a clickable link
      linkLine: 1, // 0-indexed
    },
    {
      id: 'farewell',
      text: "Have a great {{day}}! ✌🏻",
      lines: 1,
      autoWidth: true,
      width: 220,
      height: 42,
      clickable: false,
      // Uses dynamic day of week
      usesDay: true,
    },
  ],

  // Weather emoji mapping (AccuWeather icon codes)
  weatherEmojis: {
    1: '☀️',   // Sunny
    2: '☀️',   // Mostly Sunny
    3: '🌤',   // Partly Sunny
    4: '🌤',   // Intermittent Clouds
    5: '🌤',   // Hazy Sunshine
    6: '🌥',   // Mostly Cloudy
    7: '☁️',   // Cloudy
    8: '☁️',   // Dreary (Overcast)
    11: '🌫',  // Fog
    12: '🌧',  // Showers
    13: '🌦',  // Mostly Cloudy w/ Showers
    14: '🌦',  // Partly Sunny w/ Showers
    15: '⛈',   // T-Storms
    16: '⛈',   // Mostly Cloudy w/ T-Storms
    17: '🌦',  // Partly Sunny w/ T-Storms
    18: '🌧',  // Rain
    19: '🌨',  // Flurries
    20: '🌨',  // Mostly Cloudy w/ Flurries
    21: '🌨',  // Partly Sunny w/ Flurries
    22: '❄️',  // Snow
    23: '❄️',  // Mostly Cloudy w/ Snow
    24: '🌧',  // Ice
    25: '🌧',  // Sleet
    26: '🌧',  // Freezing Rain
    29: '🌧',  // Rain and Snow
    30: '🥵',  // Hot
    31: '🥶',  // Cold
    32: '💨',  // Windy
  },

  // Advanced: Custom day bubble widths for authentic variable-width messages
  // Set to null to auto-calculate based on text
  dayBubbleWidths: {
    Monday: 235,
    Tuesday: 235,
    Wednesday: 260,
    Thursday: 245,
    Friday: 220,
    Saturday: 245,
    Sunday: 230,
  },

  // Output Settings
  output: {
    // Output file path
    outputPath: 'chat.svg',
    // Minify SVG output
    minify: false,
    // Add comments in SVG
    includeComments: true,
    // Pretty print SVG
    prettyPrint: true,
  },

  // Interactive Features
  interactive: {
    // Enable click-to-pause animation
    pauseControl: true,
    // Show pause/play indicator on hover
    showControls: false,
    // Enable message click actions
    enableMessageClicks: true,
    // Add hover effects to messages
    hoverEffects: true,
  },

  // Debug Mode
  debug: {
    enabled: false,
    // Log generated SVG structure
    logStructure: false,
    // Show message boundaries
    showBoundaries: false,
  },
}
