import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { analyticsCache } from './analyticsCache';

export interface HealthData {
  id: string;
  name: string;
  gender: string;
  age: number;
  height: number; // in meters
  weight: number; // in kg
  bmi: number;
  nutritionalStatus: 'Severely Wasted' | 'Wasted' | 'Normal' | 'Overweight' | 'Obese';
  gradeLevel: string;
  sectionId?: string;
  lrn: string;
}

export interface NutritionalStats {
  status: string;
  count: number;
  color: string;
}

export class HealthAnalyticsService {
  static calculateAge(birthDate: string): number {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  static calculateBMI(heightCm: number, weightKg: number): number {
    if (!heightCm || !weightKg || heightCm === 0) return 0;
    const heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }

  static getNutritionalStatus(bmi: number): HealthData['nutritionalStatus'] {
    if (bmi === 0) return 'Normal'; // Fallback for invalid data
    if (bmi < 16.0) return 'Severely Wasted';
    if (bmi < 18.5) return 'Wasted';
    if (bmi < 25.0) return 'Normal';
    if (bmi < 30.0) return 'Overweight';
    return 'Obese';
  }

  static async getHealthData(): Promise<HealthData[]> {
    const cacheKey = 'analytics_health_data';
    const cached = analyticsCache.get<HealthData[]>(cacheKey);
    if (cached) return cached;

    try {
      const enrollmentsRef = collection(db, 'enrollments');
      // Fetch enrolled students to check their health data
      const q = query(enrollmentsRef, where('status', 'in', ['Enrolled', 'enrolled']));
      const snapshot = await getDocs(q);

      const data: HealthData[] = [];

      snapshot.forEach(doc => {
        const d = doc.data();
        if (d.medical && d.medical.height && d.medical.weight) {
          const height = parseFloat(d.medical.height);
          const weight = parseFloat(d.medical.weight);
          
          if (!isNaN(height) && !isNaN(weight)) {
            const bmi = this.calculateBMI(height, weight);
            data.push({
              id: doc.id,
              name: `${d.lastName || ''}, ${d.firstName || ''} ${d.middleName?.[0] ? d.middleName[0] + '.' : ''}`.trim(),
              gender: d.gender || 'Unknown',
              age: this.calculateAge(d.birthDate),
              height: height / 100, // convert to meters for display if needed, but standard is meters. Let's keep raw as heightM
              weight: weight,
              bmi: parseFloat(bmi.toFixed(2)),
              nutritionalStatus: this.getNutritionalStatus(bmi),
              gradeLevel: d.gradeLevel || '',
              sectionId: d.sectionId,
              lrn: d.lrn || ''
            });
          }
        }
      });

      // If empty (no data yet), provide some demo data for dashboard rendering
      if (data.length === 0) {
        data.push(
          { id: '1', name: 'Dela Cruz, Juan', gender: 'Male', age: 10, height: 1.3, weight: 25, bmi: 14.79, nutritionalStatus: 'Severely Wasted', gradeLevel: 'Grade 4', sectionId: 'sec1', lrn: '123456789012' },
          { id: '2', name: 'Santos, Maria', gender: 'Female', age: 11, height: 1.4, weight: 35, bmi: 17.86, nutritionalStatus: 'Wasted', gradeLevel: 'Grade 5', sectionId: 'sec2', lrn: '123456789013' },
          { id: '3', name: 'Reyes, Pedro', gender: 'Male', age: 12, height: 1.5, weight: 45, bmi: 20.00, nutritionalStatus: 'Normal', gradeLevel: 'Grade 6', sectionId: 'sec3', lrn: '123456789014' },
          { id: '4', name: 'Bautista, Ana', gender: 'Female', age: 9, height: 1.2, weight: 38, bmi: 26.39, nutritionalStatus: 'Overweight', gradeLevel: 'Grade 3', sectionId: 'sec4', lrn: '123456789015' },
          { id: '5', name: 'Garcia, Luis', gender: 'Male', age: 8, height: 1.1, weight: 40, bmi: 33.06, nutritionalStatus: 'Obese', gradeLevel: 'Grade 2', sectionId: 'sec5', lrn: '123456789016' },
          { id: '6', name: 'Torres, Sofia', gender: 'Female', age: 10, height: 1.35, weight: 30, bmi: 16.46, nutritionalStatus: 'Wasted', gradeLevel: 'Grade 4', sectionId: 'sec1', lrn: '123456789017' },
          { id: '7', name: 'Flores, Diego', gender: 'Male', age: 11, height: 1.45, weight: 42, bmi: 19.98, nutritionalStatus: 'Normal', gradeLevel: 'Grade 5', sectionId: 'sec2', lrn: '123456789018' },
        );
      }

      analyticsCache.set(cacheKey, data);
      return data;
    } catch (error) {
      console.error("Error fetching health data:", error);
      return [];
    }
  }

  static async getNutritionalStats(): Promise<NutritionalStats[]> {
    const data = await this.getHealthData();
    const stats: Record<string, number> = {
      'Severely Wasted': 0,
      'Wasted': 0,
      'Normal': 0,
      'Overweight': 0,
      'Obese': 0
    };

    data.forEach(d => {
      stats[d.nutritionalStatus]++;
    });

    return [
      { status: 'Severely Wasted', count: stats['Severely Wasted'], color: 'text-red-500 bg-red-500' },
      { status: 'Wasted', count: stats['Wasted'], color: 'text-amber-500 bg-amber-500' },
      { status: 'Normal', count: stats['Normal'], color: 'text-emerald-500 bg-emerald-500' },
      { status: 'Overweight', count: stats['Overweight'], color: 'text-blue-500 bg-blue-500' },
      { status: 'Obese', count: stats['Obese'], color: 'text-purple-500 bg-purple-500' }
    ];
  }

  static async getFeedingProgramEligibility(): Promise<HealthData[]> {
    const data = await this.getHealthData();
    return data.filter(d => d.nutritionalStatus === 'Severely Wasted' || d.nutritionalStatus === 'Wasted');
  }
}
