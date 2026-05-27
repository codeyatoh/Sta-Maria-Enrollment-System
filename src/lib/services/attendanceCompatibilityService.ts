export type AttendanceRecord = {
  date: string;
  status: 'Present' | 'Absent' | 'Late';
};

export type CanonicalAttendanceEntry = {
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
};

export function mergeAttendanceWithCompatibility(params: {
  studentId: string;
  canonicalEntries: CanonicalAttendanceEntry[];
  legacyEntries?: AttendanceRecord[];
}): AttendanceRecord[] {
  const { studentId, canonicalEntries, legacyEntries = [] } = params;
  const canonical = canonicalEntries
    .filter((entry) => entry.studentId === studentId)
    .map((entry) => ({ date: entry.date, status: entry.status }));

  if (canonical.length > 0) {
    return canonical.sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  return [...legacyEntries].sort((a, b) => (a.date < b.date ? 1 : -1));
}
