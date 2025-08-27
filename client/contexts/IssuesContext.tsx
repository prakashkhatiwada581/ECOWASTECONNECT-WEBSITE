import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, ApiError } from '../lib/api';

interface Issue {
  _id: string;
  type: string;
  title: string;
  location: { address: string } | string;
  description: string;
  status: 'pending' | 'resolved' | 'in-progress';
  priority: 'low' | 'medium' | 'high';
  user: any;
  community?: any;
  assignedTo?: any;
  createdAt: string;
  updatedAt: string;
  image?: string;
  notes?: string;
  resolution?: string;
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'info' | 'error';
  isRead: boolean;
  user: string;
  createdAt: string;
}

interface IssuesContextType {
  issues: Issue[];
  notifications: Notification[];
  loading: boolean;
  submitIssue: (issue: {
    type: string;
    title: string;
    description: string;
    location: { address: string };
    priority?: string;
  }) => Promise<boolean>;
  markNotificationAsRead: (id: string) => void;
  getAdminNotifications: () => Notification[];
  getUserNotifications: () => Notification[];
  refreshIssues: () => void;
  refreshNotifications: () => void;
}

const IssuesContext = createContext<IssuesContextType | undefined>(undefined);

export function IssuesProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshIssues();
    refreshNotifications();
  }, []);

  const refreshIssues = async () => {
    try {
      setLoading(true);
      const issuesData = await api.issues.getAll();
      setIssues(issuesData);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
      // Keep using local state on error
    } finally {
      setLoading(false);
    }
  };

  const refreshNotifications = async () => {
    try {
      const notificationsData = await api.notifications.getAll();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Keep using local state on error
    }
  };

  const submitIssue = async (issue: {
    type: string;
    title: string;
    description: string;
    location: { address: string };
    priority?: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      const newIssue = await api.issues.create(issue);

      // Refresh issues to get the latest data
      await refreshIssues();

      return true;
    } catch (error) {
      console.error('Failed to submit issue:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (id: string) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Still update locally for UX
      setNotifications(prev =>
        prev.map(notification =>
          notification._id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    }
  };

  const getAdminNotifications = () => {
    // For now, return all notifications as we don't have role-based filtering in API
    return notifications;
  };

  const getUserNotifications = () => {
    // For now, return all notifications as we don't have role-based filtering in API
    return notifications;
  };

  const value: IssuesContextType = {
    issues,
    notifications,
    loading,
    submitIssue,
    markNotificationAsRead,
    getAdminNotifications,
    getUserNotifications,
    refreshIssues,
    refreshNotifications
  };

  return (
    <IssuesContext.Provider value={value}>
      {children}
    </IssuesContext.Provider>
  );
}

export function useIssues() {
  const context = useContext(IssuesContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssuesProvider');
  }
  return context;
}
