/* eslint-disable react-refresh/only-export-components */
import React, { useState, createContext, useContext, ReactNode } from 'react';
export type SchoolYear = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};
export type Classroom = {
  id: string;
  roomName: string;
  roomType: 'Lecture' | 'Laboratory' | 'Multipurpose';
  status: 'Available' | 'Full' | 'Maintenance';
  gradeLevel: string;
  createdAt: string;
};
export type Section = {
  id: string;
  name: string;
  classroomId: string;
  gradeLevel: string;
  status: 'Active' | 'Inactive';
};
export type Subject = {
  id: string;
  name: string;
  code: string;
  gradeLevel: string;
  units: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
  academicYear: string;
};
export type User = {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  gender: 'Male' | 'Female' | 'Other';
  contactNumber: string;
  email: string;
  role: 'Teacher' | 'Parent';
  status: 'Active' | 'Pending';
  password?: string;
  createdAt: string;
};
export type Assignment = {
  id: string;
  teacherId: string;
  classroomId: string;
  sectionId: string;
};
type AdminContextType = {
  schoolYear: SchoolYear | null;
  setSchoolYear: (sy: SchoolYear | null) => void;
  classrooms: Classroom[];
  addClassroom: (c: Omit<Classroom, 'id' | 'createdAt'>) => void;
  updateClassroom: (id: string, updates: Partial<Classroom>) => void;
  deleteClassroom: (id: string) => void;
  sections: Section[];
  addSection: (s: Omit<Section, 'id'>) => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  deleteSection: (id: string) => void;
  subjects: Subject[];
  addSubject: (s: Omit<Subject, 'id' | 'createdAt'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  users: User[];
  addUser: (u: Omit<User, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  assignments: Assignment[];
  addAssignment: (a: Omit<Assignment, 'id'>) => void;
  deleteAssignment: (id: string) => void;
  setupComplete: boolean;
  setSetupComplete: (val: boolean) => void;
  isSystemInitialized: boolean;
};
const initialUsers: User[] = [];

const initialClassrooms: Classroom[] = [];
const initialSections: Section[] = [];
const initialSubjects: Subject[] = [];
const initialAssignments: Assignment[] = [];

const initialSchoolYear: SchoolYear = {
  id: '1',
  name: '2024-2025',
  startDate: '2024-08-01',
  endDate: '2025-05-31',
  isActive: true
};
const AdminContext = createContext<AdminContextType | undefined>(undefined);
export function AdminDataProvider({ children }: {children: ReactNode;}) {
  const [schoolYear, setSchoolYear] = useState<SchoolYear | null>(
    initialSchoolYear
  );
  const [classrooms, setClassrooms] = useState<Classroom[]>(initialClassrooms);
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [assignments, setAssignments] =
  useState<Assignment[]>(initialAssignments);
  const [setupComplete, setSetupComplete] = useState<boolean>(true); // Starts true to show seeded data
  const isSystemInitialized =
  !!schoolYear &&
  classrooms.length > 0 &&
  sections.length > 0 &&
  subjects.length > 0;
  const addClassroom = (c: Omit<Classroom, 'id' | 'createdAt'>) =>
  setClassrooms([
  ...classrooms,
  {
    ...c,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0]
  }]
  );
  const addSection = (s: Omit<Section, 'id'>) =>
  setSections([
  ...sections,
  {
    ...s,
    id: Date.now().toString()
  }]
  );
  const updateClassroom = (id: string, updates: Partial<Classroom>) =>
    setClassrooms(classrooms.map(c => c.id === id ? { ...c, ...updates } : c));
  const deleteClassroom = (id: string) => {
    setClassrooms(classrooms.filter(c => c.id !== id));
    setSections(sections.filter(s => s.classroomId !== id));
    setAssignments(assignments.filter(a => a.classroomId !== id));
  };
  const updateSection = (id: string, updates: Partial<Section>) =>
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  const deleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
    setAssignments(assignments.filter(a => a.sectionId !== id));
  };
  const addSubject = (s: Omit<Subject, 'id' | 'createdAt'>) =>
  setSubjects([
  ...subjects,
  {
    ...s,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0]
  }]
  );
  const updateSubject = (id: string, updates: Partial<Subject>) =>
    setSubjects(subjects.map(s => s.id === id ? { ...s, ...updates } : s));
  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };
  const addUser = (u: Omit<User, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) =>
  setUsers([
  ...users,
  {
    ...u,
    id: u.id || Date.now().toString(),
    createdAt: u.createdAt || new Date().toISOString().split('T')[0]
  }]
  );
  const updateUser = (id: string, updates: Partial<User>) =>
    setUsers(users.map(u => u.id === id ? { ...u, ...updates } : u));
  const deleteUser = (id: string) => setUsers(users.filter((u) => u.id !== id));
  const addAssignment = (a: Omit<Assignment, 'id'>) =>
  setAssignments([
  ...assignments,
  {
    ...a,
    id: Date.now().toString()
  }]
  );
  const deleteAssignment = (id: string) => setAssignments(assignments.filter(a => a.id !== id));
  return (
    <AdminContext.Provider
      value={{
        schoolYear,
        setSchoolYear,
        classrooms,
        addClassroom,
        updateClassroom,
        deleteClassroom,
        sections,
        addSection,
        updateSection,
        deleteSection,
        subjects,
        addSubject,
        updateSubject,
        deleteSubject,
        users,
        addUser,
        updateUser,
        deleteUser,
        assignments,
        addAssignment,
        deleteAssignment,
        setupComplete,
        setSetupComplete,
        isSystemInitialized
      }}>
      
      {children}
    </AdminContext.Provider>);

}
export function useAdminData() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
}