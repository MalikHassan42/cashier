import { Product, InventoryAlert, Order, Supplier, PurchaseOrder } from './types';

export const CATEGORIES = [
  'الكل',
  'مشروبات مقطرة',
  'مشروبات الصيف',
  'مشروبات ساخنة',
  'مشروبات باردة',
  'المخبوزات',
  'فطور',
  'الحلا'
];

export const MOCK_PRODUCTS: Product[] = [
  // --- Drip Beverages (مشروبات مقطرة) ---
  {
    id: 'DRIP-001',
    name: 'آيس دريب (Iced Drip)',
    price: 21,
    category: 'مشروبات مقطرة',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    sku: 'DRIP-ICE-01',
    unit: 'PCS'
  },
  {
    id: 'DRIP-002',
    name: 'كيمكس (Chemex)',
    price: 19,
    category: 'مشروبات مقطرة',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1565458318105-0624c96b772d?auto=format&fit=crop&w=800&q=80',
    sku: 'DRIP-CHM-02',
    unit: 'PCS'
  },
  {
    id: 'DRIP-003',
    name: 'كاليتا ويف (Kalita Wave)',
    price: 19,
    category: 'مشروبات مقطرة',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    sku: 'DRIP-KAL-03',
    unit: 'PCS'
  },
  {
    id: 'DRIP-004',
    name: 'قهوة اليوم (Coffee of the day)',
    price: 10,
    category: 'مشروبات مقطرة',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    sku: 'DRIP-COD-04',
    unit: 'PCS'
  },
  {
    id: 'DRIP-005',
    name: 'في 60 (V-60)',
    price: 19,
    category: 'مشروبات مقطرة',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1518832553480-cd0e0452a372?auto=format&fit=crop&w=800&q=80',
    sku: 'DRIP-V60-05',
    unit: 'PCS'
  },
  {
    id: 'DRIP-006',
    name: 'ديكاف (Decafe)',
    price: 19,
    category: 'مشروبات مقطرة',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1556742526-795a8eac090e?auto=format&fit=crop&w=800&q=80',
    sku: 'DRIP-DEC-06',
    unit: 'PCS'
  },
  {
    id: 'DRIP-007',
    name: 'قهوة اليوم باردة (Iced coffee of the day)',
    price: 12,
    category: 'مشروبات مقطرة',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1499961024600-ad094dbc305f?auto=format&fit=crop&w=800&q=80',
    sku: 'DRIP-ICOD-07',
    unit: 'PCS'
  },

  // --- Summer Vibes (مشروبات الصيف) ---
  {
    id: 'SUM-001',
    name: 'بلايا موهيتو توت (Playa Mojito)',
    price: 18,
    category: 'مشروبات الصيف',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=800&q=80',
    sku: 'SUM-PLY-01',
    unit: 'PCS'
  },
  {
    id: 'SUM-002',
    name: 'فيرانو موهيتو بطيخ (Verano Mojito)',
    price: 18,
    category: 'مشروبات الصيف',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    sku: 'SUM-VER-02',
    unit: 'PCS'
  },
  {
    id: 'SUM-003',
    name: 'أولاس موهيتو ليمون ونعناع (Olas Mojito)',
    price: 18,
    category: 'مشروبات الصيف',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1628557044797-2063d9255a00?auto=format&fit=crop&w=800&q=80',
    sku: 'SUM-OLS-03',
    unit: 'PCS'
  },
  {
    id: 'SUM-004',
    name: 'ماربيلا موهيتو خوخ (Marbella Mojito)',
    price: 18,
    category: 'مشروبات الصيف',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    sku: 'SUM-MRB-04',
    unit: 'PCS'
  },
  {
    id: 'SUM-005',
    name: 'آيس تي خوخ (Iced Tea peach)',
    price: 18,
    category: 'مشروبات الصيف',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=800&q=80',
    sku: 'SUM-TEA-05',
    unit: 'PCS'
  },
  {
    id: 'SUM-006',
    name: 'ريد دوز (Red Dose)',
    price: 17,
    category: 'مشروبات الصيف',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80',
    sku: 'SUM-RED-06',
    unit: 'PCS'
  },

  // --- Hot Beverages (مشروبات ساخنة) ---
  {
    id: 'HOT-001',
    name: 'اسبريسو (Espresso)',
    price: 10,
    category: 'مشروبات ساخنة',
    stock: 200,
    image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=800&q=80',
    sku: 'HOT-ESP-01',
    unit: 'PCS'
  },
  {
    id: 'HOT-002',
    name: 'ميكاتو (Macchiato)',
    price: 12,
    category: 'مشروبات ساخنة',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1485808191679-5f8c7c860695?auto=format&fit=crop&w=800&q=80',
    sku: 'HOT-MAC-02',
    unit: 'PCS'
  },
  {
    id: 'HOT-003',
    name: 'امريكانو (Americano)',
    price: 13,
    category: 'مشروبات ساخنة',
    stock: 180,
    image: 'https://images.unsplash.com/photo-1551030173-122f525e675f?auto=format&fit=crop&w=800&q=80',
    sku: 'HOT-AMR-03',
    unit: 'PCS'
  },
  {
    id: 'HOT-004',
    name: 'كورتادو (Cortado)',
    price: 14,
    category: 'مشروبات ساخنة',
    stock: 140,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    sku: 'HOT-COR-04',
    unit: 'PCS'
  },
  {
    id: 'HOT-005',
    name: 'فلات وايت (Flat white)',
    price: 15,
    category: 'مشروبات ساخنة',
    stock: 160,
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=800&q=80',
    sku: 'HOT-FLT-05',
    unit: 'PCS'
  },
  {
    id: 'HOT-006',
    name: 'كابتشينو (Cappuccino)',
    price: 17,
    category: 'مشروبات ساخنة',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
    sku: 'HOT-CAP-06',
    unit: 'PCS'
  },
  {
    id: 'HOT-007',
    name: 'لاتيه (Latte)',
    price: 18,
    category: 'مشروبات ساخنة',
    stock: 170,
    image: 'https://images.unsplash.com/photo-1541167760-4977a417531d?auto=format&fit=crop&w=800&q=80',
    sku: 'HOT-LAT-07',
    unit: 'PCS'
  },
  {
    id: 'HOT-008',
    name: 'موكا (Mocha)',
    price: 20,
    category: 'مشروبات ساخنة',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=800&q=80',
    sku: 'HOT-MOC-08',
    unit: 'PCS'
  },
  {
    id: 'HOT-009',
    name: 'سبانش لاتيه (Spanish Latte)',
    price: 20,
    category: 'مشروبات ساخنة',
    stock: 130,
    image: 'https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?auto=format&fit=crop&w=800&q=80',
    sku: 'HOT-SPN-09',
    unit: 'PCS'
  },
  {
    id: 'HOT-010',
    name: 'أوروز الخاصة (Oros Special)',
    price: 21,
    category: 'مشروبات ساخنة',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1621538965620-8339594d2165?auto=format&fit=crop&w=800&q=80',
    sku: 'HOT-ORO-10',
    unit: 'PCS'
  },
  {
    id: 'HOT-011',
    name: 'شاي (Tea)',
    price: 4,
    category: 'مشروبات ساخنة',
    stock: 300,
    image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?auto=format&fit=crop&w=800&q=80',
    sku: 'HOT-TEA-11',
    unit: 'PCS'
  },
  {
    id: 'HOT-012',
    name: 'شاي المختص (Specialty tea)',
    price: 12,
    category: 'مشروبات ساخنة',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    sku: 'HOT-SPT-12',
    unit: 'PCS'
  },
  {
    id: 'HOT-013',
    name: 'هوت شوكلت (Hot chocolate)',
    price: 22,
    category: 'مشروبات ساخنة',
    stock: 90,
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80',
    sku: 'HOT-CHO-13',
    unit: 'PCS'
  },

  // --- Cold Beverages (مشروبات باردة) ---
  {
    id: 'COLD-001',
    name: 'أوروز الخاصة (Oros Special)',
    price: 21,
    category: 'مشروبات باردة',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    sku: 'COLD-ORO-01',
    unit: 'PCS'
  },
  {
    id: 'COLD-002',
    name: 'ايسد امريكانو (Iced Americano)',
    price: 13,
    category: 'مشروبات باردة',
    stock: 150,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b5c7355c?auto=format&fit=crop&w=800&q=80',
    sku: 'COLD-AMR-02',
    unit: 'PCS'
  },
  {
    id: 'COLD-003',
    name: 'كولد برو (Cold Brew)',
    price: 20,
    category: 'مشروبات باردة',
    stock: 80,
    image: 'https://images.unsplash.com/photo-1625860638524-71bc56311b08?auto=format&fit=crop&w=800&q=80',
    sku: 'COLD-BRW-03',
    unit: 'PCS'
  },
  {
    id: 'COLD-004',
    name: 'ايسد لاتيه (Iced Latte)',
    price: 18,
    category: 'مشروبات باردة',
    stock: 140,
    image: 'https://images.unsplash.com/photo-1553909489-cd47e3321179?auto=format&fit=crop&w=800&q=80',
    sku: 'COLD-LAT-04',
    unit: 'PCS'
  },
  {
    id: 'COLD-005',
    name: 'سبانش لاتيه (Spanish Latte)',
    price: 20,
    category: 'مشروبات باردة',
    stock: 120,
    image: 'https://images.unsplash.com/photo-1642648431358-154d89a66d0a?auto=format&fit=crop&w=800&q=80',
    sku: 'COLD-SPN-05',
    unit: 'PCS'
  },
  {
    id: 'COLD-006',
    name: 'ايسد وايت موكا (Iced White Mocha)',
    price: 20,
    category: 'مشروبات باردة',
    stock: 110,
    image: 'https://images.unsplash.com/photo-1570968992194-79569335b71b?auto=format&fit=crop&w=800&q=80',
    sku: 'COLD-WMO-06',
    unit: 'PCS'
  },
  {
    id: 'COLD-007',
    name: 'ايسد موكا (Iced Mocha)',
    price: 20,
    category: 'مشروبات باردة',
    stock: 110,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
    sku: 'COLD-MOC-07',
    unit: 'PCS'
  },
  {
    id: 'COLD-008',
    name: 'اسبريسو فريدو (Espresso fredo)',
    price: 12,
    category: 'مشروبات باردة',
    stock: 90,
    image: 'https://images.unsplash.com/photo-1620052309787-8495c02dd589?auto=format&fit=crop&w=800&q=80',
    sku: 'COLD-FRD-08',
    unit: 'PCS'
  },
  {
    id: 'COLD-009',
    name: 'كابتشينو فريدو (Cappuccino fredo)',
    price: 15,
    category: 'مشروبات باردة',
    stock: 90,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80',
    sku: 'COLD-CFR-09',
    unit: 'PCS'
  },
  {
    id: 'COLD-010',
    name: 'تونك اسبريسو (Tonic espresso)',
    price: 15,
    category: 'مشروبات باردة',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1634629377227-6f6eb13b3846?auto=format&fit=crop&w=800&q=80',
    sku: 'COLD-TON-10',
    unit: 'PCS'
  },

  // --- Bakery (المخبوزات) ---
  {
    id: 'BAK-001',
    name: 'شوكلت بابكا (Chocolate Babka)',
    price: 14,
    category: 'المخبوزات',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1605255476332-26197177651a?auto=format&fit=crop&w=800&q=80',
    sku: 'BAK-BBK-01',
    unit: 'PCS'
  },
  {
    id: 'BAK-002',
    name: 'كيكة السينامون (Swedish cinnamon buns)',
    price: 12,
    category: 'المخبوزات',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1606101272023-e18985c54d39?auto=format&fit=crop&w=800&q=80',
    sku: 'BAK-CIN-02',
    unit: 'PCS'
  },
  {
    id: 'BAK-003',
    name: 'فطيرة التفاح (Apple pie)',
    price: 18,
    category: 'المخبوزات',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=800&q=80',
    sku: 'BAK-APL-03',
    unit: 'PCS'
  },
  {
    id: 'BAK-004',
    name: 'بنانا بريد (Banana Bread)',
    price: 13,
    category: 'المخبوزات',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1589146977799-a3674685375c?auto=format&fit=crop&w=800&q=80',
    sku: 'BAK-BAN-04',
    unit: 'PCS'
  },

  // --- Breakfast (فطور) ---
  {
    id: 'BRK-001',
    name: 'كروسون زعتر (Thyme croissant)',
    price: 10,
    category: 'فطور',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    sku: 'BRK-THY-01',
    unit: 'PCS'
  },
  {
    id: 'BRK-002',
    name: 'كروسون جبنة (Cheese croissant)',
    price: 12,
    category: 'فطور',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    sku: 'BRK-CHS-02',
    unit: 'PCS'
  },

  // --- Dessert (الحلا) ---
  {
    id: 'DST-001',
    name: 'أوروز كوكيز (Oros Cookies)',
    price: 10,
    category: 'الحلا',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee469b16d?auto=format&fit=crop&w=800&q=80',
    sku: 'DST-COO-01',
    unit: 'PCS'
  },
  {
    id: 'DST-002',
    name: 'سان سباستيان تشيز كيك (San Sebastian cheesecake)',
    price: 18,
    category: 'الحلا',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
    sku: 'DST-SAN-02',
    unit: 'PCS'
  },
  {
    id: 'DST-003',
    name: 'كب كيك جزر (Carrot cupcake)',
    price: 9,
    category: 'الحلا',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=800&q=80',
    sku: 'DST-CAR-03',
    unit: 'PCS'
  },
  {
    id: 'DST-004',
    name: 'براوني كيك (Brownie cake)',
    price: 17,
    category: 'الحلا',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    sku: 'DST-BRW-04',
    unit: 'PCS'
  },
  {
    id: 'DST-005',
    name: 'دونات نوتيلا (Nutella donut)',
    price: 12,
    category: 'الحلا',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1551024601-564d6d6744f1?auto=format&fit=crop&w=800&q=80',
    sku: 'DST-NUT-05',
    unit: 'PCS'
  },
  {
    id: 'DST-006',
    name: 'دونات نوتيلا وزعتر (Nutella and thyme donut)',
    price: 12,
    category: 'الحلا',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1527515545081-5db817172677?auto=format&fit=crop&w=800&q=80',
    sku: 'DST-NTH-06',
    unit: 'PCS'
  }
];

export const MOCK_ALERTS: InventoryAlert[] = [
  {
    id: 'a1',
    productId: 'DST-002',
    productName: 'سان سباستيان تشيز كيك',
    type: 'LOW_STOCK',
    message: 'الكمية المتبقية 20 فقط.',
    severity: 'HIGH'
  },
  {
    id: 'a2',
    productId: 'HOT-001',
    productName: 'اسبريسو',
    type: 'DEAD_STOCK',
    message: 'مخزون وافر، حركة عادية.',
    severity: 'LOW'
  }
];

export const DELIVERY_APPS = [
  { id: 'HUNGERSTATION', name: 'هنقرستيشن', color: 'bg-yellow-400 text-black' },
  { id: 'JAHEZ', name: 'جاهز', color: 'bg-red-600 text-white' },
  { id: 'MRSOOL', name: 'مرسول', color: 'bg-green-700 text-white' },
  { id: 'TOYOU', name: 'تويو', color: 'bg-purple-600 text-white' },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    date: '2023-12-17 10:30',
    total: 39.00,
    subtotal: 33.91,
    tax: 5.09,
    status: 'COMPLETED',
    paymentMethod: 'CASH',
    deliveryProvider: 'NONE',
    items: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[8]] as any // Iced Drip + Spanish Latte
  },
  {
    id: 'ORD-1002',
    date: '2023-12-17 11:15',
    total: 62.00,
    subtotal: 53.91,
    tax: 8.09,
    status: 'COMPLETED',
    paymentMethod: 'DELIVERY_APP',
    deliveryProvider: 'HUNGERSTATION',
    orderRefId: 'HS-99283',
    items: [MOCK_PRODUCTS[22], MOCK_PRODUCTS[22], MOCK_PRODUCTS[32]] as any // Babka x2 + Brownie
  }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'محمصة البن المختص',
    contactPerson: 'عبدالله',
    phone: '0500000001',
    email: 'abdullah@roastery.com',
    balance: 0
  },
  {
    id: 'SUP-002',
    name: 'مورد الحلويات الفاخرة',
    contactPerson: 'خالد علي',
    phone: '0500000002',
    email: 'sales@sweets.sa',
    balance: 1500
  },
  {
    id: 'SUP-003',
    name: 'خدمات التموين',
    contactPerson: 'سارة',
    phone: '0500000003',
    email: 'sara@supplies.com',
    balance: 5000
  }
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'PO-2023-001',
    supplierId: 'SUP-001',
    supplierName: 'محمصة البن المختص',
    date: '2023-12-10',
    expectedDate: '2023-12-12',
    status: 'RECEIVED',
    totalCost: 2500,
    itemsCount: 50
  },
  {
    id: 'PO-2023-002',
    supplierId: 'SUP-003',
    supplierName: 'خدمات التموين',
    date: '2023-12-16',
    expectedDate: '2023-12-18',
    status: 'ORDERED',
    totalCost: 1200,
    itemsCount: 100
  },
  {
    id: 'PO-2023-003',
    supplierId: 'SUP-002',
    supplierName: 'مورد الحلويات الفاخرة',
    date: '2023-12-17',
    expectedDate: '2023-12-20',
    status: 'DRAFT',
    totalCost: 3400,
    itemsCount: 15
  }
];