import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

// ─── Interfaces ───────────────────────────────────────────────────────────────

/**
 * Represents a single learner row in the SF1 School Register.
 * All fields are optional for resilience; the UI renders blanks for missing data.
 */
export interface SF1Learner {
  id: string;
  lrn: string;
  lastName: string;
  firstName: string;
  middleName?: string;
  birthDate?: string;
  age?: number;
  birthCity?: string;
  birthProvince?: string;
  motherTongue?: string;
  indigenousGroup?: string;
  religion?: string;
  addressStreet?: string;
  addressBarangay?: string;
  addressCity?: string;
  addressProvince?: string;
  fatherName?: string;
  motherName?: string;
  guardianName?: string;
  guardianRelationship?: string;
  contactNumber?: string;
  remarks?: string;
}

export interface SF1Data {
  schoolYear: string;
  gradeLevel: string;
  section: string;
  learners: SF1Learner[];
}

/**
 * Represents one section's row in the SF4 Monthly Movement and Attendance form.
 * Absent/present/late counts default to 0 if attendance data is missing.
 */
export interface SF4SectionRow {
  gradeLevel: string;
  section: string;
  advisorName: string;
  maleCount: number;
  femaleCount: number;
  totalCount: number;
  avgDailyAttendanceMale: number;
  avgDailyAttendanceFemale: number;
  avgDailyAttendanceTotal: number;
  attendancePctMale: number;
  attendancePctFemale: number;
  attendancePctTotal: number;
}

export interface SF4Data {
  schoolYear: string;
  reportMonth: string;
  sections: SF4SectionRow[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDate(val: unknown): Date | null {
  if (!val) return null;
  if (typeof val === 'object' && 'toDate' in val && typeof (val as { toDate: () => Date }).toDate === 'function') {
    return (val as { toDate: () => Date }).toDate();
  }
  const d = new Date(val as string | number);
  return isNaN(d.getTime()) ? null : d;
}

function calcAge(birthDateStr: string | undefined): number | undefined {
  if (!birthDateStr) return undefined;
  const birth = new Date(birthDateStr);
  if (isNaN(birth.getTime())) return undefined;
  const juneFirst = new Date(new Date().getFullYear(), 5, 1);
  let age = juneFirst.getFullYear() - birth.getFullYear();
  if (
    juneFirst.getMonth() < birth.getMonth() ||
    (juneFirst.getMonth() === birth.getMonth() && juneFirst.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
}

function formatBirthDate(str: string | undefined): string {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d.getTime())) return '';
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class ReportDataService {
  /**
   * Composes SF1 data for a given school year and optional section/grade filter.
   * Pulls from `enrollments` collection (with linked user demographic fields).
   * Falls back gracefully if no matching enrollment records are found.
   */
  static async getSF1Data(
    schoolYear: string,
    gradeLevel?: string,
    sectionId?: string
  ): Promise<SF1Data> {
    try {
      const enrollRef = collection(db, 'enrollments');

      // Build composable query constraints
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const constraints: any[] = [where('schoolYear', '==', schoolYear)];
      if (gradeLevel && gradeLevel !== 'All') {
        constraints.push(where('gradeLevel', '==', gradeLevel));
      }
      if (sectionId && sectionId !== 'all') {
        constraints.push(where('sectionId', '==', sectionId));
      }
      constraints.push(orderBy('lastName', 'asc'));

      const snap = await getDocs(query(enrollRef, ...constraints));

      const learners: SF1Learner[] = snap.docs.map(d => {
        const data = d.data();
        const bdate: string | undefined =
          typeof data.birthDate === 'string'
            ? data.birthDate
            : toDate(data.birthDate)?.toISOString().split('T')[0];

        return {
          id: d.id,
          lrn: data.lrn ?? '',
          lastName: data.lastName ?? data.familyName ?? '',
          firstName: data.firstName ?? data.givenName ?? '',
          middleName: data.middleName ?? '',
          birthDate: formatBirthDate(bdate),
          age: calcAge(bdate),
          birthCity: data.address?.birthCity ?? data.birthCity ?? '',
          birthProvince: data.address?.birthProvince ?? data.birthProvince ?? '',
          motherTongue: data.additional?.motherTongue ?? data.motherTongue ?? '',
          indigenousGroup:
            data.additional?.isIndigenous
              ? (data.additional?.indigenousGroup ?? '')
              : '',
          religion: data.additional?.religion ?? data.religion ?? '',
          addressStreet: data.address?.street ?? '',
          addressBarangay: data.address?.barangay ?? '',
          addressCity: data.address?.city ?? '',
          addressProvince: data.address?.province ?? '',
          fatherName: data.fatherName ?? '',
          motherName: data.motherName ?? '',
          guardianName: data.medical?.emergencyContact ?? data.guardianName ?? '',
          guardianRelationship: data.guardianRelationship ?? 'Parent',
          contactNumber: data.medical?.emergencyPhone ?? data.contactNumber ?? '',
          remarks: data.remarks ?? '',
        };
      });

      // Resolve section & grade display names from sectionId if provided
      let sectionName = sectionId && sectionId !== 'all' ? sectionId : 'All Sections';
      if (snap.docs.length > 0) {
        sectionName = snap.docs[0].data().sectionName ?? sectionName;
      }

      return {
        schoolYear,
        gradeLevel: gradeLevel ?? 'All',
        section: sectionName,
        learners,
      };
    } catch (err) {
      console.error('[ReportDataService] getSF1Data error:', err);
      return { schoolYear, gradeLevel: gradeLevel ?? 'All', section: 'All Sections', learners: [] };
    }
  }

  /**
   * Composes SF4 data for a given school year and report month.
   * Aggregates enrollment counts per section and computes attendance averages
   * from the `attendance` collection. Defaults to 0 when records are absent.
   */
  static async getSF4Data(schoolYear: string, reportMonth: string): Promise<SF4Data> {
    try {
      // 1. Get all sections with their enrollment counts
      const enrollRef = collection(db, 'enrollments');
      const enrollSnap = await getDocs(
        query(enrollRef, where('schoolYear', '==', schoolYear))
      );

      // Group enrollment counts by sectionId
      const sectionEnrollMap: Record<
        string,
        { gradeLevel: string; sectionName: string; males: number; females: number }
      > = {};

      enrollSnap.docs.forEach(d => {
        const data = d.data();
        const sid = data.sectionId ?? 'unknown';
        if (!sectionEnrollMap[sid]) {
          sectionEnrollMap[sid] = {
            gradeLevel: data.gradeLevel ?? '',
            sectionName: data.sectionName ?? sid,
            males: 0,
            females: 0,
          };
        }
        const gender = (data.gender ?? '').toLowerCase();
        if (gender === 'male' || gender === 'm') {
          sectionEnrollMap[sid].males++;
        } else {
          sectionEnrollMap[sid].females++;
        }
      });

      // 2. Get attendance for the report month
      const monthIndex = [
        'JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
        'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'
      ].indexOf(reportMonth.toUpperCase());

      const attendRef = collection(db, 'attendance');
      const attendSnap = await getDocs(query(attendRef));

      // Group attendance by sectionId
      const sectionAttendMap: Record<
        string,
        { presentDays: number; totalDays: number }
      > = {};

      attendSnap.docs.forEach(d => {
        const data = d.data();
        const attendDate = toDate(data.date ?? data.createdAt);
        if (!attendDate || attendDate.getMonth() !== monthIndex) return;

        const sid = data.sectionId ?? 'unknown';
        if (!sectionAttendMap[sid]) {
          sectionAttendMap[sid] = { presentDays: 0, totalDays: 0 };
        }
        sectionAttendMap[sid].totalDays++;
        const status = (data.status ?? '').toLowerCase();
        if (status === 'present') sectionAttendMap[sid].presentDays++;
      });

      // 3. Compose per-section rows
      const sections: SF4SectionRow[] = Object.entries(sectionEnrollMap).map(
        ([sid, info]) => {
          const total = info.males + info.females;
          const attend = sectionAttendMap[sid];
          const pct =
            attend && attend.totalDays > 0
              ? Math.round((attend.presentDays / attend.totalDays) * 100)
              : 0;
          const avgDays =
            attend && attend.totalDays > 0
              ? Math.round(attend.presentDays / Math.max(1, attend.totalDays / Math.max(1, total)))
              : 0;

          return {
            gradeLevel: info.gradeLevel,
            section: info.sectionName,
            advisorName: '',
            maleCount: info.males,
            femaleCount: info.females,
            totalCount: total,
            avgDailyAttendanceMale: Math.round(avgDays * (info.males / Math.max(1, total))),
            avgDailyAttendanceFemale: Math.round(avgDays * (info.females / Math.max(1, total))),
            avgDailyAttendanceTotal: avgDays,
            attendancePctMale: pct,
            attendancePctFemale: pct,
            attendancePctTotal: pct,
          };
        }
      );

      // Sort by grade level then section name
      sections.sort((a, b) =>
        a.gradeLevel.localeCompare(b.gradeLevel) || a.section.localeCompare(b.section)
      );

      return { schoolYear, reportMonth, sections };
    } catch (err) {
      console.error('[ReportDataService] getSF4Data error:', err);
      return { schoolYear, reportMonth, sections: [] };
    }
  }

  /**
   * Fetches student data for generating printable ID cards.
   * Pulls from enrollments collection.
   */
  static async getStudentIdCardData(schoolYear: string, sectionId?: string) {
    try {
      const enrollRef = collection(db, 'enrollments');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const constraints: any[] = [];
      if (sectionId && sectionId !== 'all') {
        constraints.push(where('sectionId', '==', sectionId));
      }
      constraints.push(orderBy('lastName', 'asc'));

      const snap = await getDocs(query(enrollRef, ...constraints));

      return snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id,
          lrn: data.lrn ?? '',
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          middleName: data.middleName ?? '',
          gradeLevel: data.gradeLevel ?? '',
          section: data.sectionName ?? '',
          gender: data.gender ?? '',
          emergencyContact: data.medical?.emergencyContact ?? '',
          emergencyPhone: data.medical?.emergencyPhone ?? '',
          guardianName: data.medical?.emergencyContact ?? data.guardianName ?? '',
          schoolYear,
        };
      });
    } catch (err) {
      console.error('[ReportDataService] getStudentIdCardData error:', err);
      return [];
    }
  }
}

