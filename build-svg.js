/**
 * Dynamic iMessage Chat SVG Generator
 * Generates SVG from configuration file
 */

import fs from 'fs'
import got from 'got'
import Qty from 'js-quantities/esm'
import { formatDistance } from 'date-fns'
import config from './config.js'

// WMO Weather interpretation codes to Emojis
// See: https://open-meteo.com/en/docs
const wmoCodeEmojis = {
  0: '☀️',     // Clear sky
  1: '🌤️',    // Mainly clear
  2: '🌥️',    // Partly cloudy
  3: '☁️',     // Overcast
  45: '🌫️',   // Fog
  48: '🌫️',   // Depositing rime fog
  51: '💧',    // Drizzle: Light
  53: '💧',    // Drizzle: Moderate
  55: '💧',    // Drizzle: Dense
  56: '💧🧊',  // Freezing Drizzle: Light
  57: '💧🧊',  // Freezing Drizzle: Dense
  61: '🌧️',   // Rain: Slight
  63: '🌧️',   // Rain: Moderate
  65: '🌧️',   // Rain: Heavy
  66: '🌧️🧊', // Freezing Rain: Light
  67: '🌧️🧊', // Freezing Rain: Dense
  71: '🌨️',   // Snow fall: Slight
  73: '❄️',    // Snow fall: Moderate
  75: '☃️',    // Snow fall: Heavy
  77: '❄️',    // Snow grains
  80: '🌦️',   // Rain showers: Slight
  81: '🌦️',   // Rain showers: Moderate
  82: '🌦️',   // Rain showers: Violent
  85: '🌨️❄️', // Snow showers: Slight
  86: '🌨️❄️', // Snow showers: Heavy
  95: '⛈️',    // Thunderstorm
  96: '⛈️🧊',  // Thunderstorm with slight hail
  99: '⛈️🧊',  // Thunderstorm with heavy hail
}

/**
 * Fetch weather data from Open-Meteo API (no API key needed!)
 */
async function fetchWeatherData() {
  if (!config.weather.enabled) {
    console.log('⚠️  Weather disabled, using fallback values')
    return {
      tempF: 72,
      tempC: 22,
      emoji: '☀️',
    }
  }

  try {
    const lat = config.personal.location.latitude
    const lon = config.personal.location.longitude
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max&temperature_unit=fahrenheit&timezone=auto`
    
    const response = await got(url)
    const json = JSON.parse(response.body)
    const dailyData = json.daily

    const degF = Math.round(dailyData.temperature_2m_max[0])
    const degC = Math.round(Qty(`${degF} tempF`).to('tempC').scalar)
    const weatherCode = dailyData.weather_code[0]
    const emoji = wmoCodeEmojis[weatherCode] || '✨'

    return {
      tempF: degF,
      tempC: degC,
      emoji: emoji,
    }
  } catch (err) {
    console.error('❌ Error fetching weather:', err.message)
    return {
      tempF: 72,
      tempC: 22,
      emoji: '☀️',
    }
  }
}

/**
 * Calculate work duration from start date
 */
function calculateWorkDuration() {
  const today = new Date()
  const startDate = new Date(config.personal.work.startDate)
  
  return formatDistance(startDate, today, {
    addSuffix: false,
  })
}

/**
 * Get current day of week
 */
function getCurrentDay() {
  const today = new Date()
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today)
}

/**
 * Measure text width in pixels
 * Approximates SVG text rendering based on character widths
 */
function measureTextWidth(text, fontSize = 18) {
  if (!text) return 0
  const str = text.toString()
  let width = 0

  // Iterate by grapheme clusters so emoji + skin tones are handled together
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })
  const graphemes = [...segmenter.segment(str)].map(s => s.segment)

  for (const g of graphemes) {
    // Heuristics tuned for SF UI Text 18px with slight negative letter spacing
    if (g === ' ') {
      width += fontSize * 0.30
    } else if (/\p{Emoji_Presentation}|\uFE0F/u.test(g)) {
      // Emoji (including composed sequences)
      width += fontSize * 1.08
    } else if (/[iIl1!|]/.test(g)) {
      width += fontSize * 0.32
    } else if (/[fjtJ]/.test(g)) {
      width += fontSize * 0.40
    } else if (/[rT]/.test(g)) {
      width += fontSize * 0.46
    } else if (/[a-zksvy]/.test(g)) {
      width += fontSize * 0.53
    } else if (/[A-HJKNOPQRSUVXYZ]/.test(g)) {
      width += fontSize * 0.63
    } else if (/[mwMW]/.test(g)) {
      width += fontSize * 0.78
    } else if (/[0-9]/.test(g)) {
      width += fontSize * 0.54
    } else if (/[°@]/.test(g)) {
      width += fontSize * 0.52
    } else if (/[.,;:!?()\-'“”’]/.test(g)) {
      width += fontSize * 0.33
    } else if (/[/]/.test(g)) {
      width += fontSize * 0.38
    } else {
      width += fontSize * 0.56
    }
  }

  // Apply letter-spacing compensation (match CSS: -0.02em)
  width += (graphemes.length - 1) * (fontSize * -0.02)

  // Minimal safety buffer to avoid right-edge overflow due to font metric variance
  return Math.ceil(width + 1)
}

/**
 * Wrap text into lines when it exceeds max width (like iOS)
 */
function wrapText(text, maxTextWidth, fontSize) {
  const words = text.split(' ')
  const lines = []
  let currentLine = ''
  
  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const testWidth = measureTextWidth(testLine, fontSize)
    
    if (testWidth > maxTextWidth && currentLine) {
      // Line too long, push current and start new
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  })
  
  if (currentLine) {
    lines.push(currentLine)
  }
  
  return lines
}

/**
 * Calculate bubble width based on text content
 */
function calculateBubbleWidth(message, data) {
  const padding = 30 // 15px left + 15px right padding from rect edges
  const minWidth = 80
  const maxTextWidth = 420 // Max text width before wrapping
  const maxBubbleWidth = maxTextWidth + padding
  
  let textWidth = 0
  let longestLineText = ''
  
  if (Array.isArray(message.text)) {
    // Multi-line: use the longest line
    message.text.forEach(line => {
      const processedLine = replaceTemplateVars(line, data)
      const lineWidth = measureTextWidth(processedLine, config.styling.fontSize)
      if (lineWidth > textWidth) {
        textWidth = lineWidth
        longestLineText = processedLine
      }
    })
  } else if (message.text) {
    // Single line - check if it needs wrapping
    const processedText = replaceTemplateVars(message.text, data)
    const lines = wrapText(processedText, maxTextWidth, config.styling.fontSize)
    
    // Find longest line
    lines.forEach(line => {
      const lineWidth = measureTextWidth(line, config.styling.fontSize)
      if (lineWidth > textWidth) {
        textWidth = lineWidth
        longestLineText = line
      }
    })
  }
  
  // Dynamic safety: add a few px only for complex lines (emoji/URLs/uppercase/digits)
  const hasEmoji = /\p{Emoji_Presentation}|\uFE0F/u.test(longestLineText)
  const hasUrl = /https?:\/\//.test(longestLineText)
  const hasUpperOrDigit = /[A-Z0-9]/.test(longestLineText)
  const safety = hasUrl ? 6 : hasEmoji ? 4 : hasUpperOrDigit ? 2 : 0

  const bubbleWidth = Math.max(minWidth, Math.min(maxBubbleWidth, textWidth + padding + safety))
  return bubbleWidth
}

/**
 * Calculate bubble height based on number of lines
 */
function calculateBubbleHeight(message, data) {
  const lineHeight = 23 // Matches original
  const topPadding = 12
  const bottomPadding = 12
  const maxTextWidth = 420
  
  let lines = 1
  
  if (Array.isArray(message.text)) {
    lines = message.text.length
  } else if (message.text) {
    // Check if text needs wrapping
    const processedText = replaceTemplateVars(message.text, data)
    const wrappedLines = wrapText(processedText, maxTextWidth, config.styling.fontSize)
    lines = wrappedLines.length
  }
  
  // Single line: 42px, Two lines: 66px (matches original)
  if (lines === 1) {
    return 42
  } else {
    return topPadding + (lines * lineHeight) + bottomPadding - 4
  }
}

/**
 * Replace template variables in text
 */
function replaceTemplateVars(text, data) {
  if (!text) return ''
  
  let result = text.toString()
  
  // Simple template variable replacement
  result = result.replace(/\{\{name\}\}/g, data.name)
  result = result.replace(/\{\{location\.city\}\}/g, data.location.city)
  result = result.replace(/\{\{location\.state\}\}/g, data.location.state)
  result = result.replace(/\{\{weather\.temp_f\}\}/g, data.weather.tempF)
  result = result.replace(/\{\{weather\.temp_c\}\}/g, data.weather.tempC)
  result = result.replace(/\{\{weather\.emoji\}\}/g, data.weather.emoji)
  result = result.replace(/\{\{work\.role\}\}/g, data.work.role)
  result = result.replace(/\{\{work\.current\}\}/g, data.work.current)
  result = result.replace(/\{\{work\.previous\}\}/g, data.work.previous)
  result = result.replace(/\{\{work\.duration\}\}/g, data.work.duration)
  result = result.replace(/\{\{social\.platform\}\}/g, data.social.platform)
  result = result.replace(/\{\{social\.url\}\}/g, data.social.url)
  result = result.replace(/\{\{social\.linkedin\}\}/g, data.social.linkedin)
  result = result.replace(/\{\{social\.email\}\}/g, data.social.email)
  result = result.replace(/\{\{day\}\}/g, data.day)
  
  return result
}

/**
 * Generate typing indicator SVG (supports both left and right alignment)
 */
function generateTypingIndicator(index, yPosition, sender = 'them') {
  const isSent = sender === 'me'
  const TAIL_OFFSET = 8.27246
  const typingWidth = 69.7276
  // Align with message bubbles: 20px right margin for sent, 10px left for received
  const xOffset = isSent ? (config.canvas.width - typingWidth - 20) : 10
  const bubbleClass = isSent ? ' sent-bubble' : ' received-bubble'
  
  // Position rect to account for tail
  const rectX = isSent ? 0 : TAIL_OFFSET
  
  // Tail circles
  let tailSVG = ''
  if (isSent) {
    // Right tail for sent
    tailSVG = `    <circle cx="${typingWidth - 13.591 + TAIL_OFFSET}" cy="33.091" r="7.68185" class="bubble" />
    <circle cx="${typingWidth - 3.54547 + TAIL_OFFSET}" cy="41.9547" r="3.54547" class="bubble" />`
  } else {
    // Left tail for received
    tailSVG = `    <circle cx="13.591" cy="33.091" r="7.68185" class="bubble" />
    <circle cx="3.54547" cy="41.9547" r="3.54547" class="bubble" />`
  }
  
  // The dots are always positioned relative to the rect's origin (rectX).
  const dot1X = rectX + 19.20534
  const dot2X = rectX + 34.56864
  const dot3X = rectX + 49.93294
  
  return `  <!-- typing ${index} -->
  <g transform="translate(${xOffset}, ${yPosition})" class="typing-${index}${bubbleClass}">
    <rect x="${rectX}" width="${typingWidth}" height="42" rx="20.9774" class="bubble" />
${tailSVG}

    <circle cx="${dot1X}" cy="20.9773" r="5.02275" fill="#999999">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
    </circle>
    <circle cx="${dot2X}" cy="20.9773" r="5.02275" fill="#999999">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" begin="0.2s" repeatCount="indefinite" />
    </circle>
    <circle cx="${dot3X}" cy="20.9773" r="5.02275" fill="#999999">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" begin="0.4s" repeatCount="indefinite" />
    </circle>
  </g>`
}

/**
 * Generate message bubble SVG (handles both sent and received messages)
 */
function generateMessageBubble(message, index, yPosition, data) {
  const messageId = message.id
  const sender = message.sender || 'them' // 'me' or 'them'
  const isSent = sender === 'me'
  
  // Calculate dimensions dynamically
  const bubbleWidth = message.width || calculateBubbleWidth(message, data)
  const bubbleHeight = message.height || calculateBubbleHeight(message, data)
  
  // Calculate x position based on sender
  const xOffset = isSent ? (config.canvas.width - bubbleWidth - 20) : 10
  
  const clickClass = config.interactive.enableMessageClicks && message.clickable ? ' message-group' : ''
  const bubbleClass = isSent ? ' sent-bubble' : ' received-bubble'
  const clickAttr = message.clickable && message.clickUrl ? ` onclick="window.open('${replaceTemplateVars(message.clickUrl, data)}', '_blank')"` : ''
  
  let textContent = ''
  
  // Process text - either manual array or auto-wrapped string
  let lines = []
  const maxTextWidth = 420
  
  if (Array.isArray(message.text)) {
    // Manual multi-line
    lines = message.text.map(line => replaceTemplateVars(line, data))
  } else if (message.text) {
    // Auto-wrap if needed
    const processedText = replaceTemplateVars(message.text, data)
    lines = wrapText(processedText, maxTextWidth, config.styling.fontSize)
  }
  
  // Render each line
  lines.forEach((line, lineIndex) => {
    const yPos = 27 + (lineIndex * 23) // Matches original: y=27, y=50 (27+23)
    
    const TAIL_OFFSET = 8.27246
    // Text position: 15px from rect left edge for proper padding
    const textX = isSent ? 15 : (TAIL_OFFSET + 15)
    
    // Check if this line is a link
    if (message.linkLine !== undefined && lineIndex === message.linkLine) {
      textContent += `    <text x="${textX}" y="${yPos}">
      <a xlink:href="${replaceTemplateVars(message.clickUrl, data)}"><tspan class="link-text">${line}</tspan></a>
    </text>\n`
    } else {
      // Check for emoji in line
      if (line.match(/[☀️🌤🌥☁️🌧⛈🌨❄️🌫💨🥵🥶✌🏻👋🏻👋]/)) {
        // Split text and emoji
        const parts = line.split(/(☀️|🌤|🌥|☁️|🌧|⛈|🌨|❄️|🌫|💨|🥵|🥶|✌🏻|👋🏻|👋)/)
        textContent += `    <text x="${textX}" y="${yPos}">`
        parts.forEach(part => {
          if (part && part.match(/[☀️🌤🌥☁️🌧⛈🌨❄️🌫💨🥵🥶✌🏻👋🏻👋]/)) {
            textContent += `<tspan class="emoji">${part}</tspan>`
          } else if (part) {
            textContent += part
          }
        })
        textContent += `</text>\n`
      } else {
        textContent += `    <text x="${textX}" y="${yPos}">${line}</text>\n`
      }
    }
  })
  
  // Generate tail circles for iMessage look
  let tailSVG = ''
  if (isSent) {
    // Tail on the RIGHT for sent messages
    tailSVG = `    <circle cx="${bubbleWidth - 13.591 + 8.27246}" cy="${bubbleHeight - 8.909}" r="7.68185" class="bubble" />
    <circle cx="${bubbleWidth - 3.54547 + 8.27246}" cy="${bubbleHeight - 0.0453}" r="3.54547" class="bubble" />
`
  } else {
    // Tail on the LEFT for received messages  
    tailSVG = `    <circle cx="13.591" cy="${bubbleHeight - 8.909}" r="7.68185" class="bubble" />
    <circle cx="3.54547" cy="${bubbleHeight - 0.0453}" r="3.54547" class="bubble" />
`
  }
  
  // Position rect to account for tail
  const TAIL_OFFSET = 8.27246
  const rectX = isSent ? 0 : TAIL_OFFSET
  const rectWidth = bubbleWidth
  
  return `  <!-- ${messageId} -->
  <g transform="translate(${xOffset}, ${yPosition})" class="msg-${index}${clickClass}${bubbleClass}"${clickAttr}>
    <rect x="${rectX}" width="${rectWidth}" height="${bubbleHeight}" rx="${config.styling.bubbleRadius}" />
${tailSVG}${textContent}  </g>`
}

/**
 * Generate attachment (image or SVG) SVG
 */
function generateAttachment(message, index, yPosition, data) {
  const messageId = message.id
  const sender = message.sender || 'them'
  const isSent = sender === 'me'
  const attachment = message.attachment
  
  if (!attachment) return ''
  
  // Calculate dimensions
  const attWidth = attachment.width || config.styling.attachmentWidth
  const attHeight = attachment.height || config.styling.attachmentHeight
  const borderRadius = config.styling.attachmentBorderRadius
  
  // Calculate x position based on sender
  const xOffset = isSent ? (config.canvas.width - attWidth - 20) : 10
  
  const clickClass = config.interactive.enableMessageClicks && message.clickable ? ' message-group' : ''
  const bubbleClass = isSent ? ' sent-bubble' : ' received-bubble'
  const clickAttr = message.clickable && message.clickUrl ? ` onclick="window.open('${replaceTemplateVars(message.clickUrl, data)}', '_blank')"` : ''
  
  // Handle different attachment types
  let content = ''
  if (attachment.type === 'image') {
    const processedUrl = replaceTemplateVars(attachment.url, data)
    content = `    <image href="${processedUrl}" x="0" y="0" width="${attWidth}" height="${attHeight}" preserveAspectRatio="xMidYMid slice" />`
  } else if (attachment.type === 'svg') {
    // For SVG, embed it directly or reference it
    const processedUrl = replaceTemplateVars(attachment.url, data)
    content = `    <image href="${processedUrl}" x="0" y="0" width="${attWidth}" height="${attHeight}" />`
  }
  
  // Generate tail circles for attachments
  let tailSVG = ''
  if (isSent) {
    // Tail on the RIGHT for sent attachments
    tailSVG = `    <circle cx="${attWidth - 13.591 + 8.27246}" cy="${attHeight - 8.909}" r="7.68185" class="bubble" />
    <circle cx="${attWidth - 3.54547 + 8.27246}" cy="${attHeight - 0.0453}" r="3.54547" class="bubble" />
`
  } else {
    // Tail on the LEFT for received attachments
    tailSVG = `    <circle cx="13.591" cy="${attHeight - 8.909}" r="7.68185" class="bubble" />
    <circle cx="3.54547" cy="${attHeight - 0.0453}" r="3.54547" class="bubble" />
`
  }
  
  // Position rect to account for tail
  const TAIL_OFFSET = 8.27246
  const rectX = isSent ? 0 : TAIL_OFFSET
  const imageX = isSent ? 0 : TAIL_OFFSET
  
  // Adjust content to account for rect offset
  const adjustedContent = content.replace(/x="0"/, `x="${imageX}"`)
  
  return `  <!-- ${messageId} -->
  <g transform="translate(${xOffset}, ${yPosition})" class="msg-${index}${clickClass}${bubbleClass} attachment"${clickAttr}>
    <rect x="${rectX}" width="${attWidth}" height="${attHeight}" rx="${borderRadius}" class="attachment-bg" />
${tailSVG}    <clipPath id="clip-${messageId}">
      <rect x="${rectX}" width="${attWidth}" height="${attHeight}" rx="${borderRadius}" />
    </clipPath>
    <g clip-path="url(#clip-${messageId})">
${adjustedContent}
    </g>
  </g>`
}

/**
 * Generate CSS animations
 */
function generateAnimations(messages) {
  let css = ''
  let currentTime = 0
  
  messages.forEach((message, index) => {
    const msgIndex = index + 1
    const typingDuration = config.animation.typingDuration
    const typingDelay = config.animation.typingDelay
    const slideInDuration = config.animation.messageSlideInDuration
    
    // Typing indicator animation
    if (config.animation.showTypingIndicator) {
      css += `    .typing-${msgIndex} {
      opacity: 0;
      animation: wait ${currentTime}s, fade-in-out ${typingDuration}s ${currentTime}s;
    }

`
      currentTime += typingDuration + typingDelay
    }
    
    // Message slide-in animation
    css += `    .msg-${msgIndex} {
      animation: wait ${currentTime}s, msg-${msgIndex} ${slideInDuration}s ${currentTime}s;
    }
`
    
    currentTime += typingDelay + 0.5
  })
  
  return css
}

/**
 * Generate CSS keyframes for message animations
 */
function generateKeyframes(messages, data) {
  let keyframes = `    @keyframes wait {
      0%, 100% { opacity: 0; }
    }

    @keyframes fade-in-out {
      0%, 100% { opacity: 0; }
      25%, 90% { opacity: 1; }
    }
`
  
  let yPosition = 0
  let lastSender = null
  
  messages.forEach((message, index) => {
    const msgIndex = index + 1
    const currentSender = message.sender || 'them'
    const isSent = currentSender === 'me'
    const slideDistance = 5
    
    // Add extra spacing between different senders (same logic as SVG generation)
    if (lastSender && lastSender !== currentSender) {
      yPosition += config.styling.groupSpacing
    }
    
    // Calculate x position based on sender
    let xOffset
    let bubbleWidth
    
    if (message.attachment) {
      const attWidth = message.attachment.width || config.styling.attachmentWidth
      xOffset = isSent ? (config.canvas.width - attWidth - 20) : 10
      bubbleWidth = attWidth
    } else {
      bubbleWidth = message.width || calculateBubbleWidth(message, { 
        name: config.personal.name,
        location: config.personal.location,
        weather: { tempF: '72', tempC: '22', emoji: '☀️' },
        work: { 
          current: config.personal.work.currentCompany,
          role: config.personal.work.currentRole,
          previous: config.personal.work.previousCompany,
          duration: 'X years'
        },
        social: config.personal.social,
        day: 'Day'
      })
      xOffset = isSent ? (config.canvas.width - bubbleWidth - 20) : 10
    }
    
    keyframes += `    @keyframes msg-${msgIndex} {
      0% {
        opacity: 0;
        transform: translate(${xOffset}px, ${yPosition + slideDistance}px);
      }
      100% {
        opacity: 1;
        transform: translate(${xOffset}px, ${yPosition}px);
      }
    }
`
    
    // Update position for next message (same logic as SVG generation)
    if (message.attachment) {
      const attHeight = message.attachment.height || config.styling.attachmentHeight
      yPosition += attHeight + config.styling.messageSpacing
    } else {
      const messageHeight = message.height || calculateBubbleHeight(message, data)
      yPosition += messageHeight + config.styling.messageSpacing
    }
    
    lastSender = currentSender
  })
  
  return keyframes
}

/**
 * Generate complete SVG
 */
function generateSVG(data) {
  const messages = config.messages
  let yPosition = 0
  let svgContent = ''
  let lastSender = null
  
  // Generate typing indicators and messages
  messages.forEach((message, index) => {
    const msgIndex = index + 1
    const currentSender = message.sender || 'them'
    
    // Add extra spacing between different senders
    if (lastSender && lastSender !== currentSender) {
      yPosition += config.styling.groupSpacing
    }
    
    // Show typing indicator for all messages
    if (config.animation.showTypingIndicator) {
      svgContent += generateTypingIndicator(msgIndex, yPosition, currentSender) + '\n'
    }
    
    // Generate message bubble or attachment
    if (message.attachment) {
      svgContent += generateAttachment(message, msgIndex, yPosition, data) + '\n'
      const attHeight = message.attachment.height || config.styling.attachmentHeight
      yPosition += attHeight + config.styling.messageSpacing
    } else if (message.text) {
      const bubble = generateMessageBubble(message, msgIndex, yPosition, data)
      svgContent += bubble + '\n'
      
      // Calculate height dynamically if not specified
      const messageHeight = message.height || calculateBubbleHeight(message, data)
      yPosition += messageHeight + config.styling.messageSpacing
    }
    
    lastSender = currentSender
  })
  
  // Calculate total height
  const totalHeight = yPosition + 20 // Add padding at bottom
  
  // Generate CSS
  const animations = generateAnimations(messages)
  const keyframes = generateKeyframes(messages, data)
  
  const hoverStyles = config.interactive.hoverEffects ? `
    .message-group {
      cursor: pointer;
      transition: opacity 0.2s ease;
    }
    .message-group:hover {
      opacity: ${config.styling.hoverOpacity};
    }
    ` : ''
  
  const bubbleStyles = `
    .received-bubble rect {
      fill: ${config.styling.receivedBubbleColor};
    }
    .received-bubble text {
      fill: ${config.styling.receivedTextColor};
    }
    .received-bubble .bubble {
      fill: ${config.styling.receivedBubbleColor};
    }
    .received-bubble a {
      fill: ${config.styling.linkColor};
    }
    .sent-bubble rect {
      fill: ${config.styling.sentBubbleColor};
    }
    .sent-bubble text {
      fill: ${config.styling.sentTextColor};
    }
    .sent-bubble .bubble {
      fill: ${config.styling.sentBubbleColor};
    }
    .sent-bubble a {
      fill: rgba(255, 255, 255, 0.85);
      text-decoration: underline;
    }
    .sent-bubble circle[fill="#999999"] {
      fill: rgba(255, 255, 255, 0.5) !important;
    }
    .attachment-bg {
      fill: ${config.styling.receivedBubbleColor};
    }
    .sent-bubble .attachment-bg {
      fill: ${config.styling.sentBubbleColor};
    }`
  
  const pauseControl = config.interactive.pauseControl ? `
    svg {
      cursor: pointer;
    }
    svg.paused * {
      animation-play-state: paused !important;
    }` : ''
  
  // Build complete SVG
  const svg = `<svg width="${config.canvas.width}" height="${totalHeight}" viewBox="0 0 ${config.canvas.width} ${totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"${config.interactive.pauseControl ? ' onclick="this.classList.toggle(\'paused\')"' : ''}>
  <style>
    .bubble {
      fill: ${config.styling.receivedBubbleColor};
    }
    a {
      fill: ${config.styling.linkColor};
      cursor: pointer;
    }
    text {
      fill: ${config.styling.receivedTextColor};
      font-size: ${config.styling.fontSize}px;
      font-family: ${config.styling.fontFamily};
      letter-spacing: ${config.styling.letterSpacing};
    }
    
    .emoji {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }

    ${bubbleStyles}
    ${hoverStyles}${pauseControl}

    @media (prefers-color-scheme: dark) {
      .bubble {
        fill: ${config.styling.receivedBubbleColorDark};
      }
      .received-bubble rect {
        fill: ${config.styling.receivedBubbleColorDark};
      }
      .received-bubble text {
        fill: ${config.styling.receivedTextColorDark};
      }
      .received-bubble .bubble {
        fill: ${config.styling.receivedBubbleColorDark};
      }
      .sent-bubble rect {
        fill: ${config.styling.sentBubbleColorDark};
      }
      .sent-bubble text {
        fill: ${config.styling.sentTextColorDark};
      }
      .sent-bubble .bubble {
        fill: ${config.styling.sentBubbleColorDark};
      }
      .received-bubble a {
        fill: ${config.styling.linkColorDark};
      }
      .sent-bubble a {
        fill: rgba(255, 255, 255, 0.85);
      }
      text {
        fill: ${config.styling.receivedTextColorDark};
      }
      .attachment-bg {
        fill: ${config.styling.receivedBubbleColorDark};
      }
      .sent-bubble .attachment-bg {
        fill: ${config.styling.sentBubbleColorDark};
      }
    }
${animations}${keyframes}  </style>
  <defs>
    <!-- Font definitions can be added here -->
  </defs>
${svgContent}</svg>`
  
  return svg
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Generating iMessage chat SVG...\n')
  
  // Gather all dynamic data
  const weather = await fetchWeatherData()
  const workDuration = calculateWorkDuration()
  const currentDay = getCurrentDay()
  
  const data = {
    name: config.personal.name,
    location: {
      city: config.personal.location.city,
      state: config.personal.location.state,
    },
    weather: weather,
    work: {
      role: config.personal.work.currentRole,
      current: config.personal.work.currentCompany,
      previous: config.personal.work.previousCompany,
      duration: workDuration,
    },
    social: {
      platform: config.personal.social.platform,
      url: config.personal.social.url,
      linkedin: config.personal.social.linkedin,
      email: config.personal.social.email,
    },
    day: currentDay,
  }
  
  console.log('📊 Data collected:')
  console.log(`   Name: ${data.name}`)
  console.log(`   Location: ${data.location.city}, ${data.location.state}`)
  console.log(`   Weather: ${data.weather.tempF}°F (${data.weather.tempC}°C) ${data.weather.emoji}`)
  console.log(`   Work Duration: ${data.work.duration}`)
  console.log(`   Day: ${data.day}`)
  console.log('')
  
  // Generate SVG
  const svg = generateSVG(data)
  
  // Write to file
  fs.writeFileSync(config.output.outputPath, svg, 'utf-8')
  
  console.log(`✅ SVG generated successfully: ${config.output.outputPath}`)
  console.log(`   Messages: ${config.messages.length}`)
  console.log(`   Animations: ${config.animation.enabled ? 'Enabled' : 'Disabled'}`)
  console.log(`   Interactive: ${config.interactive.pauseControl ? 'Yes (click to pause)' : 'No'}`)
}

// Run the generator
main().catch(err => {
  console.error('❌ Error:', err)
  process.exit(1)
})
