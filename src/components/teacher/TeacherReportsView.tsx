import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Download,
  CheckCircle2,
  Heart,
  Award,
  TrendingUp,
  FileText
} from 'lucide-react';

export function TeacherReportsView() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      setSuccess(id);
      setTimeout(() => setSuccess(null), 3000);
    }, 1500);
  };

  const reports = [
    {
      id: 'sf5',
      title: 'School Form 5 (SF5)',
      subtitle: 'Report on Promotion and Level of Proficiency',
      desc: 'Summary of student promotions, retentions, and academic proficiency levels at the end of the school year.',
      icon: TrendingUp,
      iconClass: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'sf8',
      title: 'School Form 8 (SF8)',
      subtitle: 'Learner Health Record',
      desc: 'Comprehensive health and nutritional status report including BMI, height, weight, and medical conditions for all students.',
      icon: Heart,
      iconClass: 'bg-rose-100 text-rose-600'
    },
    {
      id: 'sf9',
      title: 'School Form 9 (SF9)',
      subtitle: 'Learner Progress Report Card',
      desc: 'Individual student report cards with quarterly grades, attendance summary, and teacher remarks.',
      icon: Award,
      iconClass: 'bg-amber-100 text-amber-600'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <header className="px-6 py-8 border-b border-border bg-gradient-to-r from-primary/5 via-primary/10 to-transparent shrink-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-7xl mx-auto w-full">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <FileText className="w-6 h-6" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Generate Reports</h1>
            </div>
            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Generate official DepEd school forms based on your section's student data.
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const isGenerating = generating === report.id;
            const isSuccess = success === report.id;
            return (
              <Card
                key={report.id}
                className="bg-white border-slate-200/60 p-6 sm:p-8 shadow-sm rounded-3xl flex flex-col hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-14 h-14 rounded-2xl ${report.iconClass} flex items-center justify-center shrink-0 shadow-inner`}>
                    <report.icon className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="font-bold text-lg text-slate-900 leading-tight">{report.title}</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">{report.subtitle}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">{report.desc}</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                    <span>Section: Grade 1 – Section A</span>
                    <span>SY 2024–2025</span>
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
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}