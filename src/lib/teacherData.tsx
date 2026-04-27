/* eslint-disable react-refresh/only-export-components */
import React, { useState, createContext, useContext, ReactNode } from 'react';
export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  lrn: string;
  gradeLevel: string;
  sectionId: string;
  gender: string;
  birthDate: string;
  status: 'Enrolled' | 'Pending' | 'Rejected';
  grades: Record<string, number>; // subjectCode -> grade
  bmi: {
    height: string;
    weight: string;
  };
};
export type AttendanceEntry = {
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
};
type TeacherContextType = {
  students: Student[];
  updateStudentStatus: (id: string, status: 'Enrolled' | 'Rejected') => void;
  updateStudentGrade: (id: string, subjectCode: string, grade: number) => void;
  updateStudentBmi: (id: string, height: string, weight: string) => void;
  attendance: AttendanceEntry[];
  submitAttendance: (entries: AttendanceEntry[]) => void;
  getAttendanceForDate: (date: string) => AttendanceEntry[];
  todayDate: string;
};
const today = new Date().toISOString().split('T')[0];
const generatePastAttendance = (studentIds: string[]): AttendanceEntry[] => {
  const entries: AttendanceEntry[] = [];
  const now = new Date();
  for (let d = 1; d <= 20; d++) {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    const dateStr = date.toISOString().split('T')[0];
    studentIds.forEach((sid) => {
      const r = Math.random();
      entries.push({
        studentId: sid,
        date: dateStr,
        status: r > 0.92 ? 'Absent' : r > 0.82 ? 'Late' : 'Present'
      });
    });
  }
  return entries;
};
const initialStudents: Student[] = [
{
  id: 's1',
  firstName: 'Juan',
  lastName: 'Dela Cruz',
  lrn: '123456789012',
  gradeLevel: '1',
  sectionId: '1',
  gender: 'Male',
  birthDate: '2016-05-14',
  status: 'Enrolled',
  grades: {
    MATH101: 85,
    SCI101: 88,
    ENG101: 82
  },
  bmi: {
    height: '110',
    weight: '20'
  }
},
{
  id: 's2',
  firstName: 'Maria',
  lastName: 'Santos',
  lrn: '123456789013',
  gradeLevel: '1',
  sectionId: '1',
  gender: 'Female',
  birthDate: '2016-03-22',
  status: 'Enrolled',
  grades: {
    MATH101: 92,
    SCI101: 95,
    ENG101: 90
  },
  bmi: {
    height: '108',
    weight: '19'
  }
},
{
  id: 's3',
  firstName: 'Pedro',
  lastName: 'Garcia',
  lrn: '123456789014',
  gradeLevel: '1',
  sectionId: '1',
  gender: 'Male',
  birthDate: '2016-08-10',
  status: 'Enrolled',
  grades: {
    MATH101: 78,
    SCI101: 75,
    ENG101: 80
  },
  bmi: {
    height: '112',
    weight: '22'
  }
},
{
  id: 's4',
  firstName: 'Ana',
  lastName: 'Reyes',
  lrn: '123456789015',
  gradeLevel: '1',
  sectionId: '1',
  gender: 'Female',
  birthDate: '2016-01-30',
  status: 'Enrolled',
  grades: {
    MATH101: 88,
    SCI101: 90,
    ENG101: 86
  },
  bmi: {
    height: '106',
    weight: '18'
  }
},
{
  id: 's5',
  firstName: 'Jose',
  lastName: 'Martinez',
  lrn: '123456789016',
  gradeLevel: '1',
  sectionId: '1',
  gender: 'Male',
  birthDate: '2016-11-05',
  status: 'Enrolled',
  grades: {
    MATH101: 90,
    SCI101: 87,
    ENG101: 92
  },
  bmi: {
    height: '115',
    weight: '21'
  }
},
{
  id: 's6',
  firstName: 'Rosa',
  lastName: 'Aquino',
  lrn: '123456789017',
  gradeLevel: '1',
  sectionId: '1',
  gender: 'Female',
  birthDate: '2016-07-18',
  status: 'Pending',
  grades: {},
  bmi: {
    height: '105',
    weight: '17'
  }
},
{
  id: 's7',
  firstName: 'Carlo',
  lastName: 'Mendoza',
  lrn: '123456789018',
  gradeLevel: '1',
  sectionId: '1',
  gender: 'Male',
  birthDate: '2016-09-25',
  status: 'Pending',
  grades: {},
  bmi: {
    height: '109',
    weight: '20'
  }
}];

const enrolledIds = initialStudents.
filter((s) => s.status === 'Enrolled').
map((s) => s.id);
const TeacherContext = createContext<TeacherContextType | undefined>(undefined);
export function TeacherDataProvider({ children }: {children: ReactNode;}) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>(
    generatePastAttendance(enrolledIds)
  );
  const updateStudentStatus = (id: string, status: 'Enrolled' | 'Rejected') => {
    setStudents(
      students.map((s) =>
      s.id === id ?
      {
        ...s,
        status
      } :
      s
      )
    );
  };
  const updateStudentGrade = (
  id: string,
  subjectCode: string,
  grade: number) =>
  {
    setStudents(
      students.map((s) =>
      s.id === id ?
      {
        ...s,
        grades: {
          ...s.grades,
          [subjectCode]: grade
        }
      } :
      s
      )
    );
  };
  const updateStudentBmi = (id: string, height: string, weight: string) => {
    setStudents(
      students.map((s) =>
      s.id === id ?
      {
        ...s,
        bmi: {
          height,
          weight
        }
      } :
      s
      )
    );
  };
  const submitAttendance = (entries: AttendanceEntry[]) => {
    // Remove existing entries for the same date, then add new ones
    const date = entries[0]?.date;
    if (!date) return;
    const filtered = attendance.filter((a) => a.date !== date);
    setAttendance([...filtered, ...entries]);
  };
  const getAttendanceForDate = (date: string) => {
    return attendance.filter((a) => a.date === date);
  };
  return (
    <TeacherContext.Provider
      value={{
        students,
        updateStudentStatus,
        updateStudentGrade,
        updateStudentBmi,
        attendance,
        submitAttendance,
        getAttendanceForDate,
        todayDate: today
      }}>
      
      {children}
    </TeacherContext.Provider>);

}
export function useTeacherData() {
  const context = useContext(TeacherContext);
  if (!context)
  throw new Error('useTeacherData must be used within TeacherDataProvider');
  return context;
}