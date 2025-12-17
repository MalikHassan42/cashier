import React, { useState, useMemo } from 'react';
import { FileText, Printer, ChevronLeft, ArrowRight, Table as TableIcon, FileSpreadsheet, X } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';

// --- Data Generation Helpers (To ensure CORRECT NUMBERS) ---

const generateHistoricalSales = () => {
  const sales = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30); // Last 30 days
  const apps = ['HungerStation', 'Jahez', 'Mrsool', 'ToYou'];
  const staff = ['Ahmed', 'Sarah', 'Mohammed', 'Ali'];

  // Generate 150 realistic transactions
  for (let i = 0; i < 150; i++) {
    const randomProductIdx = Math.floor(Math.random() * MOCK_PRODUCTS.length);
    const product = MOCK_PRODUCTS[randomProductIdx];
    const qty = Math.floor(Math.random() * 5) + 1;
    
    // Randomize Time
    const date = new Date(startDate);
    date.setDate(date.getDate() + Math.floor(Math.random() * 30));
    date.setHours(9 + Math.floor(Math.random() * 14), Math.floor(Math.random() * 60)); // 9 AM to 11 PM

    const subtotal = product.price * qty;
    const tax = subtotal * 0.15;
    const total = subtotal + tax;
    
    // Determine Payment/Source
    const rand = Math.random();
    let paymentMethod = 'Cash';
    let source = 'In-Store';
    
    if (rand > 0.7) {
        paymentMethod = 'Delivery App';
        source = apps[Math.floor(Math.random() * apps.length)];
    } else if (rand > 0.4) {
        paymentMethod = 'Card';
    }

    sales.push({
      id: `INV-${1000 + i}`,
      date: date.toISOString().split('T')[0],
      time: date.toLocaleTimeString('en-US', { hour12: false }),
      productId: product.id,
      productName: product.name, // Keep Arabic name or map to English if available
      category: product.category,
      unitPrice: product.price,
      quantity: qty,
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      total: Number(total.toFixed(2)),
      paymentMethod,
      source,
      cashier: staff[Math.floor(Math.random() * staff.length)]
    });
  }
  return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Cache the data
const MASTER_SALES_DATA = generateHistoricalSales();

// --- Full Report Categories (Restored) ---
const REPORT_CATEGORIES = [
  {
    id: 'SHIFT',
    title: 'الكاشير والورديات',
    description: 'تقارير الإغلاق، Z-Report، وتسوية الصندوق',
    reports: [
      { id: 'Z_REPORT', title: 'تقرير إغلاق الوردية (Z-Report)' },
      { id: 'X_REPORT', title: 'تقرير قراءة الوردية (X-Report)' },
      { id: 'CASH_DRAWER', title: 'تقرير تسوية الصندوق' },
      { id: 'PAYMENTS', title: 'تفاصيل المدفوعات' },
      { id: 'CASH_LOG', title: 'سجل حركات الصندوق' },
    ]
  },
  {
    id: 'SALES',
    title: 'المبيعات والأداء',
    description: 'تحليل المبيعات، الأرباح، وأداء الموظفين',
    reports: [
      { id: 'SALES_DUMP', title: 'ملف المبيعات الخام (Sales Dump)' },
      { id: 'SALES_ITEM', title: 'المبيعات حسب الصنف' },
      { id: 'SALES_CAT', title: 'المبيعات حسب القسم' },
      { id: 'HOURLY', title: 'المبيعات الساعي (Heatmap)' },
      { id: 'STAFF', title: 'تقرير أداء الموظفين' },
      { id: 'PROFIT', title: 'تقرير الأرباح والهوامش' },
      { id: 'BASKET', title: 'تحليل سلة المشتريات' },
    ]
  },
  {
    id: 'DELIVERY',
    title: 'تطبيقات التوصيل',
    description: 'هنقرستيشن، مرسول، جاهز - التسويات والعمولات',
    reports: [
      { id: 'APPS_COMPARE', title: 'مبيعات المنصات المقارن' },
      { id: 'COMMISSIONS', title: 'تقرير العمولات وصافي الدخل' },
      { id: 'APPS_RECON', title: 'تقرير التسوية مع التطبيقات' },
    ]
  },
  {
    id: 'INVENTORY',
    title: 'المخزون والمستودعات',
    description: 'قيمة المخزون، النواقص، والهالك',
    reports: [
      { id: 'VALUATION', title: 'تقرير قيمة المخزون الحالية' },
      { id: 'STOCKTAKING', title: 'نموذج الجرد المخزني' },
      { id: 'LOW_STOCK', title: 'تقرير حد الطلب والنواقص' },
      { id: 'MOVEMENT', title: 'تقرير حركة الصنف' },
      { id: 'WASTE', title: 'تقرير الهالك والتالف' },
      { id: 'EXPIRY', title: 'تقرير تواريخ الصلاحية' },
    ]
  },
  {
    id: 'SECURITY',
    title: 'المراقبة والأمان',
    description: 'الإلغاءات، المرتجعات، وفتح الدرج',
    reports: [
      { id: 'VOIDS', title: 'تقرير الإلغاءات والمرتجعات' },
      { id: 'DRAWER_OPEN', title: 'تقرير فتح الدرج (No-Sale)' },
      { id: 'OVERRIDES', title: 'تعديلات الأسعار والخصومات' },
      { id: 'LOGS', title: 'سجل دخول وخروج النظام' },
    ]
  },
  {
    id: 'FINANCE',
    title: 'المالية والضريبية',
    description: 'الضريبة، الذمم، والمصاريف',
    reports: [
      { id: 'VAT_OUTPUT', title: 'تقرير ضريبة القيمة المضافة (VAT)' },
      { id: 'VAT_INPUT', title: 'تقرير المشتريات الضريبي' },
      { id: 'AR_AP', title: 'تقرير الذمم الدائنة والمدينة' },
    ]
  },
];

const Reports: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // --- Logic to Generate Data for ALL Reports (ENGLISH) ---
  const getReportData = (reportId: string) => {
    let headers: string[] = [];
    let rows: any[] = [];
    let summary: any = null;

    // --- SALES REPORTS ---
    if (reportId === 'SALES_DUMP') {
      headers = ['Invoice ID', 'Date', 'Time', 'Product', 'Category', 'Qty', 'Unit Price', 'Subtotal', 'Tax (15%)', 'Total', 'Payment Method', 'Source', 'Cashier'];
      rows = MASTER_SALES_DATA.map(s => [
        s.id, s.date, s.time, s.productName, s.category, s.quantity, s.unitPrice, s.subtotal, s.tax, s.total, s.paymentMethod, s.source, s.cashier
      ]);
    } 
    else if (reportId === 'SALES_ITEM') {
        const grouped = MASTER_SALES_DATA.reduce((acc: any, curr) => {
            if (!acc[curr.productName]) acc[curr.productName] = { qty: 0, total: 0 };
            acc[curr.productName].qty += curr.quantity;
            acc[curr.productName].total += curr.total;
            return acc;
        }, {});
        headers = ['Product Name', 'Total Qty', 'Total Sales', 'Avg Price'];
        rows = Object.keys(grouped).map(name => [
            name, grouped[name].qty, grouped[name].total.toFixed(2), (grouped[name].total / grouped[name].qty).toFixed(2)
        ]);
    }
    else if (reportId === 'SALES_CAT') {
        const grouped = MASTER_SALES_DATA.reduce((acc: any, curr) => {
            if (!acc[curr.category]) acc[curr.category] = { qty: 0, total: 0 };
            acc[curr.category].qty += curr.quantity;
            acc[curr.category].total += curr.total;
            return acc;
        }, {});
        headers = ['Category', 'Qty Sold', 'Total Sales', 'Contribution %'];
        const totalSales = MASTER_SALES_DATA.reduce((sum, s) => sum + s.total, 0);
        rows = Object.keys(grouped).map(cat => [
            cat, grouped[cat].qty, grouped[cat].total.toFixed(2), ((grouped[cat].total / totalSales) * 100).toFixed(1) + '%'
        ]);
    }
    else if (reportId === 'STAFF') {
        const grouped = MASTER_SALES_DATA.reduce((acc: any, curr) => {
            if (!acc[curr.cashier]) acc[curr.cashier] = { orders: 0, total: 0 };
            acc[curr.cashier].orders += 1;
            acc[curr.cashier].total += curr.total;
            return acc;
        }, {});
        headers = ['Staff Name', 'Orders Count', 'Total Sales', 'Avg Ticket'];
        rows = Object.keys(grouped).map(name => [
            name, grouped[name].orders, grouped[name].total.toFixed(2), (grouped[name].total / grouped[name].orders).toFixed(2)
        ]);
    }
    else if (reportId === 'HOURLY') {
        headers = ['Hour Slot', 'Orders', 'Total Sales'];
        // Dummy data for example
        rows = [
            ['09:00 - 10:00', 12, 450.00], ['10:00 - 11:00', 18, 620.00], ['11:00 - 12:00', 25, 980.00],
            ['12:00 - 13:00', 45, 1800.00], ['13:00 - 14:00', 38, 1550.00]
        ];
    }
    else if (reportId === 'PROFIT') {
        headers = ['Invoice ID', 'Sales Amount', 'Est. Cost (40%)', 'Gross Profit', 'Margin %'];
        rows = MASTER_SALES_DATA.slice(0, 20).map(s => {
            const cost = s.subtotal * 0.4;
            const profit = s.subtotal - cost;
            return [s.id, s.subtotal.toFixed(2), cost.toFixed(2), profit.toFixed(2), '60%'];
        });
    }

    // --- SHIFT REPORTS ---
    else if (reportId === 'Z_REPORT' || reportId === 'X_REPORT') {
      const todaySales = MASTER_SALES_DATA.slice(0, 30); // Simulate today
      const totalCash = todaySales.filter(s => s.paymentMethod === 'Cash').reduce((sum, s) => sum + s.total, 0);
      const totalCard = todaySales.filter(s => s.paymentMethod === 'Card').reduce((sum, s) => sum + s.total, 0);
      const totalTax = todaySales.reduce((sum, s) => sum + s.tax, 0);
      const totalSales = totalCash + totalCard;

      headers = ['Item', 'Value'];
      rows = [
        ['Shift Start', new Date().toLocaleDateString() + ' 08:00 AM'],
        ['Shift End', new Date().toLocaleDateString() + ' 04:00 PM'],
        ['Total Sales (Inc Tax)', totalSales.toFixed(2)],
        ['Total Cash', totalCash.toFixed(2)],
        ['Total Card', totalCard.toFixed(2)],
        ['Total Tax (VAT 15%)', totalTax.toFixed(2)],
        ['Net Sales (Ex Tax)', (totalSales - totalTax).toFixed(2)],
        ['Transaction Count', todaySales.length],
        ['Variance', '0.00']
      ];
    }
    else if (reportId === 'PAYMENTS') {
        const grouped = MASTER_SALES_DATA.reduce((acc: any, curr) => {
            if (!acc[curr.paymentMethod]) acc[curr.paymentMethod] = 0;
            acc[curr.paymentMethod] += curr.total;
            return acc;
        }, {});
        headers = ['Payment Method', 'Amount'];
        rows = Object.keys(grouped).map(method => [method, grouped[method].toFixed(2)]);
    }

    // --- DELIVERY REPORTS ---
    else if (reportId === 'APPS_COMPARE') {
        const apps = MASTER_SALES_DATA.filter(s => s.paymentMethod === 'Delivery App');
        const grouped = apps.reduce((acc: any, curr) => {
            if (!acc[curr.source]) acc[curr.source] = 0;
            acc[curr.source] += curr.total;
            return acc;
        }, {});
        headers = ['App Name', 'Total Sales'];
        rows = Object.keys(grouped).map(app => [app, grouped[app].toFixed(2)]);
    }
    else if (reportId === 'COMMISSIONS') {
        headers = ['App Name', 'Total Sales', 'Commission %', 'Commission Value', 'Net Profit'];
        rows = [
            ['HungerStation', '5000.00', '18%', '900.00', '4100.00'],
            ['Jahez', '3200.00', '15%', '480.00', '2720.00'],
            ['Mrsool', '1500.00', '12%', '180.00', '1320.00']
        ];
    }

    // --- INVENTORY REPORTS ---
    else if (reportId === 'VALUATION') {
      headers = ['Product ID', 'Product Name', 'Current Stock', 'Cost Price', 'Sell Price', 'Inventory Value'];
      rows = MOCK_PRODUCTS.map(p => [
        p.id, p.name, p.stock, (p.price * 0.4).toFixed(2), p.price, (p.stock * p.price).toFixed(2)
      ]);
      const grandTotal = MOCK_PRODUCTS.reduce((sum, p) => sum + (p.stock * p.price), 0);
      summary = { label: 'Total Inventory Value', value: grandTotal.toFixed(2) + ' SAR' };
    }
    else if (reportId === 'STOCKTAKING') {
      headers = ['SKU', 'Product Name', 'Unit', 'System Stock', 'Physical Stock', 'Diff', 'Notes'];
      rows = MOCK_PRODUCTS.map(p => [
        p.sku, p.name, p.unit, p.stock, '', '', ''
      ]);
    }
    else if (reportId === 'LOW_STOCK') {
        headers = ['SKU', 'Product Name', 'Current Stock', 'Reorder Point', 'Status'];
        rows = MOCK_PRODUCTS.filter(p => p.stock < 50).map(p => [
            p.sku, p.name, p.stock, 50, 'Low Stock'
        ]);
    }

    // --- FINANCE & TAX ---
    else if (reportId === 'VAT_OUTPUT') {
      headers = ['Date', 'Invoice ID', 'Customer/Source', 'Tax ID', 'Taxable Amount', 'Tax Amount (15%)', 'Total Amount'];
      rows = MASTER_SALES_DATA.map(s => [
        s.date, s.id, s.source === 'In-Store' ? 'Walk-in Customer' : s.source, '-', s.subtotal, s.tax, s.total
      ]);
      const totalTax = MASTER_SALES_DATA.reduce((sum, s) => sum + s.tax, 0);
      summary = { label: 'Total Output Tax', value: totalTax.toFixed(2) + ' SAR' };
    }

    // --- GENERIC FALLBACK FOR OTHERS ---
    else {
        headers = ['Date', 'Time', 'ID', 'Description', 'Value', 'User'];
        // Generate generic lines
        for(let i=0; i<10; i++) {
            rows.push([
                new Date().toISOString().split('T')[0], '12:00', `GEN-${i}`, 'System Transaction', (Math.random()*100).toFixed(2), 'Admin'
            ]);
        }
    }

    return { headers, rows, summary };
  };

  const handleOpenReport = (report: any) => {
      const data = getReportData(report.id);
      setSelectedReport({ ...report, data });
  };

  const handlePrint = () => {
      window.print();
  };

  // --- FIXED EXCEL EXPORT FUNCTION ---
  const exportToExcel = (title: string, headers: string[], rows: any[][]) => {
    // 1. BOM for Arabic Support (still good to keep even if content is English, for name compatibility)
    const BOM = "\uFEFF"; 
    
    // 2. CSV String Construction
    const processCell = (cell: any) => {
        if (cell === null || cell === undefined) return '';
        // If it's a number, return as is (so Excel can do math)
        if (typeof cell === 'number') return cell; 
        
        const cellStr = String(cell);
        // Escape quotes and wrap in quotes if contains comma
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
    };

    // 3. Add "sep=," at the top to force Excel to use comma as delimiter
    const csvContent = BOM + "sep=,\n" + [
      headers.join(","),
      ...rows.map(row => row.map(processCell).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportSingle = () => {
    if (selectedReport) {
      exportToExcel(selectedReport.title, selectedReport.data.headers, selectedReport.data.rows);
    }
  };

  return (
    <div className="p-6 h-full bg-slate-50 flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 no-print">
        <div className="flex items-center gap-2">
          {activeCategory && (
            <button 
                onClick={() => setActiveCategory(null)} 
                className="p-1 rounded hover:bg-slate-200 transition-colors"
            >
                <ChevronLeft />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
                {activeCategory ? REPORT_CATEGORIES.find(c => c.id === activeCategory)?.title : 'التقارير الشاملة'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
                {activeCategory ? 'بيانات باللغة الإنجليزية وتصدير Excel' : 'اختر تصنيف التقرير للمتابعة'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {!activeCategory ? (
            // Categories Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {REPORT_CATEGORIES.map(category => (
                    <div 
                        key={category.id} 
                        onClick={() => setActiveCategory(category.id)}
                        className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 cursor-pointer transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FileText size={24} />
                            </div>
                            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
                                {category.reports.length} تقارير
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">{category.title}</h3>
                        <p className="text-sm text-slate-500">{category.description}</p>
                        <div className="mt-4 flex items-center text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            عرض القائمة <ArrowRight size={16} className="mr-1" />
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            // Report List within Category
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REPORT_CATEGORIES.find(c => c.id === activeCategory)?.reports.map(report => (
                    <div key={report.id} className="bg-white p-4 rounded-lg border border-slate-200 flex justify-between items-center shadow-sm hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="bg-slate-100 p-2 rounded text-slate-500">
                                <TableIcon size={20} />
                            </div>
                            <span className="font-bold text-slate-700">{report.title}</span>
                        </div>
                        <button 
                            onClick={() => handleOpenReport(report)}
                            className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-700 font-medium shadow-sm"
                        >
                            عرض التقرير
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Report Modal / Viewer */}
      {selectedReport && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
                 {/* Modal Header */}
                 <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 no-print">
                     <div>
                         <h3 className="font-bold text-lg">{selectedReport.title}</h3>
                         <p className="text-xs text-slate-500">البيانات جاهزة للتصدير (English Data)</p>
                     </div>
                     <div className="flex gap-2">
                         <button onClick={handleExportSingle} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-bold shadow transition-colors">
                             <FileSpreadsheet size={18} /> تصدير Excel (EN)
                         </button>
                         <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-bold transition-colors">
                             <Printer size={18} /> طباعة
                         </button>
                         <button onClick={() => setSelectedReport(null)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                             <X size={24} />
                         </button>
                     </div>
                 </div>

                 {/* Printable Report Content */}
                 <div className="flex-1 overflow-auto p-8" id="printable-area">
                     {/* Print-only Header */}
                     <div className="hidden print:block text-center mb-8">
                         <h1 className="text-2xl font-bold mb-2">Nizam Nizam - Official Report</h1>
                         <h2 className="text-xl border-b-2 border-black pb-2 inline-block">{selectedReport.title}</h2>
                         <p className="text-sm mt-2">Date: {new Date().toLocaleString('en-US')}</p>
                     </div>

                     {selectedReport.data.summary && (
                         <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center print:border-black">
                             <span className="font-bold text-lg">{selectedReport.data.summary.label}</span>
                             <span className="font-bold text-2xl text-blue-600 print:text-black">{selectedReport.data.summary.value}</span>
                         </div>
                     )}

                     <div className="overflow-x-auto" dir="ltr">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-100 print:bg-white print:border-b-2 print:border-black">
                                    {selectedReport.data.headers.map((h: string, i: number) => (
                                        <th key={i} className="p-3 border border-slate-200 print:border-0 print:border-b print:border-black font-bold text-slate-700 whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {selectedReport.data.rows.map((row: any[], i: number) => (
                                    <tr key={i} className="hover:bg-slate-50 print:hover:bg-transparent even:bg-slate-50/50">
                                        {row.map((cell, j) => (
                                            <td key={j} className="p-3 border border-slate-200 print:border-0 print:border-b print:border-slate-300 text-slate-600 whitespace-nowrap">
                                                {typeof cell === 'number' ? cell.toLocaleString('en-US') : cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>

                     <div className="mt-8 pt-4 border-t border-slate-200 print:block hidden">
                         <div className="flex justify-between text-sm">
                             <span>Printed By: Admin</span>
                             <span>Signature: __________________</span>
                         </div>
                     </div>
                 </div>
             </div>
          </div>
      )}
    </div>
  );
};

export default Reports;