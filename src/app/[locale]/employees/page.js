"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';
import { useDemoStore } from '@/components/DemoStoreProvider';
import { EmployeesHeader, EmployeesFilters, EmployeesTable, EmployeesPagination, DeleteEmployeeDialog, AddEmployeeDialog, EditEmployeeDialog } from '@/components/features/employees/EmployeesSections';

const ITEMS_PER_PAGE = 5;

export default function EmployeesPage() {
  const t = useTranslations('Employees');
  const { employees, addEmployee, updateEmployee, removeEmployee } = useDemoStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);

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
  const roles = ['all', 'admin', 'manager', 'employee'];

  const handleDelete = (id) => {
    removeEmployee(id);
    setShowDeleteConfirm(null);
    setOpenMenuId(null);
    toast.success(t('deleteSuccess'));
  };

  const handleEdit = (emp) => {
    setEditEmployee({ ...emp });
    setShowEditModal(true);
    setOpenMenuId(null);
  };

  const handleSaveEdit = () => {
    updateEmployee(editEmployee.id, editEmployee);
    setShowEditModal(false);
    toast.success(t('editSuccess'));
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
      role: formData.get('role') || 'employee',
      cardStatus: 'pending',
    };
    addEmployee(newEmp);
    setShowAddModal(false);
    toast.success(t('addSuccess'));
  };

  return (
    <div className="emp-page">
      <EmployeesHeader
        t={t}
        onSendInvitations={() => toast.success(t('invitationsSent'))}
        onBulkUpload={() => toast(t('bulkUploadHint'))}
        onAddEmployee={() => setShowAddModal(true)}
      />

      <EmployeesFilters
        t={t}
        searchQuery={searchQuery}
        setSearchQuery={(value) => { setSearchQuery(value); setCurrentPage(1); }}
        departmentFilter={departmentFilter}
        setDepartmentFilter={(value) => { setDepartmentFilter(value); setCurrentPage(1); }}
        roleFilter={roleFilter}
        setRoleFilter={(value) => { setRoleFilter(value); setCurrentPage(1); }}
        departments={departments}
        roles={roles}
      />

      <EmployeesTable
        t={t}
        employees={paginatedEmployees}
        openMenuId={openMenuId}
        setOpenMenuId={setOpenMenuId}
        onEdit={handleEdit}
        onDelete={(id) => { setShowDeleteConfirm(id); setOpenMenuId(null); }}
      />

      <EmployeesPagination t={t} totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} filteredEmployeesLength={filteredEmployees.length} itemsPerPage={ITEMS_PER_PAGE} />

      <DeleteEmployeeDialog t={t} isOpen={Boolean(showDeleteConfirm)} onClose={() => setShowDeleteConfirm(null)} onConfirm={() => handleDelete(showDeleteConfirm)} />

      <AddEmployeeDialog t={t} isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSubmit={handleAdd} departments={departments} roles={roles} />

      <EditEmployeeDialog
        t={t}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        employee={editEmployee}
        onChange={setEditEmployee}
        onSave={handleSaveEdit}
        departments={departments}
        roles={roles}
      />
    </div>
  );
}
