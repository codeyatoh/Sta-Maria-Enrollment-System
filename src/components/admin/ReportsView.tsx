import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/Select';
import { FileText, Download, CheckCircle2 } from 'lucide-react';
import { useAdminData } from '../../lib/adminData';
import { SF4ReportDocument } from './SF4ReportDocument';
import { SF1ReportDocument } from './SF1ReportDocument';

export function ReportsView() {
  const { schoolYear, classrooms, sections } = useAdminData();
  const [generating, setGenerating] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showSF4, setShowSF4] = useState(false);
  const [showSF1, setShowSF1] = useState(false);
  const [reportMonth, setReportMonth] = useState('JANUARY');

  const handleGenerate = (reportId: string) => {
    setGenerating(reportId);
    setTimeout(() => {
      setGenerating(null);
      setSuccess(reportId);
      setTimeout(() => setSuccess(null), 3000);
      if (reportId === 'sf4') setShowSF4(true);
      else if (reportId === 'sf1') setShowSF1(true);
    }, 1000);
  };

  const reports = [
    {
      id: 'sf1',
      title: 'School Form 1 (SF1)',
      desc: 'School Register containing learner information, birth details, and parents/guardians.',
      iconClass: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'sf4',
      title: 'School Form 4 (SF4)',
      desc: 'Monthly Learner Movement and Attendance summary for the entire school.',
      iconClass: 'bg-indigo-100 text-indigo-600'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <header className="px-6 py-8 border-b border-border bg-gradient-to-r from-primary/5 via-primary/10 to-transparent shrink-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-7xl mx-auto w-full">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <FileText className="w-6 h-6" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Official Reports</h1>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Generate and download official DepEd school forms based on live enrollment and attendance data.
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {reports.map((report) => {
            const isGenerating = generating === report.id;
            const isSuccess = success === report.id;

            return (
              <Card
                key={report.id}
                className="bg-white border-slate-200/60 p-6 sm:p-8 shadow-sm rounded-3xl flex flex-col hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${report.iconClass} flex items-center justify-center shrink-0 shadow-inner`}>
                    <FileText className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="font-bold text-xl text-slate-900">{report.title}</h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{report.desc}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">School Year</label>
                    <Select defaultValue={schoolYear?.id}>
                      <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {schoolYear && <SelectItem value={schoolYear.id}>{schoolYear.name}</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Classroom</label>
                      <Select>
                        <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl">
                          <SelectValue placeholder="All Classrooms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Classrooms</SelectItem>
                          {classrooms.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.roomName}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section</label>
                      <Select>
                        <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl">
                          <SelectValue placeholder="All Sections" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sections</SelectItem>
                          {sections.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {report.id === 'sf4' && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Report Month</label>
                      <Select value={reportMonth} onValueChange={setReportMonth}>
                        <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl">
                          <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'].map(m => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <Button
                  className={`w-full rounded-xl h-11 font-semibold transition-all ${
                    isSuccess
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                  }`}
                  onClick={() => handleGenerate(report.id)}
                  disabled={isGenerating || isSuccess}
                >
                  {isGenerating ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />Generating...</>
                  ) : isSuccess ? (
                    <><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />Ready to Download</>
                  ) : (
                    <><Download className="w-4 h-4 mr-2" />Generate Report</>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      {showSF4 && (
        <SF4ReportDocument
          onClose={() => setShowSF4(false)}
          reportMonth={reportMonth}
          schoolYear={schoolYear?.name || '2024-2025'}
        />
      )}
      {showSF1 && (
        <SF1ReportDocument
          onClose={() => setShowSF1(false)}
          schoolYear={schoolYear?.name || '2024-2025'}
        />
      )}
    </div>
  );
}