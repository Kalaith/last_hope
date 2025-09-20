import React, { useState } from 'react';

export type TabId = 'dashboard' | 'world' | 'settlement' | 'research';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
  hasNotification?: boolean;
}

interface TabNavigationProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  notifications?: Partial<Record<TabId, boolean>>;
}

const tabs: Tab[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'world', label: 'World', icon: '🌍' },
  { id: 'settlement', label: 'Settlement', icon: '🏗️' },
  { id: 'research', label: 'Research', icon: '🔬' }
];

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  notifications = {}
}) => {
  return (
    <nav className="tab-navigation">
      <div className="tab-buttons">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''} ${
              notifications[tab.id] ? 'has-notification' : ''
            }`}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
            {notifications[tab.id] && (
              <span className="notification-indicator">!</span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};