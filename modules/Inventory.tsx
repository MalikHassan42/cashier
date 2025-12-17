import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { Filter, Download, PlusCircle, X, Save, Edit2, Sparkles, Loader2, Image as ImageIcon, BrainCircuit, MessageSquare } from 'lucide-react';
import { Product } from '../types';
import { GoogleGenAI } from "@google/genai";

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // AI Generation State (Image)
  const [showAiModal, setShowAiModal] = useState(false);
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSize, setAiSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // AI Thinking Mode State
  const [showThinkingModal, setShowThinkingModal] = useState(false);
  const [thinkPrompt, setThinkPrompt] = useState('');
  const [thinkResponse, setThinkResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Track which form field to update (add or edit)
  const [targetForm, setTargetForm] = useState<'NEW' | 'EDIT'>('NEW');

  // New Product Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    stock: 0,
    category: 'عام',
    sku: '',
    unit: 'PCS',
    image: ''
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    
    const product: Product = {
      id: Math.random().toString(36).substr(2, 9),
      image: newProduct.image || 'https://picsum.photos/200/200?random=' + Math.floor(Math.random() * 100),
      ...newProduct as Product
    };

    setProducts([...products, product]);
    setIsAddModalOpen(false);
    setNewProduct({ name: '', price: 0, stock: 0, category: 'عام', sku: '', unit: 'PCS', image: '' });
  };

  const handleUpdateProduct = () => {
      if(!editingProduct) return;
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Unit', 'Total Value'];
    const BOM = "\uFEFF";
    const csvContent = BOM + "sep=,\n" + [
      headers.join(","),
      ...products.map(p => [
          p.id, 
          `"${p.name}"`, 
          p.sku, 
          p.category, 
          p.price, 
          p.stock, 
          p.unit, 
          (p.price * p.stock).toFixed(2)
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `inventory_master_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- API KEY HELPERS ---

  const checkApiKey = async () => {
    try {
      const win = window as any;
      if (win.aistudio && win.aistudio.hasSelectedApiKey) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      } else {
        // Fallback for dev environments without the injected global
        setApiKeySelected(true); 
      }
    } catch (e) {
      console.error("Error checking API key:", e);
    }
  };

  const handleSelectKey = async () => {
    try {
      const win = window as any;
      if (win.aistudio && win.aistudio.openSelectKey) {
        await win.aistudio.openSelectKey();
        checkApiKey();
      }
    } catch (e) {
      setAiError("فشل في فتح نافذة اختيار المفتاح.");
    }
  };

  // --- AI IMAGE GENERATION LOGIC ---

  const openAiModal = (mode: 'NEW' | 'EDIT', currentName: string) => {
    setTargetForm(mode);
    setAiPrompt(currentName || 'Delicious coffee cup with latte art');
    setGeneratedImage(null);
    setAiError('');
    setShowAiModal(true);
    checkApiKey();
  };

  const handleGenerateImage = async () => {
    setAiLoading(true);
    setAiError('');
    setGeneratedImage(null);

    try {
      const win = window as any;
      if (win.aistudio && win.aistudio.hasSelectedApiKey) {
         const hasKey = await win.aistudio.hasSelectedApiKey();
         if (!hasKey) {
            setAiError("الرجاء اختيار مفتاح API للمتابعة.");
            setApiKeySelected(false);
            setAiLoading(false);
            return;
         }
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: aiPrompt }],
        },
        config: {
          imageConfig: {
            imageSize: aiSize,
            aspectRatio: "1:1"
          }
        },
      });

      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64String = part.inlineData.data;
                const imageUrl = `data:image/png;base64,${base64String}`;
                setGeneratedImage(imageUrl);
                foundImage = true;
                break;
            }
          }
      }

      if (!foundImage) {
          setAiError("لم يتم استلام صورة من النموذج. حاول مرة أخرى.");
      }

    } catch (err: any) {
      console.error("AI Generation Error:", err);
      if (err.message && err.message.includes("Requested entity was not found")) {
         setApiKeySelected(false);
         setAiError("المفتاح المختار غير صالح أو غير موجود. يرجى اختيار مفتاح جديد.");
      } else {
         setAiError("حدث خطأ أثناء التوليد: " + (err.message || "Unknown error"));
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleAcceptImage = () => {
    if (!generatedImage) return;

    if (targetForm === 'NEW') {
        setNewProduct({ ...newProduct, image: generatedImage });
    } else {
        setEditingProduct(prev => prev ? { ...prev, image: generatedImage } : null);
    }
    setShowAiModal(false);
  };

  // --- AI THINKING MODE LOGIC ---

  const openThinkingModal = () => {
      setThinkPrompt('');
      setThinkResponse('');
      setAiError('');
      setShowThinkingModal(true);
      checkApiKey();
  };

  const handleDeepThink = async () => {
      if (!thinkPrompt.trim()) return;
      setIsThinking(true);
      setAiError('');
      setThinkResponse('');

      try {
        const win = window as any;
        if (win.aistudio && win.aistudio.hasSelectedApiKey) {
            const hasKey = await win.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                setAiError("الرجاء اختيار مفتاح API للمتابعة.");
                setApiKeySelected(false);
                setIsThinking(false);
                return;
            }
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Using Gemini 3 Pro with Thinking Budget as requested
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: thinkPrompt,
            config: {
                thinkingConfig: { 
                    thinkingBudget: 32768 // Max budget for deep reasoning
                }
                // NOTE: maxOutputTokens must NOT be set when using thinkingBudget logic effectively here
            }
        });

        if (response.text) {
            setThinkResponse(response.text);
        } else {
            setAiError("لم يتم استلام رد نصي من النموذج.");
        }

      } catch (err: any) {
        console.error("Thinking Error:", err);
        setAiError("حدث خطأ أثناء التفكير: " + (err.message || "Unknown error"));
      } finally {
          setIsThinking(false);
      }
  };


  return (
    <div className="p-6 h-full bg-slate-50 overflow-y-auto relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">إدارة المخزون</h1>
          <p className="text-slate-500 text-sm mt-1">تتبع الكميات، التواريخ، وحركات الأصناف</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={openThinkingModal}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white border border-indigo-700 rounded-lg hover:bg-indigo-700 font-bold text-sm shadow-md transition-all animate-pulse hover:animate-none"
          >
            <BrainCircuit size={16} /> المحلل الذكي
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm">
            <Filter size={16} /> تصفية
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm"
          >
            <Download size={16} /> تصدير
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-lg shadow-blue-200"
          >
            <PlusCircle size={16} /> إضافة صنف
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">الصنف</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">SKU</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">التصنيف</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">الوحدة</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">الكمية الحالية</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">الحالة</th>
              <th className="px-6 py-4 font-medium text-slate-500 text-sm">الإجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(product => {
                const status = product.stock < 20 ? 'LOW' : 'GOOD';
                return (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <img src={product.image} className="w-10 h-10 rounded-lg bg-slate-100 object-cover" alt="" />
                            <span className="font-bold text-slate-800">{product.name}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{product.sku}</td>
                    <td className="px-6 py-4 text-slate-600">{product.category}</td>
                    <td className="px-6 py-4 text-slate-600">{product.unit === 'PCS' ? 'قطعة' : 'كرتون'}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{product.stock}</td>
                    <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            status === 'LOW' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                            {status === 'LOW' ? 'منخفض' : 'متوفر'}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => setEditingProduct(product)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
                        >
                            <Edit2 size={14} /> تعديل
                        </button>
                    </td>
                </tr>
                );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-lg">إضافة منتج جديد</h3>
                    <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-red-500"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">اسم المنتج</label>
                        <input 
                            type="text" 
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={newProduct.name}
                            onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                        />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">رابط الصورة (URL)</label>
                         <div className="flex gap-2">
                            <input 
                                type="text" 
                                className="flex-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none text-xs" 
                                value={newProduct.image || ''}
                                onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                                placeholder="https://..."
                            />
                            <button 
                                onClick={() => openAiModal('NEW', newProduct.name || '')}
                                className="bg-purple-100 text-purple-700 px-3 rounded-lg hover:bg-purple-200 flex items-center gap-1 text-xs font-bold whitespace-nowrap"
                                title="توليد صورة بالذكاء الاصطناعي"
                            >
                                <Sparkles size={14} /> AI
                            </button>
                         </div>
                         {newProduct.image && (
                             <img src={newProduct.image} alt="Preview" className="mt-2 w-16 h-16 rounded object-cover border" />
                         )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">السعر (ر.س)</label>
                            <input 
                                type="number" 
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={newProduct.price}
                                onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">الكمية</label>
                            <input 
                                type="number" 
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={newProduct.stock}
                                onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                            <input 
                                type="text" 
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={newProduct.sku}
                                onChange={e => setNewProduct({...newProduct, sku: e.target.value})}
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">الوحدة</label>
                            <select 
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={newProduct.unit}
                                onChange={e => setNewProduct({...newProduct, unit: e.target.value as any})}
                            >
                                <option value="PCS">قطعة</option>
                                <option value="BOX">كرتون</option>
                                <option value="KG">كيلو</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                    <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg">إلغاء</button>
                    <button onClick={handleAddProduct} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">حفظ المنتج</button>
                </div>
            </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-lg">تعديل: {editingProduct.name}</h3>
                    <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-red-500"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">صورة المنتج</label>
                         <div className="flex gap-2 items-center">
                            <img src={editingProduct.image} alt="Current" className="w-12 h-12 rounded object-cover border" />
                            <button 
                                onClick={() => openAiModal('EDIT', editingProduct.name)}
                                className="flex-1 bg-purple-100 text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-200 flex items-center justify-center gap-2 text-sm font-bold"
                            >
                                <Sparkles size={16} /> توليد صورة جديدة (AI)
                            </button>
                         </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">السعر (ر.س)</label>
                            <input 
                                type="number" 
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={editingProduct.price}
                                onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">الكمية الحالية</label>
                            <input 
                                type="number" 
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                                value={editingProduct.stock}
                                onChange={e => setEditingProduct({...editingProduct, stock: Number(e.target.value)})}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                    <button onClick={() => setEditingProduct(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg">إلغاء</button>
                    <button onClick={handleUpdateProduct} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Save size={16} /> حفظ التغييرات
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* AI Image Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-2">
                        <Sparkles size={20} className="text-yellow-300" />
                        <h3 className="font-bold text-lg">توليد صورة بالذكاء الاصطناعي</h3>
                    </div>
                    <button onClick={() => setShowAiModal(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
                </div>

                <div className="p-6">
                    {!apiKeySelected ? (
                        <div className="text-center py-8">
                            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl mb-6 text-sm">
                                تتطلب خدمة توليد الصور (Gemini 3 Pro) حساباً مدفوعاً. يرجى ربط مفتاح API الخاص بك.
                                <br />
                                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline font-bold mt-2 inline-block">معلومات الفوترة</a>
                            </div>
                            <button 
                                onClick={handleSelectKey}
                                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                            >
                                ربط مفتاح API (Select Key)
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">وصف الصورة (Prompt)</label>
                                <textarea 
                                    className="w-full border border-slate-300 rounded-lg p-3 h-24 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                                    placeholder="صف الصورة التي تريد توليدها..."
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">الدقة (Resolution)</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['1K', '2K', '4K'].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setAiSize(size as any)}
                                            className={`py-2 rounded-lg font-bold text-sm border transition-all ${
                                                aiSize === size 
                                                ? 'bg-purple-100 border-purple-500 text-purple-700' 
                                                : 'border-slate-200 text-slate-500 hover:border-purple-300'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {aiError && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                                    <X size={16} className="mt-0.5 shrink-0" />
                                    {aiError}
                                </div>
                            )}

                            {generatedImage ? (
                                <div className="mt-4">
                                    <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-50 aspect-square group">
                                        <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white font-bold">معاينة</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button 
                                            onClick={handleAcceptImage}
                                            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-md"
                                        >
                                            اعتماد الصورة
                                        </button>
                                        <button 
                                            onClick={handleGenerateImage}
                                            className="px-4 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200"
                                        >
                                            توليد أخرى
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={handleGenerateImage}
                                    disabled={aiLoading || !aiPrompt}
                                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                                >
                                    {aiLoading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" /> جاري التوليد...
                                        </>
                                    ) : (
                                        <>
                                            <ImageIcon size={20} /> توليد الصورة
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* AI Thinking Mode Modal (Smart Analyst) */}
      {showThinkingModal && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-4 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center gap-2">
                        <BrainCircuit size={20} className="text-yellow-300" />
                        <h3 className="font-bold text-lg">المحلل الذكي (Thinking Mode)</h3>
                    </div>
                    <button onClick={() => setShowThinkingModal(false)} className="text-white/80 hover:text-white"><X size={20} /></button>
                </div>

                <div className="p-6 flex-1 flex flex-col overflow-hidden">
                    {!apiKeySelected ? (
                        <div className="text-center py-8">
                            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl mb-6 text-sm">
                                تتطلب خدمة التفكير العميق (Gemini 3 Pro) حساباً مدفوعاً. يرجى ربط مفتاح API الخاص بك.
                            </div>
                            <button 
                                onClick={handleSelectKey}
                                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
                            >
                                ربط مفتاح API
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1 overflow-y-auto mb-4 pr-2">
                                {thinkResponse ? (
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                                        {thinkResponse}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                        <BrainCircuit size={64} className="mb-4 opacity-20" />
                                        <p className="text-center">اطرح أسئلة معقدة حول استراتيجيات المخزون، أو اطلب تحليل للبيانات.<br/> سأقوم بالتفكير بعمق قبل الإجابة.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-4 border-t border-slate-100">
                                {aiError && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-3 flex items-start gap-2">
                                        <X size={16} className="mt-0.5 shrink-0" />
                                        {aiError}
                                    </div>
                                )}
                                
                                <div className="flex gap-2">
                                    <textarea 
                                        className="flex-1 border border-slate-300 rounded-lg p-3 h-20 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                        placeholder="اكتب سؤالك هنا... (مثال: كيف يمكنني تقليل هدر المخبوزات مع الحفاظ على التنوع؟)"
                                        value={thinkPrompt}
                                        onChange={(e) => setThinkPrompt(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleDeepThink();
                                            }
                                        }}
                                    />
                                    <button 
                                        onClick={handleDeepThink}
                                        disabled={isThinking || !thinkPrompt.trim()}
                                        className="px-6 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center min-w-[100px]"
                                    >
                                        {isThinking ? (
                                            <>
                                                <Loader2 size={24} className="animate-spin mb-1" />
                                                <span className="text-xs">جاري التفكير...</span>
                                            </>
                                        ) : (
                                            <>
                                                <MessageSquare size={24} className="mb-1" />
                                                <span className="text-xs">إرسال</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Inventory;