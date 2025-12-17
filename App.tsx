import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import POS from './modules/POS';
import Dashboard from './modules/Dashboard';
import Inventory from './modules/Inventory';
import Orders from './modules/Orders';
import Purchasing from './modules/Purchasing';
import Reports from './modules/Reports';
import { View, DeviceType } from './types';
import { Smartphone, Tablet, Monitor, CheckCircle2 } from 'lucide-react';

const App: React.FC = () => {
  // If null, show selection screen
  const [deviceType, setDeviceType] = useState<DeviceType | null>(null);
  const [currentView, setCurrentView] = useState<View>(View.POS);

  const renderContent = () => {
    switch (currentView) {
      case View.POS:
        return <POS deviceType={deviceType || 'LAPTOP'} />;
      case View.DASHBOARD:
        return <Dashboard />;
      case View.INVENTORY:
        return <Inventory />;
      case View.ORDERS:
        return <Orders />;
      case View.PURCHASING:
        return <Purchasing />;
      case View.REPORTS:
        return <Reports />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">قريباً</h2>
              <p>جاري العمل على تطوير هذه الوحدة</p>
            </div>
          </div>
        );
    }
  };

  // --- DEVICE SELECTION SCREEN ---
  if (!deviceType) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
        <div className="max-w-4xl w-full text-center">
          <div className="mb-12">
             <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-4xl mx-auto mb-6 shadow-lg shadow-blue-500/30">N</div>
             <h1 className="text-4xl md:text-5xl font-bold mb-4">نظام نِظام الذكي</h1>
             <p className="text-slate-400 text-lg">اختر نوع الجهاز لبدء تجربة المستخدم المثالية</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Mobile Option */}
             <button 
                onClick={() => setDeviceType('MOBILE')}
                className="group relative bg-slate-800 p-8 rounded-2xl border-2 border-slate-700 hover:border-blue-500 hover:bg-slate-750 transition-all duration-300 flex flex-col items-center"
             >
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Smartphone size={40} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">جوال (Mobile)</h3>
                <p className="text-sm text-slate-400">واجهة مبسطة، قوائم سفلية، مثالية للتنقل</p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 className="text-blue-500" />
                </div>
             </button>

             {/* Tablet Option */}
             <button 
                onClick={() => setDeviceType('TABLET')}
                className="group relative bg-slate-800 p-8 rounded-2xl border-2 border-slate-700 hover:border-purple-500 hover:bg-slate-750 transition-all duration-300 flex flex-col items-center"
             >
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Tablet size={40} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">تابلت (Tablet)</h3>
                <p className="text-sm text-slate-400">قوائم جانبية مصغرة، توازن بين المعلومات واللمس</p>
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 className="text-purple-500" />
                </div>
             </button>

             {/* Laptop Option */}
             <button 
                onClick={() => setDeviceType('LAPTOP')}
                className="group relative bg-slate-800 p-8 rounded-2xl border-2 border-slate-700 hover:border-green-500 hover:bg-slate-750 transition-all duration-300 flex flex-col items-center"
             >
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                   <Monitor size={40} className="text-green-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">لابتوب / كاشير</h3>
                <p className="text-sm text-slate-400">واجهة كاملة، تقارير مفصلة، تحكم شامل</p>
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 className="text-green-500" />
                </div>
             </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN APP ---
  return (
    <div className={`flex h-screen w-screen bg-slate-100 font-sans overflow-hidden ${deviceType === 'MOBILE' ? 'flex-col-reverse' : 'flex-row'}`}>
      <Sidebar currentView={currentView} onChangeView={setCurrentView} deviceType={deviceType} />
      <main className={`flex-1 h-full overflow-hidden relative ${deviceType === 'MOBILE' ? 'pb-16' : ''}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;