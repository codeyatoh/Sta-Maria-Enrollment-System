/* eslint-disable react-refresh/only-export-components */
import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import { db } from './firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

export type AttendanceRecord = {
  date: string;
  status: 'Present' | 'Absent' | 'Late';
};
export type Child = {
  id: string;
  parentId: string;
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
  submittedAt: unknown;
  attendance: AttendanceRecord[];
};
type ParentContextType = {
  children: Child[];
  addChild: (
  child: Omit<
    Child,
    'id' | 'status' | 'requirements' | 'submittedAt' | 'attendance' | 'parentId'>)
  => Promise<void>;
  updateChild: (id: string, updates: Partial<Child>) => Promise<void>;
  loading: boolean;
};

const ParentContext = createContext<ParentContextType | undefined>(undefined);

export function ParentDataProvider({ children: reactChildren }: {children: ReactNode;}) {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setChildren([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'enrollments'), where('parentId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChildren(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Child)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addChild = async (
    childData: Omit<Child, 'id' | 'status' | 'requirements' | 'submittedAt' | 'attendance' | 'parentId'>
  ) => {
    if (!user) return;
    await addDoc(collection(db, 'enrollments'), {
      ...childData,
      parentId: user.uid,
      status: 'Pending',
      requirements: 'Complete',
      submittedAt: serverTimestamp(),
      attendance: []
    });
  };

  const updateChild = async (id: string, updates: Partial<Child>) => {
    await updateDoc(doc(db, 'enrollments', id), updates);
  };

  return (
    <ParentContext.Provider
      value={{
        children,
        addChild,
        updateChild,
        loading
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