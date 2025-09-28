'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ClockIcon,
  UserGroupIcon,
  HeartIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { supabase } from '@/lib/supabase'
import { AuthUser } from '@/lib/auth'

interface ChatMessage {
  id: string
  user_id: string
  message: string
  message_type: 'text'
  file_url?: string
  file_name?: string
  reply_to_message_id?: string
  reply_message?: string
  reply_user_name?: string
  reply_user_surname?: string
  edited_at?: string
  created_at: string
  updated_at: string
  name: string
  surname: string
  photo_url?: string
}

interface OnlineUser {
  user_id: string
  is_online: boolean
  last_seen: string
  is_typing: boolean
  name: string
  surname: string
  photo_url?: string
}

interface ChatReaction {
  id: string
  message_id: string
  user_id: string
  reaction: string
  created_at: string
}

interface ChatPopupProps {
  isOpen: boolean
  onClose: () => void
  user: AuthUser | null
}

export function ChatPopup({ isOpen, onClose, user }: ChatPopupProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [reactions, setReactions] = useState<Record<string, ChatReaction[]>>({})
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isOpen && user) {
      fetchMessages()
      fetchOnlineUsers()
      updateOnlineStatus()

      // Update online status every 30 seconds
      const onlineInterval = setInterval(updateOnlineStatus, 30000)
      
      // Fallback polling every 5 seconds as backup to real-time subscriptions
      const messagePollingInterval = setInterval(() => {
        console.log('ChatPopup: Fallback polling for new messages...')
        fetchMessages()
        fetchOnlineUsers()
      }, 5000)
      
      // Set up subscriptions and get cleanup functions
      const unsubscribeMessages = subscribeToMessages()
      const unsubscribeOnlineUsers = subscribeToOnlineUsers()
      const unsubscribeReactions = subscribeToReactions()
      
      // Clean up on unmount
      return () => {
        clearInterval(onlineInterval)
        clearInterval(messagePollingInterval)
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
        // Clean up subscriptions
        if (unsubscribeMessages) unsubscribeMessages()
        if (unsubscribeOnlineUsers) unsubscribeOnlineUsers()
        if (unsubscribeReactions) unsubscribeReactions()
      }
    }
  }, [isOpen, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      console.log('ChatPopup: Fetching messages...')
      
      // Fetch messages directly from the table
      const { data: messagesData, error: messagesError } = await supabase
        .from('superintendent_chat_messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(50)

      if (messagesError) {
        console.error('Error fetching messages:', messagesError)
        return
      }

      console.log('ChatPopup: Fetched messages:', messagesData?.length)

      if (!messagesData || messagesData.length === 0) {
        setMessages([])
        setIsLoading(false)
        return
      }

      // Get unique user IDs from messages
      const userIds = Array.from(new Set(messagesData.map(msg => msg.user_id)))
      console.log('ChatPopup: Unique user IDs:', userIds)

      // Fetch user details for all message authors
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, surname, photo_url')
        .in('id', userIds)

      if (usersError) {
        console.error('Error fetching users:', usersError)
        return
      }

      console.log('ChatPopup: Fetched users:', usersData?.length)

      // Combine messages with user data
      const messagesWithUsers = messagesData.map(message => {
        const userData = usersData?.find(u => u.id === message.user_id)
        return {
          ...message,
          name: userData?.name || 'Unknown',
          surname: userData?.surname || 'User',
          photo_url: userData?.photo_url || undefined
        }
      })

      setMessages(messagesWithUsers)
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOnlineUsers = async () => {
    try {
      console.log('ChatPopup: Fetching online users...')
      
      // First get online status
      const { data: onlineData, error: onlineError } = await supabase
        .from('superintendent_chat_online')
        .select('user_id, is_online, last_seen, is_typing')
        .eq('is_online', true)

      if (onlineError) {
        console.error('Error fetching online users:', onlineError)
        return
      }

      console.log('ChatPopup: Online status data:', onlineData?.length)

      if (!onlineData || onlineData.length === 0) {
        setOnlineUsers([])
        return
      }

      // Get user details for online users
      const userIds = onlineData.map(item => item.user_id)
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, surname, photo_url')
        .in('id', userIds)

      if (usersError) {
        console.error('Error fetching user details:', usersError)
        return
      }

      console.log('ChatPopup: User details data:', usersData?.length)

      // Combine online status with user data
      const onlineUsersWithDetails = onlineData.map(onlineItem => {
        const userData = usersData?.find(u => u.id === onlineItem.user_id)
        return {
          ...onlineItem,
          name: userData?.name || 'Unknown',
          surname: userData?.surname || 'User',
          photo_url: userData?.photo_url || undefined
        }
      })

      setOnlineUsers(onlineUsersWithDetails)
      console.log('ChatPopup: Final online users:', onlineUsersWithDetails.length)
    } catch (error) {
      console.error('Error fetching online users:', error)
    }
  }

  const updateOnlineStatus = async () => {
    if (!user) return
    
    try {
      await supabase
        .from('superintendent_chat_online')
        .upsert({
          user_id: user.id,
          is_online: true,
          last_seen: new Date().toISOString(),
          is_typing: false
        })
    } catch (error) {
      console.error('Error updating online status:', error)
    }
  }

  const subscribeToMessages = () => {
    if (!user) return

    console.log('ChatPopup: Setting up message subscription...')
    
    const subscription = supabase
      .channel('superintendent_chat_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'superintendent_chat_messages'
        },
        (payload) => {
          console.log('ChatPopup: Message subscription update:', payload.eventType)
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            fetchMessages()
          }
        }
      )
      .subscribe()

    return () => {
      console.log('ChatPopup: Unsubscribing from messages')
      subscription.unsubscribe()
    }
  }

  const subscribeToOnlineUsers = () => {
    if (!user) return

    console.log('ChatPopup: Setting up online users subscription...')
    
    const subscription = supabase
      .channel('superintendent_chat_online')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'superintendent_chat_online'
        },
        (payload) => {
          console.log('ChatPopup: Online users subscription update:', payload.eventType)
          fetchOnlineUsers()
        }
      )
      .subscribe()

    return () => {
      console.log('ChatPopup: Unsubscribing from online users')
      subscription.unsubscribe()
    }
  }

  const subscribeToReactions = () => {
    if (!user) return

    console.log('ChatPopup: Setting up reactions subscription...')
    
    const subscription = supabase
      .channel('superintendent_chat_reactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'superintendent_chat_reactions'
        },
        (payload) => {
          console.log('ChatPopup: Reactions subscription update:', payload.eventType)
          fetchReactions()
        }
      )
      .subscribe()

    return () => {
      console.log('ChatPopup: Unsubscribing from reactions')
      subscription.unsubscribe()
    }
  }

  const fetchReactions = async () => {
    try {
      const { data, error } = await supabase
        .from('superintendent_chat_reactions')
        .select('*')

      if (error) {
        console.error('Error fetching reactions:', error)
        return
      }

      // Group reactions by message_id
      const groupedReactions = data.reduce((acc, reaction) => {
        if (!acc[reaction.message_id]) {
          acc[reaction.message_id] = []
        }
        acc[reaction.message_id].push(reaction)
        return acc
      }, {} as Record<string, ChatReaction[]>)

      setReactions(groupedReactions)
    } catch (error) {
      console.error('Error fetching reactions:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || isSending) return

    const messageText = newMessage.trim()
    setNewMessage('')
    setIsSending(true)

    try {
      // Create optimistic message
      const optimisticMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        user_id: user.id,
        message: messageText,
        message_type: 'text',
        file_url: undefined,
        file_name: undefined,
        reply_to_message_id: replyTo?.id,
        reply_message: replyTo?.message,
        reply_user_name: replyTo?.name,
        reply_user_surname: replyTo?.surname,
        edited_at: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        name: user.name || 'You',
        surname: user.surname || '',
        photo_url: user.photo_url
      }

      // Add optimistic message to UI
      setMessages(prev => [...prev, optimisticMessage])

      // Send to server
      const { data, error } = await supabase
        .from('superintendent_chat_messages')
        .insert({
          user_id: user.id,
          message: messageText,
          message_type: 'text',
          reply_to_message_id: replyTo?.id || null
        })
        .select()
        .single()

      if (error) {
        console.error('Error sending message:', error)
        // Remove optimistic message on error
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id))
        alert('Failed to send message')
        return
      }

      // Replace optimistic message with real message
      setMessages(prev => prev.map(msg => 
        msg.id === optimisticMessage.id 
          ? { ...data, name: user.name || 'You', surname: user.surname || '', photo_url: user.photo_url }
          : msg
      ))

      // Clear reply if any
      setReplyTo(null)

      // Update typing status
      updateTypingStatus(false)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const handleTyping = (value: string) => {
    setNewMessage(value)
    updateTypingStatus(value.length > 0)

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false)
    }, 2000)
  }

  const updateTypingStatus = async (isTyping: boolean) => {
    if (!user) return
    
    try {
      await supabase
        .from('superintendent_chat_online')
        .upsert({
          user_id: user.id,
          is_online: true,
          last_seen: new Date().toISOString(),
          is_typing: isTyping
        })
    } catch (error) {
      console.error('Error updating typing status:', error)
    }
  }

  const addReaction = async (messageId: string, reaction: string) => {
    if (!user) return

    try {
      // Check if user already reacted with this emoji
      const existingReaction = reactions[messageId]?.find(
        r => r.user_id === user.id && r.reaction === reaction
      )

      if (existingReaction) {
        // Remove reaction
        await supabase
          .from('superintendent_chat_reactions')
          .delete()
          .eq('id', existingReaction.id)
      } else {
        // Add reaction
        await supabase
          .from('superintendent_chat_reactions')
          .insert({
            message_id: messageId,
            user_id: user.id,
            reaction: reaction
          })
      }
    } catch (error) {
      console.error('Error managing reaction:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  const commonReactions = ['👍', '❤️', '😂', '😮', '😢', '🙏']

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end">
      <div className="bg-dark-800 w-full max-w-md h-full flex flex-col shadow-2xl border-l border-dark-700">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700 bg-dark-800">
          <div className="flex items-center gap-3">
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-primary-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Superintendent Chat</h2>
              <p className="text-xs text-gray-400">
                {onlineUsers.length} online
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No messages yet</p>
              <p className="text-sm text-gray-500">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                {message.user_id !== user?.id && (
                  <div className="flex-shrink-0">
                    {message.photo_url ? (
                      <img
                        src={message.photo_url}
                        alt={`${message.name} ${message.surname}`}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                        {message.name.charAt(0)}{message.surname.charAt(0)}
                      </div>
                    )}
                  </div>
                )}

                <div className={`max-w-xs ${message.user_id === user?.id ? 'order-first' : ''}`}>
                  {message.reply_to_message_id && (
                    <div className="mb-2 p-2 bg-dark-700/50 rounded-lg border-l-2 border-primary-400">
                      <p className="text-xs text-primary-400">
                        Replying to {message.reply_user_name} {message.reply_user_surname}
                      </p>
                      <p className="text-sm text-gray-300 truncate">
                        {message.reply_message}
                      </p>
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-lg ${
                      message.user_id === user?.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-dark-700 text-gray-100'
                    }`}
                  >
                    {message.user_id !== user?.id && (
                      <p className="text-xs font-medium mb-1 opacity-80">
                        {message.name} {message.surname}
                      </p>
                    )}
                    
                    <p className="text-sm">{message.message}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs opacity-70">
                        {formatTime(message.created_at)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => addReaction(message.id, '👍')}
                          className="text-xs hover:scale-110 transition-transform"
                        >
                          👍
                        </button>
                        <button
                          onClick={() => addReaction(message.id, '❤️')}
                          className="text-xs hover:scale-110 transition-transform"
                        >
                          ❤️
                        </button>
                      </div>
                    </div>

                    {reactions[message.id] && reactions[message.id].length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Object.entries(
                          reactions[message.id].reduce((acc, reaction) => {
                            acc[reaction.reaction] = (acc[reaction.reaction] || 0) + 1
                            return acc
                          }, {} as Record<string, number>)
                        ).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            onClick={() => addReaction(message.id, emoji)}
                            className={`px-2 py-1 rounded-full text-xs border transition-colors ${
                              reactions[message.id].some(r => r.user_id === user?.id && r.reaction === emoji)
                                ? 'bg-primary-600 border-primary-400 text-white'
                                : 'bg-dark-700 border-dark-600 text-gray-300 hover:border-primary-400'
                            }`}
                          >
                            {emoji} {count}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Online Users - Compact */}
        {onlineUsers.length > 0 && (
          <div className="p-3 border-t border-dark-700 bg-dark-800/50">
            <div className="flex items-center gap-2 mb-2">
              <UserGroupIcon className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-400">Online ({onlineUsers.length})</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {onlineUsers.slice(0, 6).map((onlineUser) => (
                <div key={onlineUser.user_id} className="relative">
                  {onlineUser.photo_url ? (
                    <img
                      src={onlineUser.photo_url}
                      alt={`${onlineUser.name} ${onlineUser.surname}`}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                      {onlineUser.name.charAt(0)}{onlineUser.surname.charAt(0)}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-dark-800"></div>
                </div>
              ))}
              {onlineUsers.length > 6 && (
                <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs">
                  +{onlineUsers.length - 6}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Message Input */}
        <form onSubmit={sendMessage} className="p-3 border-t border-dark-700 bg-dark-800">
          {replyTo && (
            <div className="mb-2 p-2 bg-dark-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-primary-400">
                    Replying to {replyTo.name} {replyTo.surname}
                  </p>
                  <p className="text-sm text-gray-300 truncate">{replyTo.message}</p>
                </div>
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-gray-400 hover:text-white ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => handleTyping(e.target.value)}
              placeholder="Type a message..."
              className="bg-dark-700 border-dark-600 text-sm"
              disabled={isSending}
            />
            
            <Button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="px-3 py-2 bg-primary-600 hover:bg-primary-700"
            >
              {isSending ? (
                <ClockIcon className="h-4 w-4 animate-spin" />
              ) : (
                <PaperAirplaneIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}