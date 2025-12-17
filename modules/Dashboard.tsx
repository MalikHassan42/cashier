import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, AlertTriangle, Zap, DollarSign, Package } from 'lucide-react';
import { MOCK_ALERTS } from '../constants';

const data = [
  { name: '10 AM', sales: 400, orders: 24 },
  { name: '12 PM', sales: 3000, orders: 138 },
  { name: '02 PM', sales: 2000, orders: 98 },
  { name: '04 PM', sales: 2780, orders: 105 },
  { name: '06 PM', sales: 1890, orders: 85 },
  { name: '08 PM', sales: 2390, orders: 110 },
  { name: '10 PM', sales: 3490, orders: 150 },
];

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      {trend && (
        <span className="text-green-500 text-sm font-bold bg-green-50 px-2 py-1 rounded flex items-center">
          +{trend}% <TrendingUp size={12} className="mr-1" />
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-slate-800">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 h-full overflow-y-auto bg-slate-50">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">لوحة المعلومات والتقارير</h1>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="إجمالي المبيعات (يومي)" value="14,250 ر.س" icon={DollarSign} color="bg-blue-600" trend="12.5" />
        <StatCard title="عدد الطلبات" value="385" icon={Package} color="bg-purple-600" trend="8.2" />
        <StatCard title="العملاء الجدد" value="42" icon={Users} color="bg-orange-500" trend="3.1" />
        <StatCard title="تنبيهات المخزون" value="3" icon={AlertTriangle} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg text-slate-800 mb-6">تحليل المبيعات (بالساعة)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  cursor={{fill: '#f1f5f9'}}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights & Alerts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Zap className="text-yellow-500" size={20} />
              ذكاء المخزون (AI)
            </h3>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto">
            {/* AI Prediction Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
              <div className="text-xs font-bold text-indigo-600 mb-2 uppercase tracking-wide">تنبؤ بالطلب</div>
              <p className="text-sm text-slate-700 mb-3">
                تشير الخوارزمية إلى احتمال نفاد <strong>برجر الدجاج</strong> بحلول يوم الجمعة القادم بناءً على نمط المبيعات الحالي.
              </p>
              <button className="w-full py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">
                إنشاء أمر شراء تلقائي
              </button>
            </div>

            {/* Standard Alerts */}
            {MOCK_ALERTS.map(alert => (
              <div key={alert.id} className="flex gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                <AlertTriangle className="text-red-500 shrink-0 mt-1" size={18} />
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{alert.productName}</h4>
                  <p className="text-xs text-slate-600 mt-1">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Delivery Apps Reconciliation Table Mock */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-800">أداء منصات التوصيل</h3>
            <button className="text-blue-600 text-sm font-bold hover:underline">عرض التفاصيل</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 text-slate-500">
                    <tr>
                        <th className="px-6 py-4 font-medium">المنصة</th>
                        <th className="px-6 py-4 font-medium">عدد الطلبات</th>
                        <th className="px-6 py-4 font-medium">إجمالي المبيعات</th>
                        <th className="px-6 py-4 font-medium">العمولة (تقريبي)</th>
                        <th className="px-6 py-4 font-medium">صافي الربح</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    <tr>
                        <td className="px-6 py-4 font-bold text-yellow-600">هنقرستيشن</td>
                        <td className="px-6 py-4">45</td>
                        <td className="px-6 py-4">2,300 ر.س</td>
                        <td className="px-6 py-4 text-red-500">-460 ر.س</td>
                        <td className="px-6 py-4 font-bold text-green-600">1,840 ر.س</td>
                    </tr>
                    <tr>
                        <td className="px-6 py-4 font-bold text-purple-600">تويو</td>
                        <td className="px-6 py-4">22</td>
                        <td className="px-6 py-4">1,100 ر.س</td>
                        <td className="px-6 py-4 text-red-500">-190 ر.س</td>
                        <td className="px-6 py-4 font-bold text-green-600">910 ر.س</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;