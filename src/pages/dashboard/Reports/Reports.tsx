import React, { useState } from 'react';
import SalesReport from './components/SalesReport';
import InventoryReport from './components/InventoryReport';
import TopProductsReport from './components/TopProductsReport';

const TABS = [
  {
    id: 'sales',
    label: 'Ventas',
    icon: (
      <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <polyline points='22 12 18 12 15 21 9 3 6 12 2 12' />
      </svg>
    ),
  },
  {
    id: 'inventory',
    label: 'Inventario',
    icon: (
      <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <path d='M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' />
      </svg>
    ),
  },
  {
    id: 'top-products',
    label: 'Más vendidos',
    icon: (
      <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
        <polyline points='23 6 13.5 15.5 8.5 10.5 1 18' />
        <polyline points='17 6 23 6 23 12' />
      </svg>
    ),
  },
] as const;

type TabId = (typeof TABS)[number]['id'];

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('sales');

  return (
    <div className='p-6 space-y-6'>
      <div>
        <h1 className='text-dymAntiPop text-xl font-bold'>Reportería</h1>
        <p className='text-dymAntiPop/40 text-sm mt-0.5'>
          Análisis de ventas, inventario y productos más vendidos
        </p>
      </div>

      <div className='flex border-b border-white/[0.07]'>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-150 border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-dymOrange text-dymOrange'
                : 'border-transparent text-dymAntiPop/40 hover:text-dymAntiPop/70 hover:border-white/[0.15]'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'sales' && <SalesReport />}
        {activeTab === 'inventory' && <InventoryReport />}
        {activeTab === 'top-products' && <TopProductsReport />}
      </div>
    </div>
  );
};

export default Reports;
