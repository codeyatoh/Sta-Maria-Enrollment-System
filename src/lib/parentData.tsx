/* eslint-disable react-refresh/only-export-components */
import React, { useState, createContext, useContext, ReactNode } from 'react';
export type AttendanceRecord = {
  date: string;
  status: 'Present' | 'Absent' | 'Late';
};
export type Child = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDate: string;
  gender: string;
  lrn: string;
  gradeLevel: string;
  classroomId?: string;
  sectionId?: string;
  address: {
    street: string;
    barangay: string;
    city: string;
    province: string;
    zipCode: string;
  };
  medical: {
    height: string;
    weight: string;
    bloodType: string;
    allergies: string;
    hasDiagnosis: boolean;
    diagnoses: string[];
    hasManifestations: boolean;
    manifestations: string[];
    hasPwdId: boolean;
    pwdId: string;
    emergencyContact: string;
    emergencyPhone: string;
  };
  additional: {
    motherTongue: string;
    religion: string;
    isIndigenous: boolean;
    indigenousGroup: string;
    is4ps: boolean;
    learningMode: 'Modular Print' | 'Digital' | 'Blended';
  };
  status: 'Pending' | 'Enrolled' | 'Rejected';
  requirements: 'Complete' | 'Incomplete' | string;
  submittedAt: string;
  attendance: AttendanceRecord[];
};
type ParentContextType = {
  children: Child[];
  addChild: (
  child: Omit<
    Child,
    'id' | 'status' | 'requirements' | 'submittedAt' | 'attendance'>)

  => void;
  updateChild: (id: string, updates: Partial<Child>) => void;
};
const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  for (let i = 0; i < 25; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    // Skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    // Random status weighted towards Present
    const rand = Math.random();
    const status = rand > 0.95 ? 'Absent' : rand > 0.85 ? 'Late' : 'Present';
    records.push({
      date: d.toISOString().split('T')[0],
      status
    });
  }
  return records;
};
export const initialChildren: Child[] = [
{
  id: '1',
  firstName: 'Juan',
  lastName: 'Dela Cruz',
  middleName: 'Santos',
  birthDate: '2016-05-14',
  gender: 'Male',
  lrn: '123456789012',
  gradeLevel: '1',
  address: {
    street: '123 Rizal St',
    barangay: 'Poblacion',
    city: 'Sta. Maria',
    province: 'Bulacan',
    zipCode: '3022'
  },
  medical: {
    height: '110',
    weight: '20',
    bloodType: 'O+',
    allergies: 'None',
    hasDiagnosis: false,
    diagnoses: [],
    hasManifestations: false,
    manifestations: [],
    hasPwdId: false,
    pwdId: '',
    emergencyContact: 'Maria Dela Cruz',
    emergencyPhone: '09123456789'
  },
  additional: {
    motherTongue: 'Tagalog',
    religion: 'Catholic',
    isIndigenous: false,
    indigenousGroup: '',
    is4ps: false,
    learningMode: 'Blended'
  },
  status: 'Enrolled',
  requirements: 'Complete',
  submittedAt: '2024-07-15',
  attendance: generateMockAttendance()
},
{
  id: '2',
  firstName: 'Ana',
  lastName: 'Dela Cruz',
  middleName: 'Santos',
  birthDate: '2014-08-22',
  gender: 'Female',
  lrn: '123456789013',
  gradeLevel: '3',
  address: {
    street: '123 Rizal St',
    barangay: 'Poblacion',
    city: 'Sta. Maria',
    province: 'Bulacan',
    zipCode: '3022'
  },
  medical: {
    height: '125',
    weight: '25',
    bloodType: 'O+',
    allergies: 'Peanuts',
    hasDiagnosis: true,
    diagnoses: ['Asthma'],
    hasManifestations: false,
    manifestations: [],
    hasPwdId: false,
    pwdId: '',
    emergencyContact: 'Maria Dela Cruz',
    emergencyPhone: '09123456789'
  },
  additional: {
    motherTongue: 'Tagalog',
    religion: 'Catholic',
    isIndigenous: false,
    indigenousGroup: '',
    is4ps: false,
    learningMode: 'Blended'
  },
  status: 'Pending',
  requirements: 'Missing Medical Certificate',
  submittedAt: '2024-08-01',
  attendance: []
}];

const ParentContext = createContext<ParentContextType | undefined>(undefined);
export function ParentDataProvider({
  children: reactChildren


}: {children: ReactNode;}) {
  const [children, setChildren] = useState<Child[]>(initialChildren);
  const addChild = (
  childData: Omit<
    Child,
    'id' | 'status' | 'requirements' | 'submittedAt' | 'attendance'>) =>

  {
    const newChild: Child = {
      ...childData,
      id: Date.now().toString(),
      status: 'Pending',
      requirements: 'Complete',
      submittedAt: new Date().toISOString().split('T')[0],
      attendance: []
    };
    setChildren([...children, newChild]);
  };
  const updateChild = (id: string, updates: Partial<Child>) => {
    setChildren(
      children.map((c) =>
      c.id === id ?
      {
        ...c,
        ...updates
      } :
      c
      )
    );
  };
  return (
    <ParentContext.Provider
      value={{
        children,
        addChild,
        updateChild
      }}>
      
      {reactChildren}
    </ParentContext.Provider>);

}
export function useParentData() {
  const context = useContext(ParentContext);
  if (context === undefined) {
    throw new Error('useParentData must be used within a ParentDataProvider');
  }
  return context;
}