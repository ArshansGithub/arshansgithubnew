/**
 * Minimal iMessage Chat Configuration
 * Simple 3-message chat example
 */

export default {
  canvas: {
    width: 550,
    viewBox: '0 0 550 400',
  },

  animation: {
    enabled: true,
    showTypingIndicator: true,
    typingDuration: 1.5,
    typingDelay: 0.5,
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
    bubblePadding: 15,
    messageSpacing: 6,
    enableHover: true,
    hoverOpacity: 0.8,
  },

  personal: {
    name: 'Alex',
    location: {
      city: 'San Francisco',
      state: 'California',
      locationKey: '347629',
    },
    work: {
      currentCompany: 'Tech Corp',
      currentRole: 'developer',
      previousCompany: 'Startup Inc',
      startDate: '2022-01-01',
    },
    social: {
      platform: 'GitHub',
      url: 'https://github.com/username',
    },
  },

  weather: {
    enabled: false, // Disabled for minimal example
  },

  messages: [
    {
      id: 'greeting',
      text: "Hi, I'm {{name}} 👋",
      lines: 1,
      width: 150,
      height: 42,
      clickable: false,
    },
    {
      id: 'bio',
      text: "I'm a {{work.role}} based in {{location.city}}",
      lines: 1,
      width: 350,
      height: 42,
      clickable: false,
    },
    {
      id: 'social',
      text: [
        "Check out my work on {{social.platform}}!",
        "{{social.url}}"
      ],
      lines: 2,
      width: 350,
      height: 65,
      clickable: true,
      clickUrl: '{{social.url}}',
      linkLine: 1,
    },
  ],

  output: {
    outputPath: 'chat-minimal.svg',
    minify: false,
    includeComments: true,
  },

  interactive: {
    pauseControl: true,
    enableMessageClicks: true,
    hoverEffects: true,
  },

  weatherEmojis: {},
  dayBubbleWidths: {},
  debug: { enabled: false },
}
