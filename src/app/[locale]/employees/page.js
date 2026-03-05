"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Upload, Search, MoreVertical, ChevronLeft, ChevronRight, Edit2, Trash2, X, Check } from 'lucide-react';

const INITIAL_EMPLOYEES = [
  { id: 1, name: 'Ahmed Mohamed', email: 'ahmed.m@mhawer.com', avatar: 'AM', jobTitle: 'Chief Technology Officer', department: 'management', role: 'admin', cardStatus: 'active' },
  { id: 2, name: 'Sarah Khalid', email: 'sarah.k@mhawer.com', avatar: 'SK', jobTitle: 'Sales Director', department: 'sales', role: 'admin', cardStatus: 'active' },
  { id: 3, name: 'Omar Farouk', email: 'omar.f@mhawer.com', avatar: 'OF', jobTitle: 'Marketing Specialist', department: 'marketing', role: 'employee', cardStatus: 'pending' },
  { id: 4, name: 'Laila Hassan', email: 'laila.h@mhawer.com', avatar: 'LH', jobTitle: 'HR Manager', department: 'hr', role: 'admin', cardStatus: 'active' },
  { id: 5, name: 'Tarek Zaid', email: 'tarek.z@mhawer.com', avatar: 'TZ', jobTitle: 'Full Stack Developer', department: 'it', role: 'employee', cardStatus: 'inactive' },
  { id: 6, name: 'Nora Ali', email: 'nora.a@mhawer.com', avatar: 'NA', jobTitle: 'UI/UX Designer', department: 'it', role: 'employee', cardStatus: 'active' },
  { id: 7, name: 'Youssef Amin', email: 'youssef.a@mhawer.com', avatar: 'YA', jobTitle: 'Account Manager', department: 'sales', role: 'employee', cardStatus: 'pending' },
  { id: 8, name: 'Mona Rashed', email: 'mona.r@mhawer.com', avatar: 'MR', jobTitle: 'Finance Analyst', department: 'management', role: 'employee', cardStatus: 'active' },
];

const ITEMS_PER_PAGE = 5;

export default function EmployeesPage() {
  const t = useTranslations('Employees');

  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [toast, setToast] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Filtration
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;
    const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
    return matchesSearch && matchesDept && matchesRole;
  });

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const departments = ['all', 'management', 'sales', 'marketing', 'hr', 'it'];
  const roles = ['all', 'admin', 'employee'];

  const handleDelete = (id) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    setShowDeleteConfirm(null);
    setOpenMenuId(null);
    showToast(t('deleteSuccess'));
  };

  const handleEdit = (emp) => {
    setEditEmployee({ ...emp });
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleSaveEdit = () => {
    setEmployees(prev => prev.map(e => e.id === editEmployee.id ? editEmployee : e));
    setShowEditModal(false);
    showToast(t('editSuccess'));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const newEmp = {
      id: Date.now(),
      name,
      email: formData.get('email'),
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase(),
      jobTitle: formData.get('jobTitle'),
      department: formData.get('department'),
      role: formData.get('role'),
      cardStatus: 'pending',
    };
    setEmployees(prev => [newEmp, ...prev]);
    setShowAddModal(false);
    showToast(t('addSuccess'));
  };

  return (
    <div className="emp-page">
      {/* Toast */}
      {toast && (
        <div className="toast-notification">
          <Check size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* ── Header ── */}
      <div className="emp-header">
        <div>
          <h1 className="emp-title text-gradient">{t('title')}</h1>
          <p className="emp-subtitle">{t('subtitle')}</p>
        </div>
        <div className="emp-header-actions">
          <button className="btn-outline" onClick={() => showToast(t('bulkUploadHint'))}>
            <Upload size={16} />
            <span>{t('bulkUpload')}</span>
          </button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            <span>{t('addEmployee')}</span>
          </button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="emp-filters">
        <div className="emp-search">
          <Search size={18} className="emp-search-icon" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="emp-search-input"
          />
          {searchQuery && (
            <button className="emp-search-clear" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>
        <select value={departmentFilter} onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }} className="emp-select">
          {departments.map(d => <option key={d} value={d}>{t(`dept_${d}`)}</option>)}
        </select>
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }} className="emp-select">
          {roles.map(r => <option key={r} value={r}>{t(`role_${r}`)}</option>)}
        </select>
      </div>

      {/* ── Table ── */}
      <div className="emp-table-wrap glass-panel">
        <table className="emp-table">
          <thead>
            <tr>
              <th>{t('colName')}</th>
              <th>{t('colJobTitle')}</th>
              <th>{t('colDepartment')}</th>
              <th>{t('colRole')}</th>
              <th>{t('colCardStatus')}</th>
              <th className="th-actions">{t('colActions')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.length === 0 ? (
              <tr><td colSpan="6" className="emp-empty">{t('noResults')}</td></tr>
            ) : (
              paginatedEmployees.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className="emp-user">
                      <div className="emp-avatar">{emp.avatar}</div>
                      <div><p className="emp-name">{emp.name}</p><p className="emp-email">{emp.email}</p></div>
                    </div>
                  </td>
                  <td className="emp-job">{emp.jobTitle}</td>
                  <td>{t(`dept_${emp.department}`)}</td>
                  <td><span className={`emp-role-badge role-${emp.role}`}>{t(`role_${emp.role}`)}</span></td>
                  <td><span className={`emp-status-pill status-${emp.cardStatus}`}>{t(`card_${emp.cardStatus}`)}</span></td>
                  <td className="td-actions">
                    <div className="kebab-wrapper">
                      <button className="kebab-btn" onClick={() => setOpenMenuId(openMenuId === emp.id ? null : emp.id)}>
                        <MoreVertical size={18} />
                      </button>
                      {openMenuId === emp.id && (
                        <div className="kebab-menu glass-panel">
                          <button className="kebab-item" onClick={() => handleEdit(emp)}>
                            <Edit2 size={14} /><span>{t('edit')}</span>
                          </button>
                          <button className="kebab-item kebab-danger" onClick={() => { setShowDeleteConfirm(emp.id); setOpenMenuId(null); }}>
                            <Trash2 size={14} /><span>{t('delete')}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="emp-pagination">
          <span className="emp-page-info">
            {t('showing', { from: (currentPage - 1) * ITEMS_PER_PAGE + 1, to: Math.min(currentPage * ITEMS_PER_PAGE, filteredEmployees.length), total: filteredEmployees.length })}
          </span>
          <div className="emp-page-controls">
            <button className="emp-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}><ChevronLeft size={18} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} className={`emp-page-num ${page === currentPage ? 'active' : ''}`} onClick={() => setCurrentPage(page)}>{page}</button>
            ))}
            <button className="emp-page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}><ChevronRight size={18} /></button>
          </div>
        </div>
      )}

      {/* ════ Delete Confirmation Modal ════ */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-box glass-panel" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">{t('confirmDelete')}</h3>
            <p className="modal-desc">{t('confirmDeleteDesc')}</p>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowDeleteConfirm(null)}>{t('cancel')}</button>
              <button className="btn-danger" onClick={() => handleDelete(showDeleteConfirm)}><Trash2 size={14} /><span>{t('delete')}</span></button>
            </div>
          </div>
        </div>
      )}

      {/* ════ Add Employee Modal ════ */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-box glass-panel modal-form" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('addEmployee')}</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="modal-field"><label>{t('colName')}</label><input name="name" required className="modal-input" /></div>
              <div className="modal-field"><label>{t('email')}</label><input name="email" type="email" required className="modal-input" /></div>
              <div className="modal-field"><label>{t('colJobTitle')}</label><input name="jobTitle" required className="modal-input" /></div>
              <div className="modal-field">
                <label>{t('colDepartment')}</label>
                <select name="department" className="modal-input">{departments.filter(d => d !== 'all').map(d => <option key={d} value={d}>{t(`dept_${d}`)}</option>)}</select>
              </div>
              <div className="modal-field">
                <label>{t('colRole')}</label>
                <select name="role" className="modal-input">{roles.filter(r => r !== 'all').map(r => <option key={r} value={r}>{t(`role_${r}`)}</option>)}</select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline" onClick={() => setShowAddModal(false)}>{t('cancel')}</button>
                <button type="submit" className="btn-primary"><Plus size={14} /><span>{t('addEmployee')}</span></button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════ Edit Employee Modal ════ */}
      {showEditModal && editEmployee && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-box glass-panel modal-form" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('editEmployee')}</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-field"><label>{t('colName')}</label><input value={editEmployee.name} onChange={e => setEditEmployee({ ...editEmployee, name: e.target.value })} className="modal-input" /></div>
            <div className="modal-field"><label>{t('email')}</label><input value={editEmployee.email} onChange={e => setEditEmployee({ ...editEmployee, email: e.target.value })} className="modal-input" /></div>
            <div className="modal-field"><label>{t('colJobTitle')}</label><input value={editEmployee.jobTitle} onChange={e => setEditEmployee({ ...editEmployee, jobTitle: e.target.value })} className="modal-input" /></div>
            <div className="modal-field">
              <label>{t('colDepartment')}</label>
              <select value={editEmployee.department} onChange={e => setEditEmployee({ ...editEmployee, department: e.target.value })} className="modal-input">{departments.filter(d => d !== 'all').map(d => <option key={d} value={d}>{t(`dept_${d}`)}</option>)}</select>
            </div>
            <div className="modal-field">
              <label>{t('colRole')}</label>
              <select value={editEmployee.role} onChange={e => setEditEmployee({ ...editEmployee, role: e.target.value })} className="modal-input">{roles.filter(r => r !== 'all').map(r => <option key={r} value={r}>{t(`role_${r}`)}</option>)}</select>
            </div>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowEditModal(false)}>{t('cancel')}</button>
              <button className="btn-primary" onClick={handleSaveEdit}><Check size={14} /><span>{t('saveChanges')}</span></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
