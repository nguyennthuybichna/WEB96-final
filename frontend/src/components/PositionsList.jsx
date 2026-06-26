import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PositionDrawer from './PositionDrawer';

const PositionsList = ({ showToast }) => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/teacher-positions');
      setPositions(response.data);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Lỗi tải danh sách vị trí công tác';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleSavePosition = (newPosition) => {
    fetchPositions();
  };

  return (
    <div className="card">
      <div className="toolbar-row">
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', fontWeight: 600 }}>
            Danh sách vị trí làm việc (công tác) của giáo viên
          </h2>
        </div>
        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={fetchPositions} disabled={loading}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Làm mới
          </button>
          <button className="btn btn-primary" onClick={() => setIsDrawerOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tạo
          </button>
        </div>
      </div>

      <div className="table-responsive">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải dữ liệu...</div>
        ) : positions.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-.621-.504-1.125-1.125-1.125H9.75M8.25 21h8.25c.38 0 .722-.15 1.077-.4l2.75-2.75a1.125 1.125 0 00-.002-1.593L17.5 13.5m-15 0L1 11.25V5.25c0-.38.15-.722.4-1.077l2.75-2.75A1.125 1.125 0 015.743 1H15a1.125 1.125 0 011.125 1.125V6" />
            </svg>
            <h3>Chưa có vị trí công tác nào</h3>
            <p>Hãy nhấn nút "Tạo" để tạo vị trí công tác đầu tiên.</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>STT</th>
                <th>Mã</th>
                <th>Tên</th>
                <th>Trạng thái</th>
                <th>Mô tả</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((pos, index) => (
                <tr key={pos._id}>
                  <td>{index + 1}</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{pos.code}</td>
                  <td style={{ fontWeight: 500 }}>{pos.name}</td>
                  <td>
                    <span className={`badge ${pos.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {pos.isActive ? 'Hoạt động' : 'Ngừng'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{pos.des || 'Không có mô tả'}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', borderRadius: '4px' }} title="Cài đặt">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 14, height: 14 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <PositionDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSavePosition}
        showToast={showToast}
      />
    </div>
  );
};

export default PositionsList;
