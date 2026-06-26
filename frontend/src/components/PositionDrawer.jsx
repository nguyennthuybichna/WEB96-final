import React, { useState } from 'react';
import axios from 'axios';

const PositionDrawer = ({ isOpen, onClose, onSave, showToast }) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [des, setDes] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      showToast('Vui lòng điền đầy đủ các trường bắt buộc (*)', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/teacher-positions', {
        code: code.trim(),
        name: name.trim(),
        des: des.trim(),
        isActive,
      });

      const data = response.data;

      showToast('Tạo vị trí công tác mới thành công!', 'success');
      setCode('');
      setName('');
      setDes('');
      setIsActive(true);
      
      onSave(data);
      onClose();
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tạo vị trí.';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>Tạo vị trí công tác mới</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="drawer-body">
            <div className="form-grid">
              <div className="form-group form-grid-full">
                <label className="form-label">Mã <span>*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: GVBM, TBM, HT..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group form-grid-full">
                <label className="form-label">Tên <span>*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Giáo viên bộ môn, Trưởng bộ môn..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group form-grid-full">
                <label className="form-label">Mô tả <span>*</span></label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Nhập mô tả về vị trí công tác này..."
                  value={des}
                  onChange={(e) => setDes(e.target.value)}
                  style={{ resize: 'none' }}
                />
              </div>

              <div className="form-group form-grid-full">
                <label className="form-label">Trạng thái <span>*</span></label>
                <div className="toggle-group">
                  <button
                    type="button"
                    className={`toggle-option ${isActive ? 'active' : ''}`}
                    onClick={() => setIsActive(true)}
                  >
                    Hoạt động
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${!isActive ? 'active' : ''}`}
                    onClick={() => setIsActive(false)}
                  >
                    Ngừng
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="drawer-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PositionDrawer;
