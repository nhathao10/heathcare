import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { FaHome, FaChartBar, FaStethoscope, FaUserMd } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import "./AdminPage.css";

export default function AdminSpecialtiesPage() {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchSpecialties();
  }, []);

  async function fetchSpecialties() {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "specialties"));
    setSpecialties(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    await addDoc(collection(db, "specialties"), {
      name: newName,
      description: newDesc,
    });
    setNewName("");
    setNewDesc("");
    fetchSpecialties();
  }

  async function handleDelete(id) {
    await deleteDoc(doc(db, "specialties", id));
    fetchSpecialties();
  }

  function startEdit(s) {
    setEditId(s.id);
    setEditName(s.name);
    setEditDesc(s.description || "");
  }

  async function handleEditSave(id) {
    await updateDoc(doc(db, "specialties", id), {
      name: editName,
      description: editDesc,
    });
    setEditId(null);
    fetchSpecialties();
  }

  return (
    <div className="admin-layout">
      {/* Sidebar menu luôn hiển thị, không cần đóng/mở */}
      <aside className="admin-sidebar-pro static">
        <div className="sidebar-header">
          <span className="sidebar-logo">Open <b>Admin</b></span>
        </div>
        <nav className="sidebar-nav">
          <ul style={{padding: 0, margin: 0, listStyle: 'none'}}>
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
            <li>
              <button className={`sidebar-menu-btn${location.pathname === '/admin/doctors' ? ' active' : ''}`} onClick={() => navigate('/admin/doctors')}>
                <FaUserMd style={{marginRight: 8}} /> Quản lý bác sĩ
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="admin-main-content">
        <div className="admin-title">Quản lý Chuyên khoa</div>
        <form onSubmit={handleAdd} style={{marginBottom: 24, display: 'flex', gap: 12}}>
          <input
            className="admin-edit-input"
            placeholder="Tên chuyên khoa"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required
          />
          <input
            className="admin-edit-input"
            placeholder="Mô tả (tuỳ chọn)"
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
          />
          <button className="admin-save-btn" type="submit">Thêm</button>
        </form>
        <div className="admin-table-wrapper">
          {loading ? "Đang tải..." : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên chuyên khoa</th>
                  <th>Mô tả</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {specialties.map(s => (
                  <tr key={s.id}>
                    <td>
                      {editId === s.id ? (
                        <input className="admin-edit-input" value={editName} onChange={e => setEditName(e.target.value)} />
                      ) : s.name}
                    </td>
                    <td>
                      {editId === s.id ? (
                        <input className="admin-edit-input" value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                      ) : s.description}
                    </td>
                    <td>
                      {editId === s.id ? (
                        <>
                          <button className="admin-save-btn" onClick={() => handleEditSave(s.id)}>Lưu</button>
                          <button className="admin-cancel-btn" onClick={() => setEditId(null)}>Huỷ</button>
                        </>
                      ) : (
                        <>
                          <button className="admin-edit-btn" onClick={() => startEdit(s)}>Sửa</button>
                          <button className="admin-delete-btn" onClick={() => handleDelete(s.id)}>Xoá</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
