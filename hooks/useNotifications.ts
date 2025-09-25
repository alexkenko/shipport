'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthUser } from '@/lib/auth'

export interface Notification {
  id: string
  type: 'application_accepted' | 'application_rejected' | 'profile_view' | 'job_interest'
  title: string
  message: string
  job_title?: string
  company_name?: string
  created_at: string
  read: boolean
}

export function useNotifications(user: AuthUser | null) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'superintendent') {
      setIsLoading(false)
      return
    }

    fetchNotifications()
    
    // Set up real-time subscriptions for notifications and application updates
    const channel = supabase
      .channel('notifications_and_applications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification received:', payload)
          fetchNotifications()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'job_applications',
          filter: `superintendent_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Application update received:', payload)
          // Check if status changed to accepted or rejected
          if (payload.new.status === 'accepted' || payload.new.status === 'rejected') {
            fetchNotifications()
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const fetchNotifications = async () => {
    if (!user || user.role !== 'superintendent') return

    try {
      // Only fetch notifications from the last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      // Fetch notifications from the notifications table
      const { data: dbNotifications, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false })

      if (notificationsError) {
        console.error('Error fetching notifications:', notificationsError)
      }

      // Fetch application status notifications from the last 30 days
      const { data: applications, error: applicationsError } = await supabase
        .from('job_applications')
        .select(`
          id,
          status,
          created_at,
          updated_at,
          jobs!inner (
            title,
            manager_id
          )
        `)
        .eq('superintendent_id', user.id)
        .in('status', ['accepted', 'rejected'])
        .gte('updated_at', thirtyDaysAgo.toISOString())
        .order('updated_at', { ascending: false })

      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError)
      }

      // Convert database notifications to our format
      const dbNotificationData: Notification[] = (dbNotifications || []).map(notif => ({
        id: notif.id,
        type: notif.type as 'profile_view' | 'job_interest',
        title: notif.title,
        message: notif.message,
        created_at: notif.created_at,
        read: notif.is_read
      }))

      // Convert applications to notifications
      const applicationNotificationData: Notification[] = (applications || []).map(app => {
        const job = Array.isArray(app.jobs) ? app.jobs[0] : app.jobs
        
        // Check if this application notification has been read from localStorage
        const readApplicationIds = JSON.parse(localStorage.getItem(`read_applications_${user.id}`) || '[]')
        const isRead = readApplicationIds.includes(app.id)
        
        return {
          id: `app_${app.id}`,
          type: app.status === 'accepted' ? 'application_accepted' : 'application_rejected',
          title: app.status === 'accepted' ? 'Application Accepted!' : 'Application Not Selected',
          message: app.status === 'accepted' 
            ? `Congratulations! Your application for ${job?.title || 'Unknown Job'} has been accepted.`
            : `Your application for ${job?.title || 'Unknown Job'} was not selected.`,
          job_title: job?.title || 'Unknown Job',
          company_name: 'Company', // We'll get this from the manager_id if needed
          created_at: app.updated_at,
          read: isRead
        }
      })

      // Combine all notifications
      const allNotifications = [...dbNotificationData, ...applicationNotificationData]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setNotifications(allNotifications)
      setUnreadCount(allNotifications.filter(n => !n.read).length)
      
      // Clear old notifications from localStorage
      clearOldNotifications()
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    // If it's a database notification (not prefixed with 'app_'), update the database
    if (!notificationId.startsWith('app_')) {
      try {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notificationId)
      } catch (error) {
        console.error('Error marking notification as read:', error)
      }
    }

    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    if (!user) return

    try {
      // Update all unread notifications in the database
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false)

      // Get all unread application notifications and save them to localStorage
      const unreadApplicationIds = notifications
        .filter(n => !n.read && n.id.startsWith('app_'))
        .map(n => n.id.replace('app_', ''))
      
      if (unreadApplicationIds.length > 0) {
        const readApplicationIds = JSON.parse(localStorage.getItem(`read_applications_${user.id}`) || '[]')
        const combinedIds = [...readApplicationIds, ...unreadApplicationIds]
        const uniqueIds = Array.from(new Set(combinedIds))
        localStorage.setItem(`read_applications_${user.id}`, JSON.stringify(uniqueIds))
      }

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const clearOldNotifications = () => {
    if (!user) return
    
    // Clear localStorage entries older than 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    try {
      const readApplicationIds = JSON.parse(localStorage.getItem(`read_applications_${user.id}`) || '[]')
      // For now, we'll just clear all old entries since we don't have timestamps in localStorage
      // In a production app, you'd want to store timestamps with the IDs
      if (readApplicationIds.length > 50) { // If more than 50 entries, clear half
        const halfLength = Math.floor(readApplicationIds.length / 2)
        const recentIds = readApplicationIds.slice(0, halfLength)
        localStorage.setItem(`read_applications_${user.id}`, JSON.stringify(recentIds))
      }
    } catch (error) {
      console.error('Error clearing old notifications:', error)
    }
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    clearOldNotifications,
    refetch: fetchNotifications
  }
}
