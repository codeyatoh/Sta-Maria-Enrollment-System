import React from 'react';
import { ReportLayout } from './reports/ReportLayout';
import type { HealthData } from '../../lib/services/healthAnalyticsService';

interface SF8ReportDocumentProps {
  onClose: () => void;
  data: {
    schoolYear: string;
    gradeLevel: string;
    section: string;
    learners: HealthData[];
  };
}

export function SF8ReportDocument({ onClose, data }: SF8ReportDocumentProps) {
  const { schoolYear, gradeLevel, section, learners } = data;

  return (
    <ReportLayout title="School Form 8 (SF8)" onClose={onClose} landscape>
      {/* DepEd Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="w-20 h-20 rounded-full border border-black flex items-center justify-center font-bold text-[10px] text-center p-1 leading-tight">
          KAGAWARAN<br />NG<br />EDUKASYON
        </div>
        <div className="text-center flex-1 text-blue-700">
          <h2 className="font-bold text-xl">School Form 8 (SF8) Learner's Basic Health and Nutrition Report</h2>
          <p className="text-xs italic text-slate-600">
            (For All Grade Levels)
          </p>
        </div>
        <div className="w-40 text-right">
          <div className="text-4xl font-black text-blue-800 tracking-tighter flex items-center justify-end">
            Dep<span className="text-red-600 ml-1">ED</span>
          </div>
          <div className="text-[9px] tracking-widest font-semibold text-slate-600 mt-1">
            DEPARTMENT OF EDUCATION
          </div>
        </div>
      </div>

      {/* Info Header */}
      <div className="border-t-2 border-b-2 border-blue-400 py-3 mb-4 text-xs">
        <div className="flex flex-wrap justify-between gap-4">
          <div className="space-y-1">
            <p><span className="font-bold">School ID:</span> 100011</p>
            <p><span className="font-bold">School Name:</span> STA. MARIA ELEMENTARY SCHOOL</p>
          </div>
          <div className="space-y-1">
            <p><span className="font-bold">Region:</span> IX</p>
            <p><span className="font-bold">School Year:</span> {schoolYear}</p>
          </div>
          <div className="space-y-1">
            <p><span className="font-bold">Division:</span> ZAMBOANGA</p>
            <p><span className="font-bold">Grade Level:</span> {gradeLevel}</p>
          </div>
          <div className="space-y-1 pr-12">
            <p><span className="font-bold">District:</span></p>
            <p><span className="font-bold">Section:</span> {section}</p>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="overflow-x-auto print:overflow-visible">
        <table className="w-full border-collapse border border-black text-[10px] text-center">
          <thead>
            <tr>
              <th className="border border-black p-2 align-middle bg-gray-50" rowSpan={2}>LRN</th>
              <th className="border border-black p-2 align-middle bg-gray-50" rowSpan={2}>NAME OF LEARNER</th>
              <th className="border border-black p-2 align-middle bg-gray-50" rowSpan={2}>AGE</th>
              <th className="border border-black p-2 align-middle bg-gray-50" rowSpan={2}>GENDER</th>
              <th className="border border-black p-2 align-middle bg-gray-50" colSpan={3}>NUTRITIONAL STATUS</th>
              <th className="border border-black p-2 align-middle bg-gray-50" rowSpan={2}>REMARKS</th>
            </tr>
            <tr>
              <th className="border border-black p-2 align-middle bg-gray-50 font-medium">WEIGHT (kg)</th>
              <th className="border border-black p-2 align-middle bg-gray-50 font-medium">HEIGHT (m)</th>
              <th className="border border-black p-2 align-middle bg-gray-50 font-medium">BMI / CATEGORY</th>
            </tr>
          </thead>
          <tbody>
            {learners.length > 0 ? (
              learners.map((l, i) => (
                <tr key={l.id || i}>
                  <td className="border border-black p-2">{l.lrn}</td>
                  <td className="border border-black p-2 text-left">{l.name}</td>
                  <td className="border border-black p-2">{l.age}</td>
                  <td className="border border-black p-2">{l.gender}</td>
                  <td className="border border-black p-2">{l.weight}</td>
                  <td className="border border-black p-2">{l.height}</td>
                  <td className="border border-black p-2">
                    {l.bmi.toFixed(2)} - <span className="font-semibold">{l.nutritionalStatus}</span>
                  </td>
                  <td className="border border-black p-2"></td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border border-black p-4 font-medium italic text-center text-slate-500" colSpan={8}>
                  No health and nutrition data found for this section.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-12 flex justify-between px-12 print:flex hidden">
        <div className="text-center">
          <div className="border-b border-black w-48 mb-1"></div>
          <div className="text-xs font-bold">Class Adviser</div>
        </div>
        <div className="text-center">
          <div className="border-b border-black w-48 mb-1"></div>
          <div className="text-xs font-bold">School Head</div>
        </div>
      </div>

      <div className="mt-8 text-[10px] text-gray-500 text-center print:block hidden">
        Generated on: {new Date().toLocaleString()}<br />
        Computer-generated report
      </div>
    </ReportLayout>
  );
}
