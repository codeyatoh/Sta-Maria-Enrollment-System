import React from 'react';
import { Button } from '../ui/Button';
import { Printer, X } from 'lucide-react';


interface SF1ReportDocumentProps {
  onClose: () => void;
  schoolYear?: string;
  gradeLevel?: string;
  section?: string;
}

export function SF1ReportDocument({ onClose, schoolYear = '2026-2027', gradeLevel = 'All', section = 'All Sections' }: SF1ReportDocumentProps) {
  const children: any[] = [];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white overflow-y-auto print:p-0 print:m-0">
      <div className="sticky top-0 left-0 right-0 bg-slate-800 text-white p-4 flex justify-between items-center print:hidden shadow-md z-10">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-lg">Print Preview: School Form 1 (SF1)</h2>
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

      <div className="p-8 max-w-[1500px] mx-auto print:p-0 print:max-w-none bg-white text-black print:text-black">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-2">
          <div className="w-20 h-20 rounded-full border border-black flex items-center justify-center font-bold text-[10px] text-center p-1 leading-tight">
            KAGAWARAN<br/>NG<br/>EDUKASYON
          </div>
          <div className="text-center flex-1 text-blue-700">
            <h2 className="font-bold text-xl">School Form 1 (SF1) School Register</h2>
            <p className="text-xs italic text-slate-600">(this replaces Form 1, Master List & STS Form 2-Family Background and Profile)</p>
          </div>
          <div className="w-40 text-right">
            <div className="text-4xl font-black text-blue-800 tracking-tighter flex items-center justify-end">
              Dep<span className="text-red-600 ml-1">ED</span>
            </div>
            <div className="text-[9px] tracking-widest font-semibold text-slate-600 mt-1">DEPARTMENT OF EDUCATION</div>
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
              <p><span className="font-bold">District:</span> </p>
              <p><span className="font-bold">Section:</span> {section}</p>
            </div>
          </div>
        </div>

        {/* Main Data Table */}
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full border-collapse border border-black text-[10px] text-center">
            <thead>
              {/* Row 1 */}
              <tr>
                <th className="border border-black p-1 align-middle bg-gray-50" rowSpan={2}>LRN</th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={3}>NAME</th>
                <th className="border border-black p-1 align-middle bg-gray-50" rowSpan={2}>BIRTH<br/>DATE<br/>(mm/dd/yy)</th>
                <th className="border border-black p-1 align-middle bg-gray-50" rowSpan={2}>AGE as of 1st friday<br/>of June<br/><span className="font-normal text-[8px]">(nos. of years as per last<br/>birthday)</span></th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={2}>BIRTH PLACE</th>
                <th className="border border-black p-1 align-middle bg-gray-50" rowSpan={2}>MOTHER<br/>TONGUE</th>
                <th className="border border-black p-1 align-middle bg-gray-50" rowSpan={2}>IP<br/><span className="font-normal text-[8px]">(Specify<br/>ethnic group)</span></th>
                <th className="border border-black p-1 align-middle bg-gray-50" rowSpan={2}>Religion</th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={4}>ADDRESS</th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={2}>NAME OF PARENTS</th>
                <th className="border border-black p-1 align-middle bg-gray-50" colSpan={2}>GUARDIAN</th>
                <th className="border border-black p-1 align-middle bg-gray-50" rowSpan={2}>CONTACT<br/>NUMBER<br/><span className="font-normal text-[8px]">Parent/Guardian</span></th>
                <th className="border border-black p-1 align-middle bg-gray-50" rowSpan={2}>REMARKS<br/><span className="font-normal text-[8px]">(Please refer to the<br/>legend on last page)</span></th>
              </tr>
              {/* Row 2 */}
              <tr>
                <th className="border border-black p-1 align-middle bg-gray-50 font-medium">Last<br/>Name</th>
                <th className="border border-black p-1 align-middle bg-gray-50 font-medium">First<br/>Name</th>
                <th className="border border-black p-1 align-middle bg-gray-50 font-medium">Middle<br/>Name</th>
                <th className="border border-black p-1 align-middle bg-gray-50 font-medium">Municipality/<br/>City</th>
                <th className="border border-black p-1 align-middle bg-gray-50 font-medium">Province</th>
                <th className="border border-black p-1 align-middle bg-gray-50 font-medium">House # /<br/>Street<br/>Sitio/Purok</th>
                <th className="border border-black p-1 align-middle bg-gray-50 font-medium">Barangay</th>
                <th className="border border-black p-1 align-middle bg-gray-50 font-medium">Municipality/<br/>City</th>
                <th className="border border-black p-1 align-middle bg-gray-50 font-medium">Province</th>
                <th className="border border-black p-1 align-middle bg-gray-50 font-medium text-[8px]">Father<br/>(1st name only if family<br/>name identical to<br/>learner)</th>
                <th className="border border-black p-1 align-middle bg-gray-50 font-medium text-[8px]">Mother<br/>(Maiden: 1st Name,<br/>Middle & Last name)</th>
                <th className="border border-black p-1 align-middle bg-gray-50 font-medium">Name</th>
                <th className="border border-black p-1 align-middle bg-gray-50 font-medium">Relationship</th>
              </tr>
            </thead>
            <tbody>
              {children && children.length > 0 ? (
                children.map((child: any, i: number) => {
                  // Calculate age roughly
                  const bdate = new Date(child.birthDate);
                  const juneFirst = new Date(new Date().getFullYear(), 5, 1);
                  let age = juneFirst.getFullYear() - bdate.getFullYear();
                  if (juneFirst.getMonth() < bdate.getMonth() || (juneFirst.getMonth() === bdate.getMonth() && juneFirst.getDate() < bdate.getDate())) {
                    age--;
                  }

                  // Format birthdate mm/dd/yy
                  const mm = String(bdate.getMonth() + 1).padStart(2, '0');
                  const dd = String(bdate.getDate()).padStart(2, '0');
                  const yy = String(bdate.getFullYear()).slice(-2);

                  return (
                    <tr key={child.id || i}>
                      <td className="border border-black p-1">{child.lrn}</td>
                      <td className="border border-black p-1">{child.lastName}</td>
                      <td className="border border-black p-1">{child.firstName}</td>
                      <td className="border border-black p-1">{child.middleName?.charAt(0) || ''}.</td>
                      <td className="border border-black p-1">{mm}/{dd}/{yy}</td>
                      <td className="border border-black p-1">{isNaN(age) ? '' : age}</td>
                      <td className="border border-black p-1 uppercase">{child.address?.city}</td>
                      <td className="border border-black p-1 uppercase">{child.address?.province}</td>
                      <td className="border border-black p-1">{child.additional?.motherTongue}</td>
                      <td className="border border-black p-1">{child.additional?.isIndigenous ? child.additional.indigenousGroup : ''}</td>
                      <td className="border border-black p-1">{child.additional?.religion}</td>
                      <td className="border border-black p-1">{child.address?.street}</td>
                      <td className="border border-black p-1 uppercase">{child.address?.barangay}</td>
                      <td className="border border-black p-1 uppercase">{child.address?.city}</td>
                      <td className="border border-black p-1 uppercase">{child.address?.province}</td>
                      <td className="border border-black p-1"></td>
                      <td className="border border-black p-1"></td>
                      <td className="border border-black p-1">{child.medical?.emergencyContact}</td>
                      <td className="border border-black p-1">Parent</td>
                      <td className="border border-black p-1">{child.medical?.emergencyPhone}</td>
                      <td className="border border-black p-1"></td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td className="border border-black p-2 font-medium italic text-center" colSpan={21}>
                    No enrolled learners found for this section.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 text-[10px] text-gray-500 text-center print:block hidden">
          Generated on: {new Date().toLocaleString()}<br/>
          Computer-generated report
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
            margin: 5mm;
          }
        }
      `}} />
    </div>
  );
}
