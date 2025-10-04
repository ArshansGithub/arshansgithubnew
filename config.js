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
    // Received message colors (gray bubbles, left-aligned)
    receivedBubbleColor: '#e9e9eb',
    receivedTextColor: '#242424',
    receivedBubbleColorDark: '#3b3b3d',
    receivedTextColorDark: '#dcdcdc',
    
    // Sent message colors (blue bubbles, right-aligned)
    sentBubbleColor: '#007aff',
    sentTextColor: '#ffffff',
    sentBubbleColorDark: '#0a84ff',
    sentTextColorDark: '#ffffff',
    
    // Link colors
    linkColor: '#0079ff',
    linkColorDark: '#0c82f9',
    
    // Typography
    fontSize: 18,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    letterSpacing: '-0.02em',
    
    // Bubble styling
    bubbleRadius: 18,
    bubblePadding: 15,
    messageSpacing: 6, // Gap between messages (reduced for tight layout)
    groupSpacing: 12, // Extra space between conversation groups
    
    // Attachment styling
    attachmentWidth: 250,
    attachmentHeight: 250,
    attachmentBorderRadius: 12,
    
    // Hover effects
    enableHover: true,
    hoverOpacity: 0.8,
  },

  // Personal Information (for dynamic data)
  personal: {
    name: 'Arshan',
    location: {
      city: 'San Diego',
      state: 'California',
      // Coordinates for Open-Meteo API
      latitude: '32.7157',
      longitude: '-117.1611',
    },
    work: {
      currentCompany: 'Student',
      currentRole: 'Rancho Bernardo High School',
      previousCompany: 'GitHub',
      startDate: '2020-12-14', // Format: YYYY-MM-DD
    },
    social: {
      linkedin: 'https://linkedin.com/in/arshanshokoohi',
      email: 'mailto:arshan@arshan.dev',
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/arshanshokoohi',
    },
  },

  // Weather Settings
  weather: {
    enabled: true,
    // Open-Meteo API (no API key needed!)
    provider: 'open-meteo',
    // Show both Fahrenheit and Celsius
    showBothUnits: true,
    // Primary unit (F or C)
    primaryUnit: 'F',
  },

  // Messages Configuration
  // Note: width and height are now auto-calculated! Remove them to use dynamic sizing.
  messages: [
    {
      id: 'greeting',
      text: "Hey! Who's this?",
      sender: 'them',
    },
    {
      id: 'intro',
      text: "Hi! I'm {{name}} 👋",
      sender: 'me',
    },
    {
      id: 'question_2',
      text: "Where are you from?",
      sender: 'them',
    },
    {
      id: 'location',
      text: "I'm from {{location.city}}, {{location.state}}!",
      sender: 'me',
    },
    {
      id: 'weather',
      text: "It's {{weather.temp_f}}° F and {{weather.emoji}} today",
      sender: 'me',
      usesWeather: true,
    },
    {
      id: 'question_3',
      text: "Cool! What are you working on?",
      sender: 'them',
    },
    {
      id: 'cipherhacks_intro',
      text: "I'm currently working on CipherHacks, a free cybersecurity high school hackathon. Just check out this venue 😍",
      sender: 'me',
    },
    {
      id: 'venue_image',
      attachment: {
        type: 'image',
        url: 'https://github.com/ArshansGithub/arshansgithubnew/blob/main/images/shiley.jpeg?raw=true',
        alt: 'CipherHacks Venue',
        width: 250,
        height: 200,
      },
      sender: 'me',
      clickable: true,
      clickUrl: 'https://cipherhacks.com',
    },
    {
      id: 'stealth_company',
      text: "I'm also currently building a health/lifestyle app in Stealth.",
      sender: 'me',
    },
    {
      id: 'question_4',
      text: "Impressive! Where can I find you?",
      sender: 'them',
    },
    {
      id: 'contact_linkedin',
      text: "Find me on LinkedIn",
      sender: 'me',
      clickable: true,
      clickUrl: '{{social.linkedin}}',
    },
    {
      id: 'contact_email',
      text: "or shoot me an email!",
      sender: 'me',
      clickable: true,
      clickUrl: '{{social.email}}',
    },
    {
      id: 'farewell',
      text: "Have a great {{day}}! 👋",
      sender: 'me',
      usesDay: true,
    },
  ],

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
