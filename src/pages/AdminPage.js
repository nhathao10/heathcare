import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { FaHome, FaEdit, FaChartBar, FaStethoscope } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import "./AdminPage.css";

export default function AdminPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  async function fetchBookings() {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, "bookings"));
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
    } catch (err) {
      setError("Không thể tải danh sách đặt lịch.");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Bạn có chắc muốn xóa lịch này?")) return;
    await deleteDoc(doc(db, "bookings", id));
    setBookings((prev) => prev.filter((b) => b.id !== id));
  }

  function startEdit(b) {
    setEditingId(b.id);
    setEditData({
      fullName: b.fullName || b.name || '',
      phone: b.phone || '',
      email: b.email || '',
      department: b.department || b.specialty || '',
      date: b.date || '',
      notes: b.notes || b.note || ''
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({});
  }

  async function saveEdit(id) {
    try {
      await updateDoc(doc(db, "bookings", id), {
        fullName: editData.fullName,
        phone: editData.phone,
        email: editData.email,
        department: editData.department,
        date: editData.date,
        notes: editData.notes
      });
      setBookings(bookings.map(b => b.id === id ? { ...b, ...editData } : b));
      setEditingId(null);
      setEditData({});
    } catch (err) {
      alert("Lưu chỉnh sửa thất bại!");
    }
  }

  return (
    <div className="admin-layout">
      {/* Sidebar menu luôn hiển thị, không cần đóng/mở */}
      <aside className="admin-sidebar-pro static">
        <div className="sidebar-header">
          <span className="sidebar-logo">Open <b>Admin</b></span>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <button className={`sidebar-menu-btn${location.pathname === '/' ? ' active' : ''}`} onClick={() => navigate('/') }>
                <FaHome style={{marginRight: 8}} /> Trang chủ
              </button>
            </li>
            <li>
              <button className={`sidebar-menu-btn${location.pathname === '/admin/stats' ? ' active' : ''}`} onClick={() => navigate('/admin/stats')}>
                <FaChartBar style={{marginRight: 8}} /> Thống kê
              </button>
            </li>
            <li className="sidebar-section">Quản lý</li>
            <li>
              <button className={`sidebar-menu-btn${location.pathname === '/admin' ? ' active' : ''}`} onClick={() => navigate('/admin')}>
                <span style={{marginRight: 8}}>📋</span> Đặt lịch khám
              </button>
            </li>
            <li>
              <button className={`sidebar-menu-btn${location.pathname === '/admin/specialties' ? ' active' : ''}`} onClick={() => navigate('/admin/specialties')}>
                <FaStethoscope style={{marginRight: 8}} /> Quản lý chuyên khoa
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="admin-main-content">
        <h2 className="admin-title">Quản lý danh sách đặt lịch khám</h2>
        {loading ? (
          <div>Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="text-danger">{error}</div>
        ) : bookings.length === 0 ? (
          <div>Chưa có lịch đặt nào.</div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Họ tên</th>
                  <th>SĐT</th>
                  <th>Email</th>
                  <th>Chuyên khoa</th>
                  <th>Ngày khám</th>
                  <th>Ghi chú</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, idx) => (
                  <tr key={b.id}>
                    {editingId === b.id ? (
                      <>
                        <td><input value={editData.fullName} onChange={e => setEditData({...editData, fullName: e.target.value})} className="admin-edit-input" /></td>
                        <td><input value={editData.phone} onChange={e => setEditData({...editData, phone: e.target.value})} className="admin-edit-input" /></td>
                        <td><input value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} className="admin-edit-input" /></td>
                        <td><input value={editData.department} onChange={e => setEditData({...editData, department: e.target.value})} className="admin-edit-input" /></td>
                        <td><input type="date" value={editData.date} onChange={e => setEditData({...editData, date: e.target.value})} className="admin-edit-input" /></td>
                        <td><input value={editData.notes} onChange={e => setEditData({...editData, notes: e.target.value})} className="admin-edit-input" /></td>
                        <td>
                          <button className="admin-save-btn" onClick={() => saveEdit(b.id)}>Lưu</button>
                          <button className="admin-cancel-btn" onClick={cancelEdit}>Hủy</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{b.fullName || b.name || ''}</td>
                        <td>{b.phone}</td>
                        <td>{b.email || ''}</td>
                        <td>{b.department || b.specialty || ''}</td>
                        <td>{b.date}</td>
                        <td>{b.notes || b.note || ''}</td>
                        <td>
                          <button className="admin-edit-btn" onClick={() => startEdit(b)} title="Chỉnh sửa"><FaEdit /></button>
                          <button className="admin-delete-btn" onClick={() => handleDelete(b.id)}>
                            Xóa
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
