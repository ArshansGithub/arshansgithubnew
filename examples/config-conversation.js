/**
 * Two-Way Conversation with Image Attachments Example
 * Shows back-and-forth messaging with blue/gray bubbles
 */

export default {
  canvas: {
    width: 550,
  },

  animation: {
    enabled: true,
    showTypingIndicator: true,
    typingDuration: 1.5,
    typingDelay: 0.7,
    messageSlideInDuration: 0.2,
    pauseOnClick: true,
  },

  styling: {
    // Received messages (gray, left-aligned)
    receivedBubbleColor: '#e9e9eb',
    receivedTextColor: '#242424',
    receivedBubbleColorDark: '#3b3b3d',
    receivedTextColorDark: '#dcdcdc',
    
    // Sent messages (blue, right-aligned)
    sentBubbleColor: '#007aff',
    sentTextColor: '#ffffff',
    sentBubbleColorDark: '#0a84ff',
    sentTextColorDark: '#ffffff',
    
    linkColor: '#0079ff',
    linkColorDark: '#0c82f9',
    
    fontSize: 18,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    letterSpacing: '-0.02em',
    
    bubbleRadius: 18,
    bubblePadding: 15,
    messageSpacing: 6,
    groupSpacing: 12, // Extra space between different senders
    
    // Attachment styling
    attachmentWidth: 250,
    attachmentHeight: 250,
    attachmentBorderRadius: 12,
    
    enableHover: true,
    hoverOpacity: 0.8,
  },

  personal: {
    name: 'Alex',
    location: {
      city: 'San Francisco',
      state: 'CA',
      locationKey: '347629',
    },
    work: {
      currentCompany: 'Design Co',
      currentRole: 'product designer',
      previousCompany: 'Startup Inc',
      startDate: '2022-03-15',
    },
    social: {
      platform: 'GitHub',
      url: 'https://github.com/alexdesigner',
    },
  },

  weather: {
    enabled: false,
  },

  messages: [
    // Conversation starts with "them" (gray bubble, left)
    {
      id: 'question_1',
      text: "Hey! What do you do?",
      width: 230,
      height: 42,
      sender: 'them',
    },
    
    // Response from "me" (blue bubble, right)
    {
      id: 'answer_1',
      text: "I'm a {{work.role}} at {{work.current}}!",
      width: 320,
      height: 42,
      sender: 'me',
    },
    
    // Follow-up question
    {
      id: 'question_2',
      text: "Nice! What are you working on?",
      width: 300,
      height: 42,
      sender: 'them',
    },
    
    // Response with text
    {
      id: 'answer_2',
      text: "Here's my latest design:",
      width: 240,
      height: 42,
      sender: 'me',
    },
    
    // IMAGE ATTACHMENT! (blue border, right-aligned)
    {
      id: 'portfolio_image',
      attachment: {
        type: 'image',
        url: 'https://via.placeholder.com/250x180/007aff/ffffff?text=Design+Mockup',
        alt: 'Portfolio piece',
        width: 250,
        height: 180,
      },
      sender: 'me',
      clickable: true,
      clickUrl: 'https://dribbble.com/alexdesigner',
    },
    
    // Another image attachment
    {
      id: 'workflow_diagram',
      attachment: {
        type: 'image',
        url: 'https://via.placeholder.com/250x200/007aff/ffffff?text=User+Flow',
        alt: 'Workflow diagram',
        width: 250,
        height: 200,
      },
      sender: 'me',
      clickable: true,
      clickUrl: 'https://www.figma.com/@alexdesigner',
    },
    
    // Reaction from them
    {
      id: 'reaction',
      text: "🔥 That looks amazing!",
      width: 230,
      height: 42,
      sender: 'them',
    },
    
    // Question about contact
    {
      id: 'question_3',
      text: "How can I see more of your work?",
      width: 310,
      height: 42,
      sender: 'them',
    },
    
    // Link response
    {
      id: 'portfolio_link',
      text: [
        "Check out my {{social.platform}}:",
        "{{social.url}}"
      ],
      width: 310,
      height: 65,
      sender: 'me',
      clickable: true,
      clickUrl: '{{social.url}}',
      linkLine: 1,
    },
    
    // Closing
    {
      id: 'thanks',
      text: "Thanks! I'll check it out 👍",
      width: 270,
      height: 42,
      sender: 'them',
    },
    
    {
      id: 'goodbye',
      text: "Let's connect! 🚀",
      width: 180,
      height: 42,
      sender: 'me',
    },
  ],

  weatherEmojis: {},
  dayBubbleWidths: {},

  output: {
    outputPath: 'chat-conversation.svg',
    minify: false,
    includeComments: true,
  },

  interactive: {
    pauseControl: true,
    enableMessageClicks: true,
    hoverEffects: true,
  },

  debug: {
    enabled: false,
  },
}
