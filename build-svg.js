/**
 * Dynamic iMessage Chat SVG Generator
 * Generates SVG from configuration file
 */

import fs from 'fs'
import got from 'got'
import Qty from 'js-quantities/esm'
import { formatDistance } from 'date-fns'
import config from './config.js'

const WEATHER_DOMAIN = 'http://dataservice.accuweather.com'

/**
 * Fetch weather data from AccuWeather API
 */
async function fetchWeatherData() {
  if (!config.weather.enabled || !config.weather.apiKey) {
    console.log('⚠️  Weather disabled or API key not provided, using fallback values')
    return {
      tempF: 72,
      tempC: 22,
      emoji: '☀️',
    }
  }

  try {
    const locationKey = config.personal.location.locationKey
    const url = `forecasts/v1/daily/1day/${locationKey}?apikey=${config.weather.apiKey}`
    
    const response = await got(url, { prefixUrl: WEATHER_DOMAIN })
    const json = JSON.parse(response.body)

    const degF = Math.round(json.DailyForecasts[0].Temperature.Maximum.Value)
    const degC = Math.round(Qty(`${degF} tempF`).to('tempC').scalar)
    const icon = json.DailyForecasts[0].Day.Icon

    return {
      tempF: degF,
      tempC: degC,
      emoji: config.weatherEmojis[icon] || '☀️',
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
 * Replace template variables in text
 */
function replaceTemplateVars(text, data) {
  let result = text
  
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
  result = result.replace(/\{\{day\}\}/g, data.day)
  
  return result
}

/**
 * Generate typing indicator SVG
 */
function generateTypingIndicator(index, yPosition) {
  return `  <!-- typing ${index} -->
  <g transform="translate(10, ${yPosition})" class="typing-${index}">
    <rect x="8.27246" width="69.7276" height="42" rx="20.9774" class="bubble" />
    <circle cx="13.591" cy="33.091" r="7.68185" class="bubble" />
    <circle cx="3.54547" cy="41.9547" r="3.54547" class="bubble" />

    <circle cx="27.4778" cy="20.9773" r="5.02275" fill="#999999">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
    </circle>
    <circle cx="42.8411" cy="20.9773" r="5.02275" fill="#999999">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" begin="0.2s" repeatCount="indefinite" />
    </circle>
    <circle cx="58.2054" cy="20.9773" r="5.02275" fill="#999999">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" begin="0.4s" repeatCount="indefinite" />
    </circle>
  </g>`
}

/**
 * Generate message bubble SVG
 */
function generateMessageBubble(message, index, yPosition, data) {
  const messageId = message.id
  const clickClass = config.interactive.enableMessageClicks && message.clickable ? ' message-group' : ''
  const clickAttr = message.clickable && message.clickUrl ? ` onclick="window.open('${replaceTemplateVars(message.clickUrl, data)}', '_blank')"` : ''
  
  let textContent = ''
  
  if (Array.isArray(message.text)) {
    // Multi-line message
    message.text.forEach((line, lineIndex) => {
      const processedLine = replaceTemplateVars(line, data)
      const yPos = 27 + (lineIndex * 23)
      
      // Check if this line is a link
      if (message.linkLine !== undefined && lineIndex === message.linkLine) {
        textContent += `    <text x="15" y="${yPos}">
      <a xlink:href="${replaceTemplateVars(message.clickUrl, data)}"><tspan class="link-text">${processedLine}</tspan></a>
    </text>\n`
      } else {
        // Check for emoji in line
        if (processedLine.includes('☀️') || processedLine.includes('🌤') || 
            processedLine.includes('🌥') || processedLine.includes('☁️') ||
            processedLine.includes('🌧') || processedLine.includes('⛈') ||
            processedLine.includes('🌨') || processedLine.includes('❄️') ||
            processedLine.includes('🌫') || processedLine.includes('💨') ||
            processedLine.includes('🥵') || processedLine.includes('🥶') ||
            processedLine.includes('✌🏻') || processedLine.includes('👋🏻')) {
          // Split text and emoji
          const parts = processedLine.split(/(☀️|🌤|🌥|☁️|🌧|⛈|🌨|❄️|🌫|💨|🥵|🥶|✌🏻|👋🏻)/)
          textContent += `    <text x="15" y="${yPos}">`
          parts.forEach(part => {
            if (part && (part === '☀️' || part === '🌤' || part === '🌥' || 
                        part === '☁️' || part === '🌧' || part === '⛈' ||
                        part === '🌨' || part === '❄️' || part === '🌫' ||
                        part === '💨' || part === '🥵' || part === '🥶' ||
                        part === '✌🏻' || part === '👋🏻')) {
              textContent += `<tspan class="emoji">${part}</tspan>`
            } else if (part) {
              textContent += part
            }
          })
          textContent += `</text>\n`
        } else {
          textContent += `    <text x="15" y="${yPos}">${processedLine}</text>\n`
        }
      }
    })
  } else {
    // Single-line message
    const processedText = replaceTemplateVars(message.text, data)
    
    // Check for emoji
    if (processedText.includes('☀️') || processedText.includes('🌤') || 
        processedText.includes('🌥') || processedText.includes('☁️') ||
        processedText.includes('🌧') || processedText.includes('⛈') ||
        processedText.includes('🌨') || processedText.includes('❄️') ||
        processedText.includes('🌫') || processedText.includes('💨') ||
        processedText.includes('🥵') || processedText.includes('🥶') ||
        processedText.includes('✌🏻') || processedText.includes('👋🏻')) {
      const parts = processedText.split(/(☀️|🌤|🌥|☁️|🌧|⛈|🌨|❄️|🌫|💨|🥵|🥶|✌🏻|👋🏻)/)
      textContent += `    <text x="15" y="27">`
      parts.forEach(part => {
        if (part && (part === '☀️' || part === '🌤' || part === '🌥' || 
                    part === '☁️' || part === '🌧' || part === '⛈' ||
                    part === '🌨' || part === '❄️' || part === '🌫' ||
                    part === '💨' || part === '🥵' || part === '🥶' ||
                    part === '✌🏻' || part === '👋🏻')) {
          textContent += `<tspan class="emoji">${part}</tspan>`
        } else if (part) {
          textContent += part
        }
      })
      textContent += `</text>\n`
    } else {
      textContent += `    <text x="15" y="27">${processedText}</text>\n`
    }
  }
  
  return `  <!-- ${messageId} -->
  <g transform="translate(10, ${yPosition})" class="msg-${index}${clickClass} bubble"${clickAttr}>
    <rect width="${message.width}" height="${message.height}" rx="${config.styling.bubbleRadius}" />
${textContent}  </g>`
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
function generateKeyframes(messages) {
  let keyframes = `    @keyframes wait {
      0%, 100% { opacity: 0; }
    }

    @keyframes fade-in-out {
      0%, 100% { opacity: 0; }
      25%, 90% { opacity: 1; }
    }
`
  
  let yPosition = 0
  messages.forEach((message, index) => {
    const msgIndex = index + 1
    const slideDistance = 5
    
    keyframes += `    @keyframes msg-${msgIndex} {
      0% {
        opacity: 0;
        transform: translate(10px, ${yPosition + slideDistance}px);
      }
      100% {
        opacity: 1;
        transform: translate(10px, ${yPosition}px);
      }
    }
`
    
    // Ensure height is a number
    const messageHeight = parseInt(message.height) || 42
    yPosition += messageHeight + config.styling.messageSpacing
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
  
  // Generate typing indicators and messages
  messages.forEach((message, index) => {
    const msgIndex = index + 1
    
    // Generate typing indicator
    if (config.animation.showTypingIndicator) {
      svgContent += generateTypingIndicator(msgIndex, yPosition) + '\n'
    }
    
    // Generate message bubble
    svgContent += generateMessageBubble(message, msgIndex, yPosition, data) + '\n'
    
    // Ensure height is a number
    const messageHeight = parseInt(message.height) || 42
    yPosition += messageHeight + config.styling.messageSpacing
  })
  
  // Calculate total height
  const totalHeight = yPosition + 50 // Add padding at bottom
  
  // Generate CSS
  const animations = generateAnimations(messages)
  const keyframes = generateKeyframes(messages)
  
  const hoverStyles = config.interactive.hoverEffects ? `
    .message-group {
      cursor: pointer;
      transition: opacity 0.2s ease;
    }
    .message-group:hover {
      opacity: ${config.styling.hoverOpacity};
    }
    ` : ''
  
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
      fill: ${config.styling.bubbleColor};
    }
    a {
      fill: ${config.styling.linkColor};
      cursor: pointer;
    }
    text {
      fill: ${config.styling.textColor};
      font-size: ${config.styling.fontSize}px;
      font-family: ${config.styling.fontFamily};
      letter-spacing: ${config.styling.letterSpacing};
    }
    
    .emoji {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }

    ${hoverStyles}${pauseControl}

    @media (prefers-color-scheme: dark) {
      .bubble {
        fill: ${config.styling.bubbleColorDark};
      }
      text {
        fill: ${config.styling.textColorDark};
      }
      a {
        fill: ${config.styling.linkColorDark};
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
