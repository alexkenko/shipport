'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AuthUser } from '@/lib/auth'

export interface ManagerNotification {
  id: string
  type: 'job_application' | 'profile_view'
  title: string
  message: string
  job_title?: string
  superintendent_name?: string
  superintendent_company?: string
  created_at: string
  read: boolean
}

export function useManagerNotifications(user: AuthUser | null) {
  const [notifications, setNotifications] = useState<ManagerNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'manager') {
      setIsLoading(false)
      return
    }

    fetchNotifications()
    
    // Set up real-time subscriptions for notifications and job applications
    const channel = supabase
      .channel('manager_notifications_and_applications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New manager notification received:', payload)
          fetchNotifications()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'job_applications',
          filter: `jobs.manager_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New job application received:', payload)
          fetchNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const fetchNotifications = async () => {
    if (!user || user.role !== 'manager') return

    try {
      // Get read application notifications from localStorage
      const readApplicationIds = JSON.parse(localStorage.getItem(`read_applications_${user.id}`) || '[]')
      // Fetch notifications from the notifications table
      const { data: dbNotifications, error: notificationsError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (notificationsError) {
        console.error('Error fetching notifications:', notificationsError)
      }

      // Fetch job applications for manager's jobs
      const { data: jobApplications, error: applicationsError } = await supabase
        .from('job_applications')
        .select(`
          id,
          status,
          message,
          created_at,
          jobs!inner (
            id,
            title,
            manager_id
          ),
          users!inner (
            id,
            name,
            surname,
            company
          )
        `)
        .eq('jobs.manager_id', user.id)
        .order('created_at', { ascending: false })

      if (applicationsError) {
        console.error('Error fetching job applications:', applicationsError)
      }

      // Convert database notifications to our format
      const dbNotificationData: ManagerNotification[] = (dbNotifications || []).map(notif => ({
        id: notif.id,
        type: notif.type as 'profile_view',
        title: notif.title,
        message: notif.message,
        created_at: notif.created_at,
        read: notif.is_read
      }))

      // Convert job applications to notifications
      const applicationNotificationData: ManagerNotification[] = (jobApplications || []).map(app => {
        const job = Array.isArray(app.jobs) ? app.jobs[0] : app.jobs
        const superintendent = Array.isArray(app.users) ? app.users[0] : app.users
        
        return {
          id: `app_${app.id}`,
          type: 'job_application',
          title: 'New Job Application',
          message: `${superintendent?.name || 'Unknown'} ${superintendent?.surname || 'User'} from ${superintendent?.company || 'Unknown Company'} has applied for your job.`,
          job_title: job?.title || 'Unknown Job',
          superintendent_name: `${superintendent?.name || 'Unknown'} ${superintendent?.surname || 'User'}`,
          superintendent_company: superintendent?.company || 'Unknown Company',
          created_at: app.created_at,
          read: readApplicationIds.includes(app.id)
        }
      })

      // Combine all notifications
      const allNotifications = [...dbNotificationData, ...applicationNotificationData]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setNotifications(allNotifications)
      setUnreadCount(allNotifications.filter(n => !n.read).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    if (!user) return

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
    } else {
      // If it's an application notification, save to localStorage
      const applicationId = notificationId.replace('app_', '')
      const readApplicationIds = JSON.parse(localStorage.getItem(`read_applications_${user.id}`) || '[]')
      if (!readApplicationIds.includes(applicationId)) {
        readApplicationIds.push(applicationId)
        localStorage.setItem(`read_applications_${user.id}`, JSON.stringify(readApplicationIds))
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

  const markAllAsRead = () => {
    if (!user) return

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

    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications
  }
}
