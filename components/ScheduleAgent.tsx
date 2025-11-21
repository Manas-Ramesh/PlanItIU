'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  toolResult?: any
}

interface ScheduleAgentProps {
  userId: string
  currentSchedule: any[]
  onGenerateSchedule: (preferences?: any) => void
  onModifySchedule: (modification: any) => void
}

export default function ScheduleAgent({ 
  userId, 
  currentSchedule, 
  onGenerateSchedule,
  onModifySchedule 
}: ScheduleAgentProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize with welcome message
    setMessages([{
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI schedule assistant. I can help you:\n\n• Generate new schedules based on your preferences\n• Analyze your current schedule\n• Modify courses and sections\n• Answer questions about scheduling\n\nWhat would you like to do?",
      timestamp: new Date()
    }])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = input.trim()
    setInput('')
    setIsLoading(true)

    try {
      const messagesForAPI = messages
        .map(msg => ({ role: msg.role, content: msg.content }))
        .concat({ role: 'user', content: currentInput })

      const response = await fetch('/api/schedule-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: messagesForAPI, 
          userId,
          currentSchedule 
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      console.log('Agent API response:', { 
        message: data.message?.substring(0, 100), 
        toolUsed: data.toolUsed,
        toolResult: data.toolResult,
        hasToolResult: !!data.toolResult
      })
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        toolResult: data.toolResult
      }

      setMessages(prev => [...prev, assistantMessage])

      // Handle generate_schedule with new format (topSchedule + alternatives)
      if (data.toolUsed === 'generate_schedule' && data.toolResult?.topSchedule) {
        console.log('✅ Smart schedule generated:', data.toolResult.count, 'schedules')
        const scheduleKey = `generatedSchedule_${userId}`
        localStorage.setItem(scheduleKey, JSON.stringify(data.toolResult.topSchedule))
        
        // Store alternatives for regeneration
        if (data.toolResult.alternatives && data.toolResult.alternatives.length > 0) {
          const alternativesKey = `scheduleAlternatives_${userId}`
          localStorage.setItem(alternativesKey, JSON.stringify(data.toolResult.alternatives))
        }
        
        window.dispatchEvent(new CustomEvent('scheduleUpdated', { detail: { userId } }))
        setTimeout(() => window.location.reload(), 500)
      }

      // Handle tool actions - check multiple conditions
      const shouldGenerate = 
        data.toolUsed === 'build_custom_schedule' ||
        data.toolUsed === 'generate_schedule' ||
        (data.toolResult && data.toolResult.action === 'generate') ||
        (data.toolResult && data.toolResult.success && data.toolResult.action === 'generate')

      // Fallback: Check if message indicates generation was requested
      const messageIndicatesGeneration = 
        data.message?.toLowerCase().includes('generating') ||
        data.message?.toLowerCase().includes('generate') ||
        data.message?.toLowerCase().includes('creating schedule') ||
        data.message?.toLowerCase().includes('building schedule')

      // Handle finalize action - save the schedule directly
      if (data.toolUsed === 'finalize_schedule' && data.toolResult?.schedule) {
        console.log('✅ Agent finalized schedule with', data.toolResult.schedule.length, 'courses')
        // Save schedule directly to localStorage
        const scheduleKey = `generatedSchedule_${userId}`
        localStorage.setItem(scheduleKey, JSON.stringify(data.toolResult.schedule))
        window.dispatchEvent(new CustomEvent('scheduleUpdated', { detail: { userId } }))
        // Reload to show the new schedule
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } 
      // If agent just started building (build_custom_schedule), automatically continue the workflow
      else if (data.toolUsed === 'build_custom_schedule' && data.toolResult?.requirements && data.toolResult.requirements.length > 0) {
        console.log('🔄 Agent started building schedule with', data.toolResult.requirements.length, 'requirements. Auto-continuing...')
        
        // Automatically continue by making the agent call query_courses for each requirement
        // This simulates the agent continuing its workflow
        setTimeout(async () => {
          const requirements = data.toolResult.requirements || []
          const preferences = data.toolResult.preferences || {}
          
          // Build a message that will trigger the agent to continue
          const continueMessage = {
            id: Date.now().toString(),
            role: 'user' as const,
            content: `Continue building the schedule. I have ${requirements.length} requirements: ${requirements.map((r: any) => r.requirement_name).join(', ')}. Call query_courses for each requirement with timeFilter: { noBefore: "${preferences.noClassesBefore || '11:00 AM'}" }, then add the best courses to the schedule, then finalize.`,
            timestamp: new Date()
          }
          
          setMessages(prev => [...prev, continueMessage])
          
          // Make API call to continue
          const allMessages = [...messages, continueMessage]
            .map(msg => ({ role: msg.role, content: msg.content }))
          
          try {
            const response = await fetch('/api/schedule-agent', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                messages: allMessages, 
                userId,
                currentSchedule 
              }),
            })
            
            const continueData = await response.json()
            console.log('🔄 Continuation response:', continueData.toolUsed, continueData.toolResult)
            
            const assistantMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: continueData.message,
              timestamp: new Date(),
              toolResult: continueData.toolResult
            }
            setMessages(prev => [...prev, assistantMessage])
            
            // Handle finalize
            if (continueData.toolUsed === 'finalize_schedule' && continueData.toolResult?.schedule) {
              const scheduleKey = `generatedSchedule_${userId}`
              localStorage.setItem(scheduleKey, JSON.stringify(continueData.toolResult.schedule))
              window.dispatchEvent(new CustomEvent('scheduleUpdated', { detail: { userId } }))
              setTimeout(() => window.location.reload(), 500)
            }
            // If agent called query_courses, check if it needs to continue
            else if (continueData.toolUsed === 'query_courses') {
              const courseCount = continueData.toolResult?.count || 0
              console.log(`📋 query_courses returned ${courseCount} courses`)
              
              if (courseCount === 0) {
                // No courses found - agent should try next requirement
                console.log('⚠️ No courses found. Agent should try next requirement automatically.')
                // The agent should continue based on system prompt, but we can help it along
                setTimeout(async () => {
                  const requirements = data.toolResult?.requirements || []
                  const currentReqIndex = requirements.findIndex((r: any) => 
                    continueData.toolResult?.message?.includes(r.requirement_name)
                  )
                  
                  if (currentReqIndex < requirements.length - 1) {
                    const nextReq = requirements[currentReqIndex + 1]
                    const nextContinueMessage = {
                      id: (Date.now() + 1000).toString(),
                      role: 'user' as const,
                      content: `No courses found for that requirement. IMMEDIATELY call query_courses for the next requirement: "${nextReq.requirement_name}". Do not explain - just call the tool.`,
                      timestamp: new Date()
                    }
                    setMessages(prev => [...prev, nextContinueMessage])
                    
                    const allMsgs = [...allMessages, nextContinueMessage]
                      .map(msg => ({ role: msg.role, content: msg.content }))
                    
                    try {
                      const nextResponse = await fetch('/api/schedule-agent', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ messages: allMsgs, userId, currentSchedule }),
                      })
                      const nextData = await nextResponse.json()
                      
                      const nextAssistantMessage: Message = {
                        id: (Date.now() + 2000).toString(),
                        role: 'assistant',
                        content: nextData.message,
                        timestamp: new Date(),
                        toolResult: nextData.toolResult
                      }
                      setMessages(prev => [...prev, nextAssistantMessage])
                      
                      // Handle finalize
                      if (nextData.toolUsed === 'finalize_schedule' && nextData.toolResult?.schedule) {
                        const scheduleKey = `generatedSchedule_${userId}`
                        localStorage.setItem(scheduleKey, JSON.stringify(nextData.toolResult.schedule))
                        window.dispatchEvent(new CustomEvent('scheduleUpdated', { detail: { userId } }))
                        setTimeout(() => window.location.reload(), 500)
                      }
                      // Recursively handle next query_courses if needed
                      else if (nextData.toolUsed === 'query_courses' && nextData.toolResult?.count === 0) {
                        // Will be handled by this same block recursively
                      }
                    } catch (error) {
                      console.error('Error in continuation:', error)
                    }
                  }
                }, 2000)
              } else {
                // Courses found - agent should add them
                console.log(`✅ Found ${courseCount} courses. Agent should now check prerequisites and add to schedule.`)
                // The agent should automatically call check_prerequisites and add_course_to_schedule
                // based on the system prompt
              }
            }
            // If agent called another tool, continue the chain
            else if (continueData.toolUsed && continueData.toolUsed !== 'build_custom_schedule') {
              // Agent is continuing - it will make more calls
              console.log('✅ Agent continuing with tool:', continueData.toolUsed)
            }
          } catch (error) {
            console.error('Error continuing schedule build:', error)
          }
        }, 1500) // Wait 1.5 seconds before continuing
      } else if (shouldGenerate) {
        // Trigger schedule generation with preferences
        const prefs = data.toolResult?.preferences || {}
        console.log('✅ Agent triggering schedule generation with preferences:', prefs)
        onGenerateSchedule(prefs)
      } else if (messageIndicatesGeneration && !data.toolUsed) {
        // Fallback: Agent said it will generate but didn't call tool - extract preferences from message
        console.log('⚠️ Agent mentioned generation but no tool called. Attempting to extract preferences from message.')
        // Try to extract time preferences from the conversation
        const lastUserMessage = currentInput.toLowerCase()
        const prefs: any = {}
        
        // Extract "no classes before X" pattern
        const noBeforeMatch = lastUserMessage.match(/no (?:class|classes) (?:start|before|earlier than) (\d{1,2}):?(\d{2})?\s*(am|pm)/i)
        if (noBeforeMatch) {
          const hour = parseInt(noBeforeMatch[1])
          const min = noBeforeMatch[2] ? parseInt(noBeforeMatch[2]) : 0
          const period = noBeforeMatch[3].toUpperCase()
          prefs.noClassesBefore = `${hour}:${min.toString().padStart(2, '0')} ${period}`
          console.log('📅 Extracted noClassesBefore preference:', prefs.noClassesBefore)
        }
        
        // Extract "no classes after X" pattern
        const noAfterMatch = lastUserMessage.match(/no (?:class|classes) (?:after|later than) (\d{1,2}):?(\d{2})?\s*(am|pm)/i)
        if (noAfterMatch) {
          const hour = parseInt(noAfterMatch[1])
          const min = noAfterMatch[2] ? parseInt(noAfterMatch[2]) : 0
          const period = noAfterMatch[3].toUpperCase()
          prefs.noClassesAfter = `${hour}:${min.toString().padStart(2, '0')} ${period}`
          console.log('📅 Extracted noClassesAfter preference:', prefs.noClassesAfter)
        }
        
        if (Object.keys(prefs).length > 0 || lastUserMessage.includes('generate') || lastUserMessage.includes('schedule')) {
          console.log('✅ Fallback: Triggering schedule generation with extracted preferences:', prefs)
          onGenerateSchedule(prefs)
        }
      } else if (data.toolResult && data.toolResult.action === 'modify') {
        // Trigger schedule modification
        onModifySchedule(data.toolResult.modification)
      } else {
        console.log('⚠️ No generation triggered. toolUsed:', data.toolUsed, 'toolResult:', data.toolResult)
      }
    } catch (error) {
      console.error('Error calling schedule agent:', error)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-red-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>AI Assistant</span>
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col" style={{ height: '600px' }}>
      {/* Header */}
      <div className="bg-red-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">AI Schedule Assistant</h3>
          <p className="text-sm text-red-100">I can help with your schedule</p>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-white hover:text-red-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 ${
                message.role === 'user'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-2 last:mb-0 text-sm" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1 text-sm" {...props} />,
                      li: ({node, ...props}) => <li className="text-sm" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-lg px-3 py-2 border border-gray-200">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3 bg-white rounded-b-lg">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your schedule..."
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '100px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

