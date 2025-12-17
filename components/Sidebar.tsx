import React from 'react';
import { LayoutGrid, ShoppingCart, Package, BarChart3, Truck, Settings, LogOut, FileText } from 'lucide-react';
import { View, DeviceType } from '../types';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
  deviceType: DeviceType;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, deviceType }) => {
  const menuItems = [
    { id: View.POS, label: 'البيع', icon: ShoppingCart },
    { id: View.DASHBOARD, label: 'الرئيسية', icon: LayoutGrid },
    { id: View.INVENTORY, label: 'المخزون', icon: Package },
    { id: View.ORDERS, label: 'الطلبات', icon: BarChart3 },
    { id: View.PURCHASING, label: 'المشتريات', icon: Truck },
    { id: View.REPORTS, label: 'التقارير', icon: FileText },
  ];

  const handleLogout = () => {
    if(window.confirm("هل أنت متأكد من إغلاق الوردية وتسجيل الخروج؟")) {
        window.location.reload(); // Quick reset to device selection
    }
  };

  // --- MOBILE LAYOUT (Bottom Navigation) ---
  if (deviceType === 'MOBILE') {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white shadow-2xl z-50 flex justify-around items-center h-16 pb-safe">
        {menuItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <Icon size={20} className={isActive ? 'fill-current opacity-20' : ''} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
        <button onClick={handleLogout} className="flex flex-col items-center justify-center w-full h-full text-red-400">
           <LogOut size={20} />
           <span className="text-[10px]">خروج</span>
        </button>
      </div>
    );
  }

  // --- TABLET LAYOUT (Slim Sidebar) ---
  if (deviceType === 'TABLET') {
    return (
      <div className="w-16 bg-slate-900 text-white flex flex-col h-screen transition-all shadow-xl z-50">
        <div className="p-4 flex justify-center border-b border-slate-700">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xl">N</div>
        </div>
        <nav className="flex-1 py-4 space-y-2 flex flex-col items-center">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                title={item.label}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
              </button>
            );
          })}
        </nav>
        <div className="p-2 flex flex-col items-center gap-2 border-t border-slate-700 pb-4">
            <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-slate-800 rounded-lg">
                <LogOut size={20} />
            </button>
        </div>
      </div>
    );
  }

  // --- LAPTOP/DESKTOP LAYOUT (Full Sidebar) ---
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen transition-all shadow-xl z-50">
      <div className="p-4 flex items-center border-b border-slate-700">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xl ml-3">N</div>
        <span className="font-bold text-lg">نظام نِظام</span>
      </div>

      <nav className="flex-1 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center px-4 py-3 transition-colors border-l-4 ${
                isActive 
                  ? 'bg-blue-600 text-white border-white' 
                  : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={24} />
              <span className="mr-3 font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button 
            onClick={() => alert("الإعدادات")}
            className="w-full flex items-center px-2 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Settings size={20} />
          <span className="mr-3">الإعدادات</span>
        </button>
        <button 
            onClick={handleLogout}
            className="w-full flex items-center px-2 py-2 mt-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="mr-3">إغلاق الوردية</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;