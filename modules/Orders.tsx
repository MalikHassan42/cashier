import React, { useState } from 'react';
import { Search, Filter, Eye, Printer, ArrowUpRight, Clock, CheckCircle2, XCircle, X } from 'lucide-react';
import { MOCK_ORDERS, DELIVERY_APPS } from '../constants';
import { Order, DeliveryProvider } from '../types';

const Orders: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'COMPLETED' | 'DELIVERY' | 'HOLD' | 'REFUNDED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Use this state to render the specific order for printing
  const [printOrder, setPrintOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    // Status Filter
    if (activeFilter === 'COMPLETED' && order.status !== 'COMPLETED') return false;
    if (activeFilter === 'HOLD' && order.status !== 'HOLD') return false;
    if (activeFilter === 'REFUNDED' && order.status !== 'REFUNDED') return false;
    if (activeFilter === 'DELIVERY' && order.paymentMethod !== 'DELIVERY_APP') return false;

    // Search Filter
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
            order.id.toLowerCase().includes(term) ||
            order.orderRefId?.toLowerCase().includes(term) ||
            order.deliveryProvider?.toLowerCase().includes(term)
        );
    }

    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
        case 'COMPLETED': return <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-bold"><CheckCircle2 size={12}/> مكتمل</span>;
        case 'HOLD': return <span className="flex items-center gap-1 text-orange-600 bg-orange-100 px-2 py-1 rounded-full text-xs font-bold"><Clock size={12}/> معلق</span>;
        case 'REFUNDED': return <span className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-bold"><XCircle size={12}/> مرتجع</span>;
        default: return <span className="text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs">{status}</span>;
    }
  };

  const getDeliveryIcon = (provider: DeliveryProvider) => {
      const app = DELIVERY_APPS.find(a => a.id === provider);
      if (app) {
          return <span className={`text-[10px] px-2 py-0.5 rounded text-white ${app.color.split(' ')[0]}`}>{app.name}</span>
      }
      return null;
  };

  const handlePrint = (e: React.MouseEvent, order: Order) => {
      e.stopPropagation();
      setPrintOrder(order);
      // Wait for state to update then print
      setTimeout(() => {
          window.print();
          // Clear print order after printing is initiated (optional, but good for cleanup)
          // setPrintOrder(null); 
      }, 100);
  };

  const handleRefund = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if(window.confirm("هل أنت متأكد من تحويل هذا الطلب إلى مرتجع؟")) {
          setOrders(orders.map(o => o.id === id ? {...o, status: 'REFUNDED'} : o));
      }
  };

  return (
    <div className="p-6 h-full bg-slate-50 flex flex-col overflow-hidden relative">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة الطلبات</h1>
          <p className="text-slate-500 text-sm mt-1">عرض ومتابعة الفواتير، الطلبات المعلقة، والمرتجع</p>
        </div>
        <div className="flex gap-2">
            <div className="relative">
                <Search className="absolute right-3 top-2.5 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="رقم الطلب / المرجع..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-4 pr-10 py-2 w-64 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium">
                <Filter size={18} />
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-4 overflow-x-auto">
        {[
            { id: 'ALL', label: 'الكل' },
            { id: 'COMPLETED', label: 'المكتملة' },
            { id: 'DELIVERY', label: 'تطبيقات التوصيل' },
            { id: 'HOLD', label: 'المعلقة' },
            { id: 'REFUNDED', label: 'المرتجعات' }
        ].map(tab => (
            <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                    activeFilter === tab.id 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
            >
                {tab.label}
            </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="flex-1 overflow-auto bg-white rounded-xl shadow-sm border border-slate-200">
        <table className="w-full text-right">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                    <th className="px-6 py-4 font-medium text-slate-500 text-sm">رقم الطلب</th>
                    <th className="px-6 py-4 font-medium text-slate-500 text-sm">التاريخ والوقت</th>
                    <th className="px-6 py-4 font-medium text-slate-500 text-sm">النوع / المصدر</th>
                    <th className="px-6 py-4 font-medium text-slate-500 text-sm">عدد الأصناف</th>
                    <th className="px-6 py-4 font-medium text-slate-500 text-sm">الإجمالي</th>
                    <th className="px-6 py-4 font-medium text-slate-500 text-sm">الحالة</th>
                    <th className="px-6 py-4 font-medium text-slate-500 text-sm text-center">إجراءات</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                            لا توجد طلبات مطابقة للبحث
                        </td>
                    </tr>
                ) : (
                    filteredOrders.map(order => (
                        <tr key={order.id} onClick={() => setSelectedOrder(order)} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                            <td className="px-6 py-4">
                                <span className="font-bold text-slate-800">{order.id}</span>
                                {order.orderRefId && (
                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        Ref: {order.orderRefId}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 text-slate-600 text-sm" dir="ltr">
                                {order.date}
                            </td>
                            <td className="px-6 py-4">
                                {order.deliveryProvider !== 'NONE' ? (
                                    <div className="flex items-center gap-2">
                                        {getDeliveryIcon(order.deliveryProvider!)}
                                    </div>
                                ) : (
                                    <span className="text-sm text-slate-600">محلي (Walk-in)</span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                                {order.items.length} أصناف
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-800">
                                {order.total.toFixed(2)} ر.س
                            </td>
                            <td className="px-6 py-4">
                                {getStatusBadge(order.status)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} title="عرض التفاصيل" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                        <Eye size={18} />
                                    </button>
                                    <button onClick={(e) => handlePrint(e, order)} title="طباعة الفاتورة" className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                                        <Printer size={18} />
                                    </button>
                                    {order.status === 'COMPLETED' && (
                                        <button onClick={(e) => handleRefund(e, order.id)} title="استرجاع" className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                            <ArrowUpRight size={18} />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm no-print">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg h-[80vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="font-bold text-lg">تفاصيل الطلب: {selectedOrder.id}</h3>
                        <span className="text-xs text-slate-500">{selectedOrder.date}</span>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-red-500"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm mb-4">
                         <h4 className="font-bold text-sm mb-2 text-slate-700">المنتجات</h4>
                         <div className="space-y-3">
                             {selectedOrder.items.map((item, idx) => (
                                 <div key={idx} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0">
                                     <div className="flex items-center gap-3">
                                         <div className="w-8 h-8 bg-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-500">
                                             x{item.quantity}
                                         </div>
                                         <div>
                                             <div className="text-sm font-bold text-slate-800">{item.name}</div>
                                             {item.note && <div className="text-xs text-orange-500">ملاحظة: {item.note}</div>}
                                         </div>
                                     </div>
                                     <div className="font-medium text-slate-600">
                                         {(item.price * item.quantity).toFixed(2)}
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex justify-between text-sm mb-1 text-slate-600">
                            <span>المجموع الفرعي</span>
                            <span>{selectedOrder.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2 text-slate-600">
                            <span>الضريبة (15%)</span>
                            <span>{selectedOrder.tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-slate-100 pt-2 flex justify-between font-bold text-lg text-slate-800">
                            <span>الإجمالي</span>
                            <span>{selectedOrder.total.toFixed(2)} ر.س</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-200 flex gap-2 bg-white">
                    <button onClick={(e) => handlePrint(e, selectedOrder)} className="flex-1 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-bold flex justify-center items-center gap-2">
                        <Printer size={18} /> طباعة الإيصال
                    </button>
                </div>
            </div>
          </div>
      )}

      {/* PRINT RECEIPT TEMPLATE */}
      {printOrder && (
          <div id="printable-area" className="hidden">
              <div className="w-[80mm] mx-auto p-4 text-center font-mono text-black">
                  <div className="font-bold text-xl mb-2">مطعم نِظام</div>
                  <div className="text-xs mb-4">طريق الملك فهد، الرياض<br/>الرقم الضريبي: 300012345678903</div>
                  
                  <div className="border-b-2 border-dashed border-black my-2"></div>
                  
                  <div className="flex justify-between text-xs font-bold mb-2">
                      <span>{printOrder.id}</span>
                      <span>{printOrder.date}</span>
                  </div>
                  
                  <div className="text-left text-xs mb-2">
                      نوع الطلب: {printOrder.deliveryProvider !== 'NONE' ? printOrder.deliveryProvider : 'محلي'}
                  </div>

                  <div className="border-b border-dashed border-black my-2"></div>
                  
                  <table className="w-full text-xs text-right">
                      <thead>
                          <tr>
                              <th>الكمية</th>
                              <th>الصنف</th>
                              <th>السعر</th>
                          </tr>
                      </thead>
                      <tbody>
                          {printOrder.items.map((item, idx) => (
                              <tr key={idx}>
                                  <td className="py-1">{item.quantity}</td>
                                  <td className="py-1">{item.name}</td>
                                  <td className="py-1">{(item.price * item.quantity).toFixed(2)}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>

                  <div className="border-b border-dashed border-black my-2"></div>

                  <div className="flex justify-between text-xs font-bold">
                      <span>المجموع (شامل الضريبة)</span>
                      <span>{printOrder.total.toFixed(2)}</span>
                  </div>
                   <div className="flex justify-between text-[10px] mt-1">
                      <span>الضريبة (15%)</span>
                      <span>{printOrder.tax.toFixed(2)}</span>
                  </div>

                  <div className="border-b-2 border-dashed border-black my-4"></div>
                  
                  <div className="text-center text-xs">
                      شكراً لزيارتكم<br/>
                      Thank You
                  </div>
                  <div className="mt-4 flex justify-center">
                    {/* Placeholder for QR Code */}
                    <div className="w-20 h-20 bg-black"></div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Orders;