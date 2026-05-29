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
import {
  PHASE2_SCHEMA_VERSION,
  DocumentType,
  EnrollmentDocument,
  RequirementUploadMeta
} from './schema/phase2';
import {
  mergeAttendanceWithCompatibility
} from './services/attendanceCompatibilityService';
import {
  subscribeParentEnrollmentDocuments,
  uploadEnrollmentRequirementDocument
} from './services/enrollmentDocumentsService';

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
  requirementUploads?: {
    psaBirthCertificate?: RequirementUploadMeta;
    [key: string]: RequirementUploadMeta | undefined;
  };
  schemaVersion?: number;
  submittedAt: unknown;
  attendance: AttendanceRecord[];
};
type ParentContextType = {
  children: Child[];
  documents: EnrollmentDocument[];
  addChild: (
  child: Omit<
    Child,
    'id' | 'status' | 'requirements' | 'submittedAt' | 'attendance' | 'parentId'>)
  => Promise<string>;
  updateChild: (id: string, updates: Partial<Child>) => Promise<void>;
  uploadRequirementDocument: (params: {
    enrollmentId: string;
    documentType: DocumentType;
    file: File;
    studentName?: string;
    gradeLevel?: string;
  }) => Promise<void>;
  loading: boolean;
  documentsLoading: boolean;
};

const ParentContext = createContext<ParentContextType | undefined>(undefined);

export function ParentDataProvider({ children: reactChildren }: {children: ReactNode;}) {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [documents, setDocuments] = useState<EnrollmentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setChildren([]);
      setDocuments([]);
      setLoading(false);
      setDocumentsLoading(false);
      return;
    }

    let currentChildren: Child[] = [];
    const attendanceByStudent: Record<string, AttendanceRecord[]> = {};
    const attendanceUnsubs: Array<() => void> = [];

    const rebuildChildren = () => {
      const merged = currentChildren.map((child) => ({
        ...child,
        attendance: mergeAttendanceWithCompatibility({
          studentId: child.id,
          canonicalEntries: Object.entries(attendanceByStudent).flatMap(([studentId, entries]) =>
            entries.map((entry) => ({ studentId, ...entry }))
          ),
          legacyEntries: child.attendance
        })
      }));
      setChildren(merged);
    };

    const q = query(collection(db, 'enrollments'), where('parentId', '==', user.uid));
    const unsubscribeEnrollments = onSnapshot(q, (snapshot) => {
      currentChildren = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Child));
      rebuildChildren();

      while (attendanceUnsubs.length > 0) {
        const unsub = attendanceUnsubs.pop();
        if (unsub) unsub();
      }

      currentChildren.forEach((child) => {
        const attendanceQuery = query(collection(db, 'attendance'), where('studentId', '==', child.id));
        const attendanceUnsub = onSnapshot(attendanceQuery, (attendanceSnapshot) => {
          attendanceByStudent[child.id] = attendanceSnapshot.docs.map((d) => {
            const row = d.data() as AttendanceRecord;
            return { date: row.date, status: row.status };
          });
          rebuildChildren();
        });
        attendanceUnsubs.push(attendanceUnsub);
      });

      setLoading(false);
    });

    const unsubscribeDocuments = subscribeParentEnrollmentDocuments(user.uid, (rows) => {
      setDocuments(rows);
      setDocumentsLoading(false);
    });

    return () => {
      unsubscribeEnrollments();
      unsubscribeDocuments();
      while (attendanceUnsubs.length > 0) {
        const unsub = attendanceUnsubs.pop();
        if (unsub) unsub();
      }
    };
  }, [user]);

  const addChild = async (
    childData: Omit<Child, 'id' | 'status' | 'requirements' | 'submittedAt' | 'attendance' | 'parentId'>
  ): Promise<string> => {
    if (!user) throw new Error("Not authenticated");
    const docRef = await addDoc(collection(db, 'enrollments'), {
      ...childData,
      parentId: user.uid,
      status: 'Pending',
      requirements: 'Complete',
      requirementUploads: {},
      schemaVersion: PHASE2_SCHEMA_VERSION,
      submittedAt: serverTimestamp(),
      attendance: []
    });
    return docRef.id;
  };

  const updateChild = async (id: string, updates: Partial<Child>) => {
    await updateDoc(doc(db, 'enrollments', id), updates);
  };

  const uploadRequirementDocument = async (params: {
    enrollmentId: string;
    documentType: DocumentType;
    file: File;
    studentName?: string;
    gradeLevel?: string;
  }) => {
    if (!user) return;

    let sName = params.studentName;
    let gLevel = params.gradeLevel;

    if (!sName || !gLevel) {
      const child = children.find((c) => c.id === params.enrollmentId);
      if (!child) throw new Error('Student enrollment not found.');
      sName = `${child.firstName} ${child.lastName}`;
      gLevel = child.gradeLevel;
    }

    await uploadEnrollmentRequirementDocument({
      enrollmentId: params.enrollmentId,
      parentId: user.uid,
      studentName: sName,
      gradeLevel: gLevel,
      documentType: params.documentType,
      file: params.file
    });
  };

  return (
    <ParentContext.Provider
      value={{
        children,
        documents,
        addChild,
        updateChild,
        uploadRequirementDocument,
        loading,
        documentsLoading
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
