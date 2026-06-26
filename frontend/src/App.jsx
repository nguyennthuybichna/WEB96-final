import React, { useState } from 'react';
import TeachersList from './components/TeachersList';
import PositionsList from './components/PositionsList';

function App() {
  const [activeTab, setActiveTab] = useState('teachers'); // 'teachers' or 'positions'
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>School System</span>
        </div>

        <ul className="sidebar-menu">
          <li>
            <div
              className={`sidebar-item ${activeTab === 'teachers' ? 'active' : ''}`}
              onClick={() => setActiveTab('teachers')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 01-7.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span>Quản lý Giáo viên</span>
            </div>
          </li>
          <li>
            <div
              className={`sidebar-item ${activeTab === 'positions' ? 'active' : ''}`}
              onClick={() => setActiveTab('positions')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15" />
              </svg>
              <span>Vị trí công tác</span>
            </div>
          </li>
        </ul>

        <div className="sidebar-footer">
          <p>© 2026 EduPortal Inc.</p>
          <p style={{ fontSize: '0.7rem', marginTop: '0.2rem', color: '#334155' }}>Hệ thống quản lý thông tin</p>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="main-content">
        <header className="content-header">
          <h1>
            {activeTab === 'teachers' ? 'Thông tin Giáo viên' : 'Vị trí công tác (Bộ môn)'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Xin chào, <strong style={{ color: 'var(--text-main)' }}>Admin</strong>
            </span>
            <div className="user-avatar" style={{ width: '36px', height: '36px', fontSize: '0.9rem', cursor: 'pointer' }}>
              AD
            </div>
          </div>
        </header>

        {/* Keep both lists mounted so page state is preserved when switching tabs */}
        <div style={{ display: activeTab === 'teachers' ? 'block' : 'none' }}>
          <TeachersList showToast={showToast} />
        </div>
        <div style={{ display: activeTab === 'positions' ? 'block' : 'none' }}>
          <PositionsList showToast={showToast} />
        </div>
      </main>

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: 20, height: 20, color: 'var(--success)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: 20, height: 20, color: 'var(--danger)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
