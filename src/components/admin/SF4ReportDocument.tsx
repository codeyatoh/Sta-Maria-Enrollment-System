import React from 'react';
import { Button } from '../ui/Button';
import { Printer, X } from 'lucide-react';

interface SF4ReportDocumentProps {
  onClose: () => void;
  reportMonth?: string;
  schoolYear?: string;
}

export function SF4ReportDocument({ onClose, reportMonth = 'JANUARY', schoolYear = '2024-2025' }: SF4ReportDocumentProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto print:p-0 print:m-0">
      <div className="sticky top-0 left-0 right-0 bg-slate-800 text-white p-4 flex justify-between items-center print:hidden shadow-md z-10">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-lg">Print Preview: School Form 4 (SF4)</h2>
          <span className="text-sm text-slate-300">Set destination to "Save as PDF" to download.</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handlePrint} className="bg-white text-slate-900 hover:bg-slate-100">
            <Printer className="w-4 h-4 mr-2" />
            Print / Save PDF
          </Button>
          <Button variant="ghost" onClick={onClose} className="text-slate-300 hover:text-white hover:bg-slate-700">
            <X className="w-5 h-5 mr-2" />
            Close
          </Button>
        </div>
      </div>

      <div className="p-8 max-w-[1400px] mx-auto print:p-0 print:max-w-none bg-white text-black print:text-black">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center font-bold text-xs text-center p-2">
            KAGAWARAN<br/>NG<br/>EDUKASYON
          </div>
          <div className="text-center flex-1">
            <h1 className="font-bold text-xl mb-1">DEPARTMENT OF EDUCATION</h1>
            <h2 className="font-bold text-lg">School Form 4 (SF4) Monthly Learner's Movement and Attendance</h2>
          </div>
          <div className="w-48">
            <div className="text-4xl font-black text-blue-800 tracking-tighter flex items-center">
              Dep<span className="text-red-600 ml-1">ED</span>
            </div>
            <div className="text-[10px] tracking-widest font-semibold text-slate-600 mt-1">DEPARTMENT OF EDUCATION</div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-lg border-b-2 border-black pb-1 mb-1">School Form 4 (SF4) Monthly Learner's Movement and Attendance</h3>
          <p className="text-xs italic">(this replaces Form 3 & STS Form 4-Absenteeism and Dropout Profile)</p>
        </div>

        {/* Info Table */}
        <table className="w-full border-collapse border border-black mb-4 text-xs font-medium">
          <tbody>
            <tr>
              <td className="border border-black px-2 py-1 bg-gray-100 w-32 font-bold">School ID:</td>
              <td className="border border-black px-2 py-1 w-64">123456</td>
              <td className="border border-black px-2 py-1 bg-gray-100 w-32 font-bold">Region:</td>
              <td className="border border-black px-2 py-1 w-64">III</td>
              <td className="border border-black px-2 py-1 bg-gray-100 w-32 font-bold">Division:</td>
              <td className="border border-black px-2 py-1">Bulacan</td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-1 bg-gray-100 font-bold">School Name:</td>
              <td className="border border-black px-2 py-1 font-bold">Sta. Maria Elementary School</td>
              <td className="border border-black px-2 py-1 bg-gray-100 font-bold">School Year:</td>
              <td className="border border-black px-2 py-1">{schoolYear}</td>
              <td className="border border-black px-2 py-1 bg-gray-100 font-bold">Report Month:</td>
              <td className="border border-black px-2 py-1 font-bold">{reportMonth}</td>
            </tr>
          </tbody>
        </table>

        {/* Main Data Table */}
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full border-collapse border-2 border-black text-[10px] text-center">
            <thead>
              {/* Row 1 */}
              <tr>
                <th className="border border-black p-1 align-middle" rowSpan={3}>GRADE<br/>/ YEAR<br/>LEVEL</th>
                <th className="border border-black p-1 align-middle" rowSpan={3}>SECTION</th>
                <th className="border border-black p-1 align-middle" rowSpan={3}>NAME<br/>OF<br/>ADVISER</th>
                <th className="border border-black p-1 align-middle bg-gray-50" rowSpan={2} colSpan={3}>REGISTERED<br/>LEARNERS<br/>(As of End of<br/>the Month)</th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={6}>ATTENDANCE</th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={9}>NO LONGER PARTICIPATING<br/>IN LEARNING ACTIVITIES</th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={9}>TRANSFERRED OUT</th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={9}>TRANSFERRED IN</th>
              </tr>
              {/* Row 2 */}
              <tr>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={3}>Daily<br/>Average</th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={3}>Percentage<br/>for the<br/>Month</th>
                
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={3}>(A)<br/>Cumulative<br/>as of<br/>Previous<br/>Month</th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={3}>(B)<br/>For<br/>the<br/>Month</th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={3}>(A + B)<br/>Cumulative<br/>as of End of<br/>Month</th>
                
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={3}>(A)<br/>Cumulative<br/>as of<br/>Previous<br/>Month</th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={3}>(B)<br/>For<br/>the<br/>Month</th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={3}>(A + B)<br/>Cumulative<br/>as of End of<br/>Month</th>
                
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={3}>(A)<br/>Cumulative<br/>as of<br/>Previous<br/>Month</th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={3}>(B)<br/>For<br/>the<br/>Month</th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={3}>(A + B)<br/>Cumulative<br/>as of End of<br/>Month</th>
              </tr>
              {/* Row 3 - M F T repeated */}
              <tr>
                {Array.from({ length: 13 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <th className="border border-black p-1 w-6 font-bold bg-gray-100">M</th>
                    <th className="border border-black p-1 w-6 font-bold bg-gray-100">F</th>
                    <th className="border border-black p-1 w-6 font-bold bg-gray-100">T</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Mock Row 1 */}
              <tr>
                <td className="border border-black p-1 font-bold">Elementary</td>
                <td className="border border-black p-1"></td>
                <td className="border border-black p-1"></td>
                {/* 39 empty cells for M,F,T */}
                {Array.from({ length: 39 }).map((_, i) => (
                  <td key={i} className="border border-black p-1 h-6"></td>
                ))}
              </tr>
              {/* No Data Row */}
              <tr>
                <td className="border border-black p-2 font-medium italic text-center" colSpan={42}>
                  No data found
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <h4 className="font-bold text-xs mb-2">Mortality / Death</h4>
          <table className="border-collapse border border-black text-xs">
            <thead>
              <tr>
                <th className="border border-black p-1 px-4 bg-gray-100">Previous Month</th>
                <th className="border border-black p-1 px-4 bg-gray-100">For the month</th>
                <th className="border border-black p-1 px-4 bg-gray-100">Cumulative as of End of Month</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-black p-1 h-6"></td>
                <td className="border border-black p-1 h-6"></td>
                <td className="border border-black p-1 h-6"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Required style to hide the rest of the app when printing */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body > #root > *:not(div[class*="fixed inset-0 z-[100]"]) {
            display: none !important;
          }
          @page {
            size: landscape;
            margin: 10mm;
          }
        }
      `}} />
    </div>
  );
}
