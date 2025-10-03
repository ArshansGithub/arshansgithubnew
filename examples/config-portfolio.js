/**
 * Portfolio iMessage Chat Configuration
 * Professional portfolio presentation
 */

export default {
  canvas: {
    width: 550,
    viewBox: '0 0 550 800',
  },

  animation: {
    enabled: true,
    showTypingIndicator: true,
    typingDuration: 1.2,
    typingDelay: 0.6,
    messageSlideInDuration: 0.25,
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
    hoverOpacity: 0.85,
  },

  personal: {
    name: 'Sarah Chen',
    location: {
      city: 'New York',
      state: 'NY',
      locationKey: '349727',
    },
    work: {
      currentCompany: 'Design Studio',
      currentRole: 'UX Designer',
      previousCompany: 'Creative Agency',
      startDate: '2021-06-15',
    },
    social: {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/sarahchen',
    },
  },

  weather: {
    enabled: false,
  },

  messages: [
    {
      id: 'intro',
      text: "Hi! I'm {{name}} 🎨",
      lines: 1,
      width: 180,
      height: 42,
    },
    {
      id: 'title',
      text: "I'm a {{work.role}} specializing in user-centered design",
      lines: 1,
      width: 480,
      height: 42,
    },
    {
      id: 'experience',
      text: [
        "Currently at {{work.current}} for {{work.duration}},",
        "previously led projects at {{work.previous}}"
      ],
      lines: 2,
      width: 440,
      height: 65,
    },
    {
      id: 'skills',
      text: [
        "My expertise includes:",
        "• User Research & Testing • Wireframing & Prototyping",
        "• Design Systems • Accessibility"
      ],
      lines: 3,
      width: 460,
      height: 88,
    },
    {
      id: 'portfolio',
      text: [
        "View my portfolio and case studies:",
        "https://sarahchen.design"
      ],
      lines: 2,
      width: 360,
      height: 65,
      clickable: true,
      clickUrl: 'https://sarahchen.design',
      linkLine: 1,
    },
    {
      id: 'contact',
      text: [
        "Let's connect on {{social.platform}}",
        "{{social.url}}"
      ],
      lines: 2,
      width: 350,
      height: 65,
      clickable: true,
      clickUrl: '{{social.url}}',
      linkLine: 1,
    },
    {
      id: 'cta',
      text: "Always open to interesting projects! ✨",
      lines: 1,
      width: 360,
      height: 42,
    },
  ],

  output: {
    outputPath: 'chat-portfolio.svg',
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
