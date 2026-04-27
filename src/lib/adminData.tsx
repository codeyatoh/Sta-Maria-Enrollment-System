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
  name: string;
  gradeLevel: string;
};
export type Section = {
  id: string;
  name: string;
  classroomId: string;
};
export type Subject = {
  id: string;
  name: string;
  code: string;
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
  addClassroom: (c: Omit<Classroom, 'id'>) => void;
  sections: Section[];
  addSection: (s: Omit<Section, 'id'>) => void;
  subjects: Subject[];
  addSubject: (s: Omit<Subject, 'id'>) => void;
  users: User[];
  addUser: (u: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  assignments: Assignment[];
  addAssignment: (a: Omit<Assignment, 'id'>) => void;
  setupComplete: boolean;
  setSetupComplete: (val: boolean) => void;
  isSystemInitialized: boolean;
};
const initialUsers: User[] = [
{
  id: '1',
  firstName: 'Maria',
  lastName: 'Santos',
  gender: 'Female',
  contactNumber: '09123456789',
  email: 'maria.santos@school.edu',
  role: 'Teacher',
  status: 'Active',
  createdAt: '2024-01-15'
},
{
  id: '2',
  firstName: 'Juan',
  lastName: 'Dela Cruz',
  gender: 'Male',
  contactNumber: '09123456780',
  email: 'juan.delacruz@school.edu',
  role: 'Teacher',
  status: 'Active',
  createdAt: '2024-02-10'
},
{
  id: '3',
  firstName: 'Ana',
  lastName: 'Garcia',
  gender: 'Female',
  contactNumber: '09123456781',
  email: 'ana.garcia@school.edu',
  role: 'Parent',
  status: 'Pending',
  createdAt: '2024-03-05'
},
{
  id: '4',
  firstName: 'Pedro',
  lastName: 'Reyes',
  gender: 'Male',
  contactNumber: '09123456782',
  email: 'pedro.reyes@school.edu',
  role: 'Teacher',
  status: 'Active',
  createdAt: '2024-03-20'
},
{
  id: '5',
  firstName: 'Elena',
  lastName: 'Gomez',
  gender: 'Female',
  contactNumber: '09123456783',
  email: 'elena.gomez@school.edu',
  role: 'Parent',
  status: 'Active',
  createdAt: '2024-04-01'
}];

const initialClassrooms: Classroom[] = [
{
  id: '1',
  name: 'Grade 1',
  gradeLevel: '1'
},
{
  id: '2',
  name: 'Grade 2',
  gradeLevel: '2'
},
{
  id: '3',
  name: 'Grade 3',
  gradeLevel: '3'
}];

const initialSections: Section[] = [
{
  id: '1',
  name: 'Section A',
  classroomId: '1'
},
{
  id: '2',
  name: 'Section B',
  classroomId: '1'
},
{
  id: '3',
  name: 'Section A',
  classroomId: '2'
}];

const initialSubjects: Subject[] = [
{
  id: '1',
  name: 'Mathematics',
  code: 'MATH101'
},
{
  id: '2',
  name: 'Science',
  code: 'SCI101'
},
{
  id: '3',
  name: 'English',
  code: 'ENG101'
}];

const initialAssignments: Assignment[] = [
{
  id: '1',
  teacherId: '1',
  classroomId: '1',
  sectionId: '1'
}];

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
  const addClassroom = (c: Omit<Classroom, 'id'>) =>
  setClassrooms([
  ...classrooms,
  {
    ...c,
    id: Date.now().toString()
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
  const addSubject = (s: Omit<Subject, 'id'>) =>
  setSubjects([
  ...subjects,
  {
    ...s,
    id: Date.now().toString()
  }]
  );
  const addUser = (u: Omit<User, 'id' | 'createdAt'>) =>
  setUsers([
  ...users,
  {
    ...u,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0]
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
  return (
    <AdminContext.Provider
      value={{
        schoolYear,
        setSchoolYear,
        classrooms,
        addClassroom,
        sections,
        addSection,
        subjects,
        addSubject,
        users,
        addUser,
        updateUser,
        deleteUser,
        assignments,
        addAssignment,
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