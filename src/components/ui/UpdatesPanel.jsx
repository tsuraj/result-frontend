import React from 'react'

const UpdatesPanel = ({ notifications }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Important Updates</h3>
      <div className="space-y-4">
        {notifications.map(notification => (
          <div key={notification.id} className="border-b border-gray-100 pb-3 last:border-0">
            <p className="font-medium text-gray-800">{notification.title}</p>
            <p className="text-sm text-gray-500 mt-1">{notification.date}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UpdatesPanel