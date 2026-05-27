import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface DemographicData {
  ipGroups: { name: string; count: number }[];
  totalIp: number;
  total4ps: number;
  motherTongues: { name: string; count: number }[];
  religions: { name: string; count: number }[];
  totalStudents: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export function DemographicCharts({ data }: { data: DemographicData }) {
  const { ipGroups, total4ps, motherTongues, religions, totalStudents } = data;

  // Derive binary data for 4Ps
  const fourPsData = [
    { name: '4Ps Beneficiary', value: total4ps },
    { name: 'Non-4Ps', value: totalStudents - total4ps }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="flex flex-col h-[280px]">
        <h4 className="text-sm font-bold text-slate-700 mb-2 text-center">Indigenous Peoples (IP)</h4>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ipGroups.length > 0 ? ipGroups : [{ name: 'None', count: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="count"
              >
                {(ipGroups.length > 0 ? ipGroups : [{ name: 'None', count: 1 }]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${Number(value)} Students`, 'Count']} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col h-[280px]">
        <h4 className="text-sm font-bold text-slate-700 mb-2 text-center">4Ps Beneficiaries</h4>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fourPsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill="#10b981" />
                <Cell fill="#cbd5e1" />
              </Pie>
              <Tooltip formatter={(value) => [`${Number(value)} Students`, 'Count']} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col h-[280px]">
        <h4 className="text-sm font-bold text-slate-700 mb-2 text-center">Mother Tongue</h4>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={motherTongues.length > 0 ? motherTongues : [{ name: 'None', count: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="count"
              >
                {(motherTongues.length > 0 ? motherTongues : [{ name: 'None', count: 1 }]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${Number(value)} Students`, 'Count']} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="flex flex-col h-[280px] lg:col-span-3">
        <h4 className="text-sm font-bold text-slate-700 mb-2 text-center">Religious Affiliation</h4>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={religions.length > 0 ? religions : [{ name: 'None', count: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="count"
              >
                {(religions.length > 0 ? religions : [{ name: 'None', count: 1 }]).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${Number(value)} Students`, 'Count']} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
