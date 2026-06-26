import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherDrawer = ({ isOpen, onClose, onSave, showToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [identity, setIdentity] = useState('');
  const [dob, setDob] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [degrees, setDegrees] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [degType, setDegType] = useState('Bachelor');
  const [degSchool, setDegSchool] = useState('');
  const [degMajor, setDegMajor] = useState('');
  const [degYear, setDegYear] = useState(new Date().getFullYear());
  const [degIsGraduated, setDegIsGraduated] = useState(true);

  const [positions, setPositions] = useState([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchPositions = async () => {
        setLoadingPositions(true);
        try {
          const response = await axios.get('http://localhost:5000/teacher-positions');
          setPositions(response.data.filter(p => p.isActive));
        } catch (error) {
          console.error('Error fetching positions in drawer:', error);
        } finally {
          setLoadingPositions(false);
        }
      };
      fetchPositions();
    }
  }, [isOpen]);

  const handleAddDegree = (e) => {
    e.preventDefault();
    if (!degSchool.trim() || !degMajor.trim()) {
      showToast('Vui lòng nhập đầy đủ Trường và Chuyên ngành!', 'error');
      return;
    }

    const newDegree = {
      type: degType,
      school: degSchool.trim(),
      major: degMajor.trim(),
      year: parseInt(degYear, 10),
      isGraduated: degIsGraduated
    };

    setDegrees([...degrees, newDegree]);
    
    setDegType('Bachelor');
    setDegSchool('');
    setDegMajor('');
    setDegYear(new Date().getFullYear());
    setDegIsGraduated(true);
    
    setIsModalOpen(false);
    showToast('Thêm học vị thành công!', 'success');
  };

  const handleRemoveDegree = (index) => {
    const updated = degrees.filter((_, idx) => idx !== index);
    setDegrees(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phoneNumber.trim() || !identity.trim() || !address.trim() || !dob) {
      showToast('Vui lòng điền đầy đủ các thông tin cá nhân bắt buộc (*)', 'error');
      return;
    }
    if (!selectedPosition) {
      showToast('Vui lòng chọn vị trí công tác!', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/teachers', {
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        identity: identity.trim(),
        dob: dob,
        isActive,
        startDate,
        teacherPositionsId: [selectedPosition],
        degrees
      });

      const data = response.data;

      showToast('Tạo mới thông tin giáo viên thành công!', 'success');
      
      setName('');
      setEmail('');
      setPhoneNumber('');
      setAddress('');
      setIdentity('');
      setDob('');
      setIsActive(true);
      setStartDate(new Date().toISOString().split('T')[0]);
      setSelectedPosition('');
      setDegrees([]);

      onSave(data);
      onClose();
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Lỗi khi lưu thông tin giáo viên.';
      showToast(errMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={`drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>Tạo thông tin giáo viên mới</h2>
          <button type="button" className="close-btn" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 20, height: 20 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          <div className="drawer-body">
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '150px' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '12px',
                  backgroundColor: '#f1f5f9',
                  border: '2px dashed #cbd5e1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden'
                }}>
                  {name ? (
                    <div style={{
                      fontSize: '3rem',
                      fontWeight: 700,
                      color: 'var(--primary)',
                      fontFamily: 'var(--font-title)'
                    }}>
                      {name.split(' ').pop().charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ width: 32, height: 32, color: '#94a3b8', marginBottom: '8px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                      </svg>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Tải ảnh</span>
                    </>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>Ảnh đại diện tự động theo tên</span>
              </div>

              <div style={{ flexGrow: 1 }}>
                <h3 className="form-section-title" style={{ marginTop: 0 }}>Thông tin cá nhân</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Họ và tên <span>*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ngày sinh <span>*</span></label>
                    <input
                      type="date"
                      className="form-control"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số điện thoại <span>*</span></label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Nhập số điện thoại"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email <span>*</span></label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="example@school.edu.vn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số CCCD <span>*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập số CCCD"
                      value={identity}
                      onChange={(e) => setIdentity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Địa chỉ thường trú <span>*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Tỉnh/Thành phố cư trú"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <h3 className="form-section-title">Thông tin công tác</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Vị trí công tác <span>*</span></label>
                <select
                  className="form-control"
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  required
                >
                  <option value="">Chọn vị trí công tác</option>
                  {loadingPositions ? (
                    <option disabled>Đang tải danh sách...</option>
                  ) : (
                    positions.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.code})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Ngày bắt đầu công tác</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="form-group form-grid-full">
                <label className="form-label">Trạng thái hoạt động</label>
                <div className="toggle-group" style={{ maxWidth: '300px' }}>
                  <button
                    type="button"
                    className={`toggle-option ${isActive ? 'active' : ''}`}
                    onClick={() => setIsActive(true)}
                  >
                    Đang công tác
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${!isActive ? 'active' : ''}`}
                    onClick={() => setIsActive(false)}
                  >
                    Ngừng hoạt động
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', marginBottom: '0.75rem' }}>
              <h3 className="form-section-title" style={{ margin: 0, borderBottom: 'none' }}>Trình độ học học vấn / Học vị</h3>
              <button
                type="button"
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                onClick={() => setIsModalOpen(true)}
              >
                + Thêm học vị
              </button>
            </div>

            {degrees.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '1.5rem',
                border: '1px dashed var(--border-color)',
                borderRadius: '8px',
                color: 'var(--text-muted)',
                fontSize: '0.85rem'
              }}>
                Chưa thêm thông tin học vị nào. Nhấn "+ Thêm học vị" để nhập thông tin.
              </div>
            ) : (
              <table className="drawer-table">
                <thead>
                  <tr>
                    <th>Bậc</th>
                    <th>Trường đào tạo</th>
                    <th>Chuyên ngành</th>
                    <th>Năm tốt nghiệp</th>
                    <th>Trạng thái</th>
                    <th style={{ width: '60px', textAlign: 'center' }}>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {degrees.map((deg, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{deg.type}</td>
                      <td>{deg.school}</td>
                      <td>{deg.major}</td>
                      <td>{deg.year}</td>
                      <td>
                        <span className={`badge ${deg.isGraduated ? 'badge-success' : 'badge-danger'}`} style={{ padding: '2px 6px', fontSize: '0.7rem' }}>
                          {deg.isGraduated ? 'Đã tốt nghiệp' : 'Chưa tốt nghiệp'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleRemoveDegree(idx)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="drawer-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Đang lưu...' : 'Lưu thông tin'}
            </button>
          </div>
        </form>
      </div>

      <div className={`modal-backdrop ${isModalOpen ? 'open' : ''}`}>
        <div className="modal">
          <div className="modal-header">
            <h3>Thêm học vị mới</h3>
            <button className="close-btn" type="button" onClick={() => setIsModalOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Loại bằng cấp / Bậc học</label>
              <select
                className="form-control"
                value={degType}
                onChange={(e) => setDegType(e.target.value)}
              >
                <option value="Bachelor">Cử nhân (Bachelor)</option>
                <option value="Master">Thạc sĩ (Master)</option>
                <option value="Doctorate">Tiến sĩ (Doctorate)</option>
                <option value="Professor">Giáo sư (Professor)</option>
                <option value="Other">Khác (Other)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Trường đào tạo <span>*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="Ví dụ: Đại học Quốc gia Hà Nội"
                value={degSchool}
                onChange={(e) => setDegSchool(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Chuyên ngành đào tạo <span>*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="Ví dụ: Công nghệ thông tin"
                value={degMajor}
                onChange={(e) => setDegMajor(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Năm tốt nghiệp</label>
              <input
                type="number"
                className="form-control"
                value={degYear}
                onChange={(e) => setDegYear(e.target.value)}
                min={1970}
                max={new Date().getFullYear() + 10}
              />
            </div>

            <div className="form-group">
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  checked={degIsGraduated}
                  onChange={(e) => setDegIsGraduated(e.target.checked)}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Đã hoàn thành tốt nghiệp</span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Hủy
            </button>
            <button type="button" className="btn btn-primary" onClick={handleAddDegree}>
              Thêm
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherDrawer;
