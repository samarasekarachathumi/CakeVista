import { createContext, useContext } from 'react'
import { notification } from 'antd'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [api, contextHolder] = notification.useNotification()

  const showSuccess = (title, description) => {
    api.success({
      message: title,
      description,
      placement: 'topRight',
      duration: 3,
    })
  }

  const showError = (title, description) => {
    api.error({
      message: title,
      description,
      placement: 'topRight',
      duration: 4,
    })
  }

  const showWarning = (title, description) => {
    api.warning({
      message: title,
      description,
      placement: 'topRight',
      duration: 3,
    })
  }

  const showInfo = (title, description) => {
    api.info({
      message: title,
      description,
      placement: 'topRight',
      duration: 3,
    })
  }

  const value = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }

  return (
    <NotificationContext.Provider value={value}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}
