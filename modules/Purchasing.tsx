import React, { useState } from 'react';
import { PlusCircle, FileText, Truck, Users, MoreHorizontal, Download, Search, X, Check } from 'lucide-react';
import { MOCK_SUPPLIERS, MOCK_PURCHASE_ORDERS } from '../constants';
import { PurchaseOrder, Supplier } from '../types';

const Purchasing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PO' | 'SUPPLIERS'>('PO');
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(MOCK_PURCHASE_ORDERS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  
  // Modals state
  const [showPOModal, setShowPOModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  // Form State
  const [newSupplier, setNewSupplier] = useState({ name: '', phone: '', contact: '' });
  const [newPO, setNewPO] = useState({ supplierId: '', cost: '', items: '' });

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
            <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
            <h3 className="text-xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
            <Icon size={24} />
        </div>
    </div>
  );

  const handleAddSupplier = () => {
      if(!newSupplier.name) return;
      const supplier: Supplier = {
          id: `SUP-${Math.floor(Math.random() * 1000)}`,
          name: newSupplier.name,
          phone: newSupplier.phone,
          contactPerson: newSupplier.contact,
          email: 'test@email.com',
          balance: 0
      };
      setSuppliers([...suppliers, supplier]);
      setShowSupplierModal(false);
      setNewSupplier({ name: '', phone: '', contact: '' });
  };

  const handleCreatePO = () => {
      if(!newPO.supplierId) return;
      const supplier = suppliers.find(s => s.id === newPO.supplierId);
      const po: PurchaseOrder = {
          id: `PO-2023-${Math.floor(Math.random() * 1000)}`,
          supplierId: newPO.supplierId,
          supplierName: supplier?.name || 'Unknown',
          date: new Date().toISOString().split('T')[0],
          expectedDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          status: 'ORDERED',
          totalCost: Number(newPO.cost),
          itemsCount: Number(newPO.items)
      };
      setPurchaseOrders([po, ...purchaseOrders]);
      setShowPOModal(false);
      setNewPO({ supplierId: '', cost: '', items: '' });
  };

  const markAsReceived = (id: string) => {
      setPurchaseOrders(purchaseOrders.map(p => p.id === id ? {...p, status: 'RECEIVED'} : p));
  };

  const exportPO = () => {
      const headers = ['PO Number', 'Supplier', 'Date', 'Expected Date', 'Status', 'Cost', 'Items'];
      const BOM = "\uFEFF";
      const csvContent = BOM + "sep=,\n" + [
          headers.join(","),
          ...purchaseOrders.map(po => [
              po.id, `"${po.supplierName}"`, po.date, po.expectedDate, po.status, po.totalCost, po.itemsCount
          ].join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `purchase_orders_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="p-6 h-full bg-slate-50 flex flex-col overflow-hidden relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">المشتريات والموردين</h1>
          <p className="text-slate-500 text-sm mt-1">إدارة أوامر الشراء (PO)، فواتير الموردين، واستلام البضاعة</p>
        </div>
        <div className="flex gap-2">
            {activeTab === 'PO' && (
                <button 
                    onClick={exportPO}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
                >
                    <Download size={18} /> تصدير
                </button>
            )}
            <button 
                onClick={() => activeTab === 'PO' ? setShowPOModal(true) : setShowSupplierModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg shadow-blue-200 transition-all"
            >
                <PlusCircle size={18} />
                {activeTab === 'PO' ? 'أمر شراء جديد' : 'إضافة مورد'}
            </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="أوامر قيد الانتظار" value={purchaseOrders.filter(p => p.status === 'ORDERED').length} icon={Truck} color="bg-orange-500" />
        <StatCard label="مستحقات الموردين" value="6,500 ر.س" icon={Users} color="bg-red-500" />
        <StatCard label="مشتريات الشهر" value="12,450 ر.س" icon={FileText} color="bg-green-500" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        {/* Tab Header */}
        <div className="flex border-b border-slate-100 px-6 pt-4">
             <button
                onClick={() => setActiveTab('PO')}
                className={`pb-4 px-4 font-bold text-sm border-b-2 transition-colors ${
                    activeTab === 'PO' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
            >
                أوامر الشراء (Purchase Orders)
            </button>
            <button
                onClick={() => setActiveTab('SUPPLIERS')}
                className={`pb-4 px-4 font-bold text-sm border-b-2 transition-colors ${
                    activeTab === 'SUPPLIERS' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
            >
                قائمة الموردين
            </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-0">
            {activeTab === 'PO' ? (
                <table className="w-full text-right">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">رقم الأمر</th>
                            <th className="px-6 py-4">المورد</th>
                            <th className="px-6 py-4">تاريخ الطلب</th>
                            <th className="px-6 py-4">التكلفة المتوقعة</th>
                            <th className="px-6 py-4">الحالة</th>
                            <th className="px-6 py-4 text-center">الإجراء</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {purchaseOrders.map(po => (
                            <tr key={po.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-bold text-blue-600">{po.id}</td>
                                <td className="px-6 py-4 font-medium text-slate-800">{po.supplierName}</td>
                                <td className="px-6 py-4 text-slate-600">{po.date}</td>
                                <td className="px-6 py-4 font-bold">{po.totalCost.toLocaleString()} ر.س</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        po.status === 'RECEIVED' ? 'bg-green-100 text-green-700' :
                                        po.status === 'ORDERED' ? 'bg-blue-100 text-blue-700' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {po.status === 'RECEIVED' ? 'تم الاستلام' : 
                                         po.status === 'ORDERED' ? 'تم الطلب' : 'مسودة'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {po.status === 'ORDERED' ? (
                                        <button 
                                            onClick={() => markAsReceived(po.id)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-full flex items-center gap-1 mx-auto text-xs"
                                        >
                                           <Check size={14} /> استلام
                                        </button>
                                    ) : (
                                        <span className="text-slate-300">-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suppliers.map(supplier => (
                        <div key={supplier.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div className="bg-slate-100 w-10 h-10 rounded-full flex items-center justify-center text-slate-600 font-bold">
                                    {supplier.name[0]}
                                </div>
                                <div className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">
                                    نشط
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-800 mb-1">{supplier.name}</h3>
                            <p className="text-xs text-slate-500 mb-4">{supplier.id}</p>
                            
                            <div className="space-y-2 text-sm text-slate-600 mb-4">
                                <div className="flex justify-between">
                                    <span>المسؤول:</span>
                                    <span className="font-medium text-slate-800">{supplier.contactPerson}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>الجوال:</span>
                                    <span className="font-medium text-slate-800" dir="ltr">{supplier.phone}</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
                                    <span>الرصيد المستحق:</span>
                                    <span className="font-bold text-red-600">{supplier.balance} ر.س</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 py-2 text-xs border border-slate-200 rounded-lg hover:bg-slate-50 font-medium">كشف حساب</button>
                                <button className="flex-1 py-2 text-xs bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium">اتصال</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* New PO Modal */}
      {showPOModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                 <h3 className="font-bold text-lg mb-4">إنشاء أمر شراء جديد</h3>
                 <div className="space-y-4">
                     <div>
                         <label className="block text-sm mb-1 text-slate-600">المورد</label>
                         <select 
                            className="w-full border rounded p-2 bg-white"
                            onChange={(e) => setNewPO({...newPO, supplierId: e.target.value})}
                         >
                             <option value="">اختر المورد...</option>
                             {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                         </select>
                     </div>
                     <div>
                         <label className="block text-sm mb-1 text-slate-600">التكلفة المتوقعة</label>
                         <input 
                            type="number" 
                            className="w-full border rounded p-2" 
                            onChange={(e) => setNewPO({...newPO, cost: e.target.value})}
                         />
                     </div>
                     <div>
                         <label className="block text-sm mb-1 text-slate-600">عدد الأصناف</label>
                         <input 
                            type="number" 
                            className="w-full border rounded p-2" 
                            onChange={(e) => setNewPO({...newPO, items: e.target.value})}
                         />
                     </div>
                 </div>
                 <div className="flex justify-end gap-2 mt-6">
                     <button onClick={() => setShowPOModal(false)} className="px-4 py-2 text-slate-500">إلغاء</button>
                     <button onClick={handleCreatePO} className="px-4 py-2 bg-blue-600 text-white rounded">إنشاء الطلب</button>
                 </div>
             </div>
          </div>
      )}

      {/* New Supplier Modal */}
      {showSupplierModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                 <h3 className="font-bold text-lg mb-4">إضافة مورد جديد</h3>
                 <div className="space-y-4">
                     <input 
                        placeholder="اسم المورد" 
                        className="w-full border rounded p-2" 
                        onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
                     />
                     <input 
                        placeholder="اسم المسؤول" 
                        className="w-full border rounded p-2" 
                        onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})}
                     />
                     <input 
                        placeholder="رقم الهاتف" 
                        className="w-full border rounded p-2" 
                        onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                     />
                 </div>
                 <div className="flex justify-end gap-2 mt-6">
                     <button onClick={() => setShowSupplierModal(false)} className="px-4 py-2 text-slate-500">إلغاء</button>
                     <button onClick={handleAddSupplier} className="px-4 py-2 bg-blue-600 text-white rounded">حفظ المورد</button>
                 </div>
             </div>
          </div>
      )}

    </div>
  );
};

export default Purchasing;