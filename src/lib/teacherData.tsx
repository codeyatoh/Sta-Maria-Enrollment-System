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
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  lrn: string;
  gradeLevel: string;
  sectionId: string;
  birthDate: string;
  status: 'Enrolled' | 'Dropped' | 'Transferred' | 'Pending' | 'Rejected';
  grades?: Record<string, number>;
  medical?: {
    height: string;
    weight: string;
    [key: string]: any;
  };
};

export type AttendanceEntry = {
  id: string;
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  sectionId: string;
};

type TeacherContextType = {
  students: Student[];
  subjects: any[];
  attendance: AttendanceEntry[];
  currentSection: string;
  updateAttendance: (studentId: string, date: string, status: 'Present' | 'Absent' | 'Late') => Promise<void>;
  updateStudentStatus: (id: string, status: 'Enrolled' | 'Rejected') => Promise<void>;
  updateStudentGrade: (id: string, subjectCode: string, grade: number) => Promise<void>;
  updateStudentBmi: (id: string, height: string, weight: string) => Promise<void>;
  loading: boolean;
};

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

export function TeacherDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([]);
  const [currentSection, setCurrentSection] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStudents([]);
      setAttendance([]);
      setCurrentSection('');
      setLoading(false);
      return;
    }

    // 1. Get Teacher's Assignment
    const qAssign = query(collection(db, 'assignments'), where('teacherId', '==', user.uid));
    const unsubAssign = onSnapshot(qAssign, (snap) => {
      if (!snap.empty) {
        const assign = snap.docs[0].data();
        const sectionId = assign.sectionId;
        setCurrentSection(sectionId);

        let isCleanedUp = false;
        let unsubPending = () => {};
        let unsubEnrolled = () => {};

        getDoc(doc(db, 'sections', sectionId)).then((secSnap) => {
          if (isCleanedUp || !secSnap.exists()) return;
          const gradeLevel = secSnap.data().gradeLevel;

          let pendingStudents: Student[] = [];
          let enrolledStudents: Student[] = [];

          // 2a. Get Pending Students for this gradeLevel
          const qPending = query(
            collection(db, 'enrollments'), 
            where('gradeLevel', '==', gradeLevel), 
            where('status', '==', 'Pending')
          );
          unsubPending = onSnapshot(qPending, (sSnap) => {
            pendingStudents = sSnap.docs.map(d => ({ id: d.id, ...d.data() } as Student));
            setStudents([...pendingStudents, ...enrolledStudents]);
          });

          // 2b. Get Enrolled Students for this sectionId
          const qEnrolled = query(
            collection(db, 'enrollments'), 
            where('sectionId', '==', sectionId), 
            where('status', 'in', ['Enrolled', 'Dropped', 'Transferred'])
          );
          unsubEnrolled = onSnapshot(qEnrolled, (sSnap) => {
            enrolledStudents = sSnap.docs.map(d => ({ id: d.id, ...d.data() } as Student));
            setStudents([...pendingStudents, ...enrolledStudents]);
          });
        });

        // 3. Get Attendance for this section
        const qAttendance = query(collection(db, 'attendance'), where('sectionId', '==', sectionId));
        const unsubAttendance = onSnapshot(qAttendance, (aSnap) => {
          setAttendance(aSnap.docs.map(d => ({ id: d.id, ...d.data() } as AttendanceEntry)));
        });

        // 4. Get Subjects
        const unsubSubjects = onSnapshot(query(collection(db, 'subjects')), (sSnap) => {
          setSubjects(sSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        setLoading(false);
        return () => {
          isCleanedUp = true;
          unsubPending();
          unsubEnrolled();
          unsubAttendance();
          unsubSubjects();
        };
      } else {
        setStudents([]);
        setAttendance([]);
        setCurrentSection('');
        setLoading(false);
      }
    });

    return () => unsubAssign();
  }, [user]);

  const updateAttendance = async (studentId: string, date: string, status: 'Present' | 'Absent' | 'Late') => {
    if (!currentSection) return;

    const existing = attendance.find(a => a.studentId === studentId && a.date === date);
    
    if (existing) {
      await updateDoc(doc(db, 'attendance', existing.id), { status });
    } else {
      await addDoc(collection(db, 'attendance'), {
        studentId,
        date,
        status,
        sectionId: currentSection,
        createdAt: serverTimestamp()
      });
    }
  };

  const updateStudentStatus = async (id: string, status: 'Enrolled' | 'Rejected') => {
    if (status === 'Enrolled' && currentSection) {
      await updateDoc(doc(db, 'enrollments', id), { status, sectionId: currentSection });
    } else {
      await updateDoc(doc(db, 'enrollments', id), { status });
    }
  };

  const updateStudentGrade = async (id: string, subjectCode: string, grade: number) => {
    const student = students.find(s => s.id === id);
    if (!student) return;
    
    const grades = { ...(student.grades || {}), [subjectCode]: grade };
    await updateDoc(doc(db, 'enrollments', id), { grades });
  };

  const updateStudentBmi = async (id: string, height: string, weight: string) => {
    const student = students.find(s => s.id === id);
    if (!student) return;
    const medical = { ...(student.medical || {}), height, weight };
    await updateDoc(doc(db, 'enrollments', id), { medical });
  };

  return (
    <TeacherContext.Provider
      value={{
        students,
        subjects,
        attendance,
        currentSection,
        updateAttendance,
        updateStudentStatus,
        updateStudentGrade,
        updateStudentBmi,
        loading
      }}>
      {children}
    </TeacherContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTeacherData() {
  const context = useContext(TeacherContext);
  if (context === undefined) {
    throw new Error('useTeacherData must be used within a TeacherDataProvider');
  }
  return context;
}