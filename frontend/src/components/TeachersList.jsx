import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TeacherDrawer from './TeacherDrawer';

const TeachersList = ({ showToast }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // New state to control when search is actualy queried
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/teachers', {
        params: {
          page: page,
          limit: limit,
          search: searchQuery
        }
      });
      
      const data = response.data;
      setTeachers(data.docs || []);
      setTotalPages(data.totalPages || 1);
      setTotalDocs(data.totalDocs || 0);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Lỗi khi tải danh sách giáo viên';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [page, limit, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchQuery(search.trim());
  };

  const handleReload = () => {
    if (search === '' && searchQuery === '' && page === 1) {
      fetchTeachers();
    } else {
      setSearch('');
      setSearchQuery('');
      setPage(1);
    }
  };

  const handleSaveTeacher = (newTeacher) => {
    fetchTeachers();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };

  const formatHighestDegree = (degrees) => {
    if (!degrees || degrees.length === 0) return { text: 'N/A', detail: '' };
    
    const rank = { 'Doctorate': 4, 'Professor': 3, 'Master': 2, 'Bachelor': 1, 'Other': 0 };
    let highest = degrees[0];
    
    for (let i = 1; i < degrees.length; i++) {
      const r1 = rank[degrees[i].type] || 0;
      const r2 = rank[highest.type] || 0;
      if (r1 > r2) {
        highest = degrees[i];
      }
    }

    const typeMap = {
      'Bachelor': 'Cử nhân',
      'Master': 'Thạc sĩ',
      'Doctorate': 'Tiến sĩ',
      'Professor': 'Giáo sư',
      'Other': 'Khác'
    };

    const typeText = typeMap[highest.type] || highest.type;
    return {
      text: `Bậc: ${typeText}`,
      detail: `Chuyên ngành: ${highest.major}`
    };
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="card">
      <div className="toolbar-row">
        <form onSubmit={handleSearchSubmit} className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo mã, tên, email, sđt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
          </svg>
          <button type="submit" style={{ display: 'none' }}>Tìm kiếm</button>
        </form>

        <div className="action-buttons">
          <button className="btn btn-secondary" onClick={handleReload} disabled={loading}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Tải lại
          </button>
          <button className="btn btn-primary" onClick={() => setIsDrawerOpen(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tạo mới
          </button>
        </div>
      </div>

      <div className="table-responsive">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Đang tải dữ liệu giáo viên...</div>
        ) : teachers.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <h3>Không tìm thấy giáo viên nào</h3>
            <p>Thử tìm kiếm với từ khóa khác hoặc nhấn "Tạo mới".</p>
          </div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Giáo viên</th>
                <th>Trình độ (cao nhất)</th>
                <th>TT Công tác</th>
                <th>Địa chỉ</th>
                <th>Trạng thái</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => {
                const user = teacher.userId || {};
                const positions = teacher.teacherPositionsId || [];
                const highestDegree = formatHighestDegree(teacher.degrees);
                const name = user.name || 'Không rõ';
                const initials = name.split(' ').pop().charAt(0).toUpperCase();
                
                return (
                  <tr key={teacher._id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>{teacher.code}</td>
                    
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">{initials}</div>
                        <div className="user-info">
                          <span className="user-name">{name}</span>
                          <span className="user-meta">{user.email || 'N/A'}</span>
                          <span className="user-meta">{user.phoneNumber || 'N/A'}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="degree-tag">{highestDegree.text}</span>
                        <span className="degree-school">{highestDegree.detail}</span>
                      </div>
                    </td>

                    <td style={{ fontWeight: 500 }}>
                      {positions.length > 0
                        ? positions.map((p) => p.name).join(', ')
                        : 'Chưa có vị trí'}
                    </td>

                    <td style={{ color: 'var(--text-muted)' }}>{user.address || 'N/A'}</td>

                    <td>
                      <span className={`badge ${teacher.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {teacher.isActive ? 'Đang công tác' : 'Ngừng hoạt động'}
                      </span>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem', borderRadius: '6px' }}
                        onClick={() => setSelectedTeacher(teacher)}
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-info">
            Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, totalDocs)} trong tổng số <strong>{totalDocs}</strong> giáo viên
          </div>
          
          <div className="pagination-controls">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              &lt;
            </button>
            {getPageNumbers().map((num) => (
              <button
                key={num}
                className={`page-btn ${page === num ? 'active' : ''}`}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              &gt;
            </button>
            
            <div className="page-select-container">
              <span>Số dòng:</span>
              <select
                className="limit-select"
                value={limit}
                onChange={(e) => {
                  setLimit(parseInt(e.target.value, 10));
                  setPage(1);
                }}
              >
                <option value={5}>5 / trang</option>
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={50}>50 / trang</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <TeacherDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSaveTeacher}
        showToast={showToast}
      />

      {selectedTeacher && (
        <div className="modal-backdrop open" onClick={() => setSelectedTeacher(null)}>
          <div className="modal" style={{ width: '560px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Thông tin chi tiết Giáo viên</h3>
              <button className="close-btn" onClick={() => setSelectedTeacher(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: 16, height: 16 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body" style={{ fontSize: '0.925rem', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', alignItems: 'center' }}>
                <div className="user-avatar" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                  {(selectedTeacher.userId?.name || 'K').split(' ').pop().charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedTeacher.userId?.name}</h4>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                    Mã GV: <strong style={{ color: 'var(--primary)' }}>{selectedTeacher.code}</strong> | Trạng thái: 
                    <span className={`badge ${selectedTeacher.isActive ? 'badge-success' : 'badge-danger'}`} style={{ marginLeft: '6px', padding: '2px 8px', fontSize: '0.7rem' }}>
                      {selectedTeacher.isActive ? 'Đang công tác' : 'Ngừng hoạt động'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div><strong>Email:</strong> {selectedTeacher.userId?.email || 'N/A'}</div>
                <div><strong>Số điện thoại:</strong> {selectedTeacher.userId?.phoneNumber || 'N/A'}</div>
                <div><strong>Số CCCD:</strong> {selectedTeacher.userId?.identity || 'N/A'}</div>
                <div><strong>Ngày sinh:</strong> {formatDate(selectedTeacher.userId?.dob)}</div>
                <div style={{ gridColumn: 'span 2' }}><strong>Địa chỉ cư trú:</strong> {selectedTeacher.userId?.address || 'N/A'}</div>
                <div style={{ gridColumn: 'span 2' }}>
                  <strong>Vị trí công tác:</strong> {selectedTeacher.teacherPositionsId?.map(p => `${p.name} (${p.code})`).join(', ') || 'N/A'}
                </div>
                <div><strong>Ngày nhận việc:</strong> {formatDate(selectedTeacher.startDate)}</div>
                {selectedTeacher.endDate && <div><strong>Ngày thôi việc:</strong> {formatDate(selectedTeacher.endDate)}</div>}
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Bằng cấp & Học vị:</strong>
                {selectedTeacher.degrees?.length === 0 ? (
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chưa có thông tin bằng cấp</span>
                ) : (
                  <table className="drawer-table">
                    <thead>
                      <tr>
                        <th>Bậc học</th>
                        <th>Trường đào tạo</th>
                        <th>Chuyên ngành</th>
                        <th>Năm tốt nghiệp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTeacher.degrees.map((deg, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{deg.type === 'Bachelor' ? 'Cử nhân' : deg.type === 'Master' ? 'Thạc sĩ' : deg.type === 'Doctorate' ? 'Tiến sĩ' : deg.type}</td>
                          <td>{deg.school}</td>
                          <td>{deg.major}</td>
                          <td>{deg.year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setSelectedTeacher(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersList;
