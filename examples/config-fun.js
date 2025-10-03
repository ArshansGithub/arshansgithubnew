/**
 * Fun iMessage Chat Configuration
 * Playful configuration with personality
 */

export default {
  canvas: {
    width: 550,
    viewBox: '0 0 550 600',
  },

  animation: {
    enabled: true,
    showTypingIndicator: true,
    typingDuration: 1.8, // Slower for comedic effect
    typingDelay: 0.8,
    messageSlideInDuration: 0.2,
    pauseOnClick: true,
  },

  styling: {
    bubbleColor: '#e9e9eb',
    textColor: '#242424',
    linkColor: '#0079ff',
    bubbleColorDark: '#3b3b3d',
    textColorDark: '#dcdcdc',
    linkColorDark: '#0c82f9',
    fontSize: 18,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    letterSpacing: '-0.02em',
    bubbleRadius: 18,
    messageSpacing: 6,
    enableHover: true,
    hoverOpacity: 0.75,
  },

  personal: {
    name: 'Jamie',
    location: {
      city: 'Portland',
      state: 'Oregon',
      locationKey: '350473',
    },
    work: {
      currentCompany: 'Cool Startup',
      currentRole: 'code wizard',
      previousCompany: 'Big Corp',
      startDate: '2023-03-14',
    },
    social: {
      platform: 'Twitter',
      url: 'https://twitter.com/jamiecodes',
    },
  },

  weather: {
    enabled: true,
    apiKey: process.env.WEATHER_API_KEY || '',
    provider: 'accuweather',
    showBothUnits: true,
    primaryUnit: 'F',
  },

  messages: [
    {
      id: 'greeting',
      text: "Yo! I'm {{name}} 🤙",
      lines: 1,
      width: 170,
      height: 42,
    },
    {
      id: 'role',
      text: "Professional {{work.role}} and coffee enthusiast ☕",
      lines: 1,
      width: 420,
      height: 42,
    },
    {
      id: 'weather',
      text: [
        "Currently vibing in {{location.city}} where it's",
        "{{weather.temp_f}}°F and {{weather.emoji}}"
      ],
      lines: 2,
      width: 400,
      height: 65,
      usesWeather: true,
    },
    {
      id: 'work',
      text: [
        "Been crushing it at {{work.current}} for {{work.duration}}",
        "(escaped {{work.previous}} and never looked back 😅)"
      ],
      lines: 2,
      width: 450,
      height: 65,
    },
    {
      id: 'hobbies',
      text: [
        "When I'm not coding, you'll find me:",
        "🎮 Gaming • 🎸 Making noise • 🌮 Taco hunting"
      ],
      lines: 2,
      width: 410,
      height: 65,
    },
    {
      id: 'social',
      text: [
        "Follow my tech adventures & bad jokes:",
        "{{social.url}}"
      ],
      lines: 2,
      width: 380,
      height: 65,
      clickable: true,
      clickUrl: '{{social.url}}',
      linkLine: 1,
    },
    {
      id: 'farewell',
      text: "Peace out! ✌️ Have an awesome {{day}}!",
      lines: 1,
      width: 370,
      height: 42,
      usesDay: true,
    },
  ],

  weatherEmojis: {
    1: '☀️',
    2: '☀️',
    3: '🌤',
    4: '🌤',
    5: '🌤',
    6: '🌥',
    7: '☁️',
    8: '☁️',
    11: '🌫',
    12: '🌧',
    13: '🌦',
    14: '🌦',
    15: '⛈',
    16: '⛈',
    17: '🌦',
    18: '🌧',
    19: '🌨',
    20: '🌨',
    21: '🌨',
    22: '❄️',
    23: '❄️',
    24: '🌧',
    25: '🌧',
    26: '🌧',
    29: '🌧',
    30: '🥵',
    31: '🥶',
    32: '💨',
  },

  output: {
    outputPath: 'chat-fun.svg',
    minify: false,
    includeComments: true,
  },

  interactive: {
    pauseControl: true,
    enableMessageClicks: true,
    hoverEffects: true,
  },

  dayBubbleWidths: {},
  debug: { enabled: false },
}
