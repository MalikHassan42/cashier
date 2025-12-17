import React, { useState, useMemo } from 'react';
import { Search, Trash2, Plus, Minus, CreditCard, Banknote, PauseCircle, RotateCcw, ShoppingBag, X } from 'lucide-react';
import { Product, CartItem, Order, DeliveryProvider, DeviceType } from '../types';
import { MOCK_PRODUCTS, CATEGORIES, DELIVERY_APPS } from '../constants';

const TAX_RATE = 0.15;

interface POSProps {
    deviceType?: DeviceType;
}

const POS: React.FC<POSProps> = ({ deviceType = 'LAPTOP' }) => {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Mobile: Toggle Cart View
  const [showMobileCart, setShowMobileCart] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesCategory = activeCategory === 'الكل' || p.category === activeCategory;
      const matchesSearch = p.name.includes(searchQuery) || p.sku.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const handleCheckout = (method: 'CASH' | 'CARD' | 'APP', provider?: DeliveryProvider) => {
    alert(`تم تسجيل الطلب بنجاح!\nطريقة الدفع: ${method}\nالمصدر: ${provider || 'محلي'}\nالإجمالي: ${total.toFixed(2)} ريال`);
    setCart([]);
    setShowPaymentModal(false);
    setShowMobileCart(false);
  };

  const isMobile = deviceType === 'MOBILE';
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex h-full bg-slate-100 overflow-hidden relative">
      {/* LEFT: Products Grid (Full width on mobile, partial on desktop) */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all ${isMobile ? 'w-full' : ''}`}>
        {/* Header Filter */}
        <div className="bg-white p-3 shadow-sm border-b border-slate-200">
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="بحث..." 
                className="w-full pl-4 pr-10 py-2 bg-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {isMobile && (
                 <button 
                    onClick={() => setShowMobileCart(true)}
                    className="relative bg-blue-600 text-white p-2 rounded-lg"
                 >
                     <ShoppingBag size={20} />
                     {cartItemCount > 0 && (
                         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white">
                             {cartItemCount}
                         </span>
                     )}
                 </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-medium transition-colors ${
                  activeCategory === cat 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-3 pb-20">
          <div className={`grid gap-3 ${
              deviceType === 'MOBILE' ? 'grid-cols-2' : 
              deviceType === 'TABLET' ? 'grid-cols-3' : 
              'grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
          }`}>
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                onClick={() => addToCart(product)}
                className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-blue-400 transition-all group active:scale-95"
              >
                <div className="relative aspect-square mb-2 overflow-hidden rounded-lg">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-1 right-1 bg-slate-900/70 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {product.stock}
                  </div>
                </div>
                <h3 className="font-bold text-slate-800 text-xs mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-blue-600 font-bold text-sm">{product.price} <span className="text-[10px]">ريال</span></p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Cart & Checkout (Responsive) */}
      <div className={`
          bg-white shadow-2xl flex flex-col border-r border-slate-200 z-30 transition-transform duration-300
          ${isMobile 
              ? `fixed inset-0 transform ${showMobileCart ? 'translate-x-0' : '-translate-x-full'}` 
              : 'w-80 lg:w-96 relative translate-x-0'}
      `}>
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-bold text-md flex items-center gap-2">
            <ShoppingBag className="text-blue-600" size={20} />
            السلة
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
               {cartItemCount}
            </span>
          </h2>
          {isMobile && (
              <button onClick={() => setShowMobileCart(false)} className="p-2 bg-slate-200 rounded-full hover:bg-slate-300">
                  <X size={20} />
              </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <ShoppingBag size={48} className="mb-2 opacity-20" />
              <p>السلة فارغة</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <img src={item.image} className="w-10 h-10 rounded bg-slate-200 object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-800 truncate">{item.name}</h4>
                  <div className="text-xs text-slate-500">{item.price} ريال</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white border rounded hover:bg-slate-100"><Minus size={10} /></button>
                    <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white border rounded hover:bg-slate-100"><Plus size={10} /></button>
                  </div>
                  <div className="text-sm font-bold text-slate-700">{(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 self-center pl-1">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Cart Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="space-y-1 mb-3">
            <div className="flex justify-between text-slate-600 text-sm">
              <span>المجموع الفرعي</span>
              <span>{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 text-sm">
              <span>الضريبة (15%)</span>
              <span>{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-slate-800 pt-2 border-t border-slate-200">
              <span>الإجمالي</span>
              <span>{total.toFixed(2)} ريال</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-2">
            <button className="flex items-center justify-center gap-1 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 text-xs font-bold">
              <PauseCircle size={14} /> تعليق
            </button>
            <button className="flex items-center justify-center gap-1 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 text-xs font-bold">
              <RotateCcw size={14} /> مرتجع
            </button>
          </div>
          
          <button 
            disabled={cart.length === 0}
            onClick={() => setShowPaymentModal(true)}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            دفع {total.toFixed(2)}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">إتمام الدفع</h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">{total.toFixed(2)} ريال</div>
              </div>
            </div>
            
            <div className="p-6">
              <h4 className="text-slate-500 font-bold mb-3 uppercase text-xs tracking-wider">الدفع المحلي</h4>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button 
                  onClick={() => handleCheckout('CASH')}
                  className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <Banknote size={32} className="text-slate-400 group-hover:text-green-600 mb-2" />
                  <span className="font-bold text-slate-700">نقد</span>
                </button>
                <button 
                  onClick={() => handleCheckout('CARD')}
                  className="flex flex-col items-center justify-center p-4 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <CreditCard size={32} className="text-slate-400 group-hover:text-blue-600 mb-2" />
                  <span className="font-bold text-slate-700">شبكة</span>
                </button>
              </div>

              <h4 className="text-slate-500 font-bold mb-3 uppercase text-xs tracking-wider">تطبيقات التوصيل</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {DELIVERY_APPS.map(app => (
                  <button
                    key={app.id}
                    onClick={() => handleCheckout('APP', app.id as DeliveryProvider)}
                    className={`${app.color} py-3 rounded-lg font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all text-xs`}
                  >
                    {app.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between">
               <button 
                 onClick={() => setShowPaymentModal(false)}
                 className="w-full py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium"
               >
                 إلغاء
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;