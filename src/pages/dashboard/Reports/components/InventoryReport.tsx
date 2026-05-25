import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useFetchInventoryReportQuery } from '../../../../redux/slices/reports.slice';
import InfoTooltip from './InfoTooltip';
import { exportToExcel } from '../utils/exportToExcel';

const StatCard: React.FC<{ label: string; value: string | number; accent?: boolean }> = ({
  label,
  value,
  accent,
}) => (
  <div className='bg-white/[0.04] border border-white/[0.07] rounded-xl p-4'>
    <p className='text-dymAntiPop/40 text-xs uppercase tracking-widest mb-1'>{label}</p>
    <p className={`text-2xl font-bold ${accent ? 'text-orange-400' : 'text-dymAntiPop'}`}>{value}</p>
  </div>
);

const DownloadIcon = () => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3' />
  </svg>
);

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v);

const InventoryReport: React.FC = () => {
  const { data, isLoading, isError } = useFetchInventoryReportQuery();

  const handleExport = () => {
    if (!data) return;
    exportToExcel(
      data.products.map((p) => ({
        Producto: p.name,
        'Precio unitario': p.price,
        'Stock total': p.totalStock,
        'Stock mínimo': p.minStock,
        'Variantes': p.variants,
        'Stock bajo': p.isLowStock ? 'Sí' : 'No',
        'Valor inventario': p.price * p.totalStock,
      })),
      'reporte-inventario',
      'Inventario',
    );
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-64 text-dymAntiPop/40'>
        Cargando reporte...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className='flex items-center justify-center h-64 text-dymAntiPop/40'>
        Error al cargar el reporte.
      </div>
    );
  }

  const top10 = data.products.slice(0, 10);
  const totalInventoryValue = data.products.reduce((s, p) => s + p.price * p.totalStock, 0);

  return (
    <div className='space-y-6'>
      <div className='flex justify-end'>
        <button
          onClick={handleExport}
          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-dymAntiPop/70 hover:text-dymAntiPop hover:bg-white/[0.09] text-sm transition-colors'
        >
          <DownloadIcon /> Exportar Excel
            <InfoTooltip text='Inventario completo: producto, precio unitario, stock actual, stock mínimo, cantidad de variantes y valor total en dinero.' />
        </button>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
        <StatCard label='Productos' value={data.summary.totalProducts} />
        <StatCard label='Unidades en stock' value={data.summary.totalUnits} />
        <StatCard label='Variantes totales' value={data.summary.totalVariants} />
        <StatCard label='Con stock bajo' value={data.summary.lowStockItems} accent={data.summary.lowStockItems > 0} />
      </div>

      <div className='bg-white/[0.03] border border-white/[0.07] rounded-xl p-4'>
        <p className='text-dymAntiPop/60 text-sm font-medium mb-1'>Valor total del inventario</p>
        <p className='text-dymAntiPop text-3xl font-bold'>{formatCurrency(totalInventoryValue)}</p>
      </div>

      {top10.length > 0 && (
        <div className='bg-white/[0.03] border border-white/[0.07] rounded-xl p-4'>
          <p className='text-dymAntiPop/60 text-sm font-medium mb-4'>Top 10 productos por stock</p>
          <ResponsiveContainer width='100%' height={240}>
            <BarChart
              layout='vertical'
              data={top10}
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.06)' horizontal={false} />
              <XAxis
                type='number'
                tick={{ fill: 'rgba(240,223,218,0.4)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type='category'
                dataKey='name'
                tick={{ fill: 'rgba(240,223,218,0.6)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={120}
                tickFormatter={(v: string) => v.length > 16 ? v.slice(0, 16) + '…' : v}
              />
              <Tooltip
                contentStyle={{ background: '#1E1A21', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#F0DFDA' }}
                formatter={(v) => [v ?? 0, 'Unidades']}
              />
              <Bar dataKey='totalStock' radius={[0, 4, 4, 0]}>
                {top10.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.isLowStock ? '#f97316' : '#F26426'}
                    fillOpacity={entry.isLowStock ? 0.5 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className='bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden'>
        <div className='px-4 py-3 border-b border-white/[0.07]'>
          <p className='text-dymAntiPop/60 text-sm font-medium'>Detalle de inventario</p>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-white/[0.07]'>
                <th className='px-4 py-2.5 text-left text-dymAntiPop/40 font-medium text-xs uppercase tracking-wider'>Producto</th>
                <th className='px-4 py-2.5 text-right text-dymAntiPop/40 font-medium text-xs uppercase tracking-wider'>Precio</th>
                <th className='px-4 py-2.5 text-right text-dymAntiPop/40 font-medium text-xs uppercase tracking-wider'>Stock</th>
                <th className='px-4 py-2.5 text-right text-dymAntiPop/40 font-medium text-xs uppercase tracking-wider'>Mín.</th>
                <th className='px-4 py-2.5 text-right text-dymAntiPop/40 font-medium text-xs uppercase tracking-wider'>Variantes</th>
                <th className='px-4 py-2.5 text-right text-dymAntiPop/40 font-medium text-xs uppercase tracking-wider'>Valor</th>
                <th className='px-4 py-2.5 text-center text-dymAntiPop/40 font-medium text-xs uppercase tracking-wider'>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.products.length === 0 ? (
                <tr>
                  <td colSpan={7} className='px-4 py-8 text-center text-dymAntiPop/30 text-sm'>
                    Sin datos de inventario
                  </td>
                </tr>
              ) : (
                data.products.map((product) => (
                  <tr
                    key={product.productId}
                    className='border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors'
                  >
                    <td className='px-4 py-2.5 text-dymAntiPop font-medium'>{product.name}</td>
                    <td className='px-4 py-2.5 text-dymAntiPop/70 text-right'>{formatCurrency(product.price)}</td>
                    <td className='px-4 py-2.5 text-dymAntiPop font-medium text-right'>{product.totalStock}</td>
                    <td className='px-4 py-2.5 text-dymAntiPop/50 text-right'>{product.minStock}</td>
                    <td className='px-4 py-2.5 text-dymAntiPop/50 text-right'>{product.variants}</td>
                    <td className='px-4 py-2.5 text-dymAntiPop/70 text-right'>{formatCurrency(product.price * product.totalStock)}</td>
                    <td className='px-4 py-2.5 text-center'>
                      {product.isLowStock ? (
                        <span className='px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400'>
                          Stock bajo
                        </span>
                      ) : (
                        <span className='px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400'>
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;
