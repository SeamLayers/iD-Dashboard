"use client";

import { createContext, useContext, useState } from 'react';

const DemoStoreContext = createContext(null);

const INITIAL_EMPLOYEES = [
  { id: 1, name: 'Ahmed Al-Harbi', email: 'ahmed.harbi@mhawer.com', avatar: 'AH', jobTitle: 'Chief Technology Officer', department: 'management', role: 'admin', cardStatus: 'active' },
  { id: 2, name: 'Sarah Khalid', email: 'sarah.khalid@mhawer.com', avatar: 'SK', jobTitle: 'Sales Director', department: 'sales', role: 'manager', cardStatus: 'active' },
  { id: 3, name: 'Omar Farouk', email: 'omar.farouk@mhawer.com', avatar: 'OF', jobTitle: 'Marketing Specialist', department: 'marketing', role: 'employee', cardStatus: 'pending' },
  { id: 4, name: 'Laila Hassan', email: 'laila.hassan@mhawer.com', avatar: 'LH', jobTitle: 'HR Manager', department: 'hr', role: 'manager', cardStatus: 'active' },
  { id: 5, name: 'Tarek Zaid', email: 'tarek.zaid@mhawer.com', avatar: 'TZ', jobTitle: 'Full Stack Developer', department: 'it', role: 'employee', cardStatus: 'inactive' },
  { id: 6, name: 'Nora Al-Qahtani', email: 'nora.qahtani@mhawer.com', avatar: 'NQ', jobTitle: 'UI/UX Designer', department: 'it', role: 'employee', cardStatus: 'active' },
  { id: 7, name: 'Youssef Amin', email: 'youssef.amin@mhawer.com', avatar: 'YA', jobTitle: 'Account Manager', department: 'sales', role: 'employee', cardStatus: 'pending' },
  { id: 8, name: 'Mona Rashed', email: 'mona.rashed@mhawer.com', avatar: 'MR', jobTitle: 'Finance Analyst', department: 'management', role: 'employee', cardStatus: 'active' },
  { id: 9, name: 'Faisal Al-Rashid', email: 'faisal.rashid@mhawer.com', avatar: 'FR', jobTitle: 'Enterprise Sales Manager', department: 'sales', role: 'manager', cardStatus: 'pending' },
  { id: 10, name: 'Rania Al-Salem', email: 'rania.salem@mhawer.com', avatar: 'RS', jobTitle: 'Business Development Lead', department: 'marketing', role: 'employee', cardStatus: 'active' },
];

const INITIAL_APPROVAL_REQUESTS = [
  { id: 101, employeeId: 3, name: 'Omar Farouk', company: 'Saudi Aramco', jobTitle: 'Marketing Specialist', department: 'Marketing', submittedAt: '2 hours ago', status: 'pending', phone: '+966 50 987 6543', email: 'omar.farouk@mhawer.com', linkedin: 'linkedin.com/in/omarfarouk', address: 'Riyadh, Saudi Arabia' },
  { id: 102, employeeId: 7, name: 'Youssef Amin', company: 'SABIC', jobTitle: 'Account Manager', department: 'Sales', submittedAt: '5 hours ago', status: 'pending', phone: '+966 50 111 2222', email: 'youssef.amin@mhawer.com', linkedin: 'linkedin.com/in/youssefamin', address: 'Jeddah, Saudi Arabia' },
  { id: 103, employeeId: 9, name: 'Faisal Al-Rashid', company: 'NEOM', jobTitle: 'Enterprise Sales Manager', department: 'Sales', submittedAt: '7 hours ago', status: 'pending', phone: '+966 54 325 1100', email: 'faisal.rashid@mhawer.com', linkedin: 'linkedin.com/in/faisalrashid', address: 'Tabuk, Saudi Arabia' },
  { id: 104, employeeId: 11, name: 'Huda Mansour', company: 'STC', jobTitle: 'Partnership Executive', department: 'Sales', submittedAt: '9 hours ago', status: 'pending', phone: '+966 58 700 8800', email: 'huda.mansour@mhawer.com', linkedin: 'linkedin.com/in/hudamansour', address: 'Riyadh, Saudi Arabia' },
  { id: 105, employeeId: 12, name: 'Majed Qasim', company: 'Maaden', jobTitle: 'Senior Procurement Officer', department: 'Management', submittedAt: '12 hours ago', status: 'pending', phone: '+966 56 410 2200', email: 'majed.qasim@mhawer.com', linkedin: 'linkedin.com/in/majedqasim', address: 'Dammam, Saudi Arabia' },
  { id: 106, employeeId: 13, name: 'Nadia Fares', company: 'Riyad Bank', jobTitle: 'Corporate Relations Specialist', department: 'Marketing', submittedAt: '1 day ago', status: 'pending', phone: '+966 50 884 9900', email: 'nadia.fares@mhawer.com', linkedin: 'linkedin.com/in/nadiafares', address: 'Riyadh, Saudi Arabia' },
];

export function DemoStoreProvider({ children }) {
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [approvalRequests, setApprovalRequests] = useState(INITIAL_APPROVAL_REQUESTS);

  const resetDemoData = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setApprovalRequests(INITIAL_APPROVAL_REQUESTS);
  };

  const addEmployee = (employee) => {
    setEmployees((prev) => [employee, ...prev]);
  };

  const updateEmployee = (employeeId, updates) => {
    setEmployees((prev) => prev.map((employee) => (
      employee.id === employeeId ? { ...employee, ...updates } : employee
    )));
  };

  const removeEmployee = (employeeId) => {
    setEmployees((prev) => prev.filter((employee) => employee.id !== employeeId));
  };

  const approveCard = (requestId) => {
    const request = approvalRequests.find((item) => item.id === requestId);
    if (request?.employeeId) {
      updateEmployee(request.employeeId, { cardStatus: 'active' });
    }
    setApprovalRequests((prev) => prev.filter((item) => item.id !== requestId));
  };

  const rejectCard = (requestId) => {
    const request = approvalRequests.find((item) => item.id === requestId);
    if (request?.employeeId) {
      updateEmployee(request.employeeId, { cardStatus: 'inactive' });
    }
    setApprovalRequests((prev) => prev.filter((item) => item.id !== requestId));
  };

  const value = {
    employees,
    approvalRequests,
    addEmployee,
    updateEmployee,
    removeEmployee,
    approveCard,
    rejectCard,
    resetDemoData,
  };

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
}

export function useDemoStore() {
  const context = useContext(DemoStoreContext);
  if (!context) {
    throw new Error('useDemoStore must be used inside DemoStoreProvider');
  }
  return context;
}
