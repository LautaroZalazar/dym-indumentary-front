import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useFetchTopProductsReportQuery, ReportPeriod } from '../../../../redux/slices/reports.slice';
import DateFilter from './DateFilter';
import InfoTooltip from './InfoTooltip';
import { exportToExcel } from '../utils/exportToExcel';

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className='bg-white/[0.04] border border-white/[0.07] rounded-xl p-4'>
    <p className='text-dymAntiPop/40 text-xs uppercase tracking-widest mb-1'>{label}</p>
    <p className='text-dymAntiPop text-2xl font-bold'>{value}</p>
  </div>
);

const DownloadIcon = () => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3' />
  </svg>
);

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v);

const PIE_COLORS = ['#F26426', '#e05520', '#c94a1a', '#b33f15', '#9d3410', '#86290b'];

const TopProductsReport: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const [date, setDate] = useState(today.slice(0, 7) + '-01');

  const { data, isLoading, isError } = useFetchTopProductsReportQuery({ period, date });

  const handleExport = () => {
    if (!data) return;
    exportToExcel(
      data.products.map((p, i) => ({
        Posición: i + 1,
        Producto: p.name,
        'Unidades vendidas': p.unitsSold,
        'Ingresos generados': p.revenue,
      })),
      'reporte-productos-mas-vendidos',
      'Top Productos',
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

  const top5Pie = data.products.slice(0, 6).map((p) => ({
    name: p.name.length > 20 ? p.name.slice(0, 20) + '…' : p.name,
    value: p.revenue,
  }));

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <DateFilter period={period} date={date} onPeriodChange={setPeriod} onDateChange={setDate} />
        <button
          onClick={handleExport}
          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-dymAntiPop/70 hover:text-dymAntiPop hover:bg-white/[0.09] text-sm transition-colors'
        >
          <DownloadIcon /> Exportar Excel
            <InfoTooltip text='Ranking de productos con posición, nombre, unidades vendidas e ingresos generados en el período.' />
        </button>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <StatCard label='Unidades vendidas' value={data.summary.totalUnitsSold} />
        <StatCard label='Ingresos generados' value={formatCurrency(data.summary.totalRevenue)} />
      </div>

      {data.products.length === 0 ? (
        <div className='bg-white/[0.03] border border-white/[0.07] rounded-xl p-12 text-center text-dymAntiPop/30 text-sm'>
          Sin ventas en el período seleccionado
        </div>
      ) : (
        <>
          <div className='grid lg:grid-cols-2 gap-4'>
            <div className='bg-white/[0.03] border border-white/[0.07] rounded-xl p-4'>
              <p className='text-dymAntiPop/60 text-sm font-medium mb-4'>Unidades vendidas por producto</p>
              <ResponsiveContainer width='100%' height={240}>
                <BarChart
                  layout='vertical'
                  data={data.products.slice(0, 10)}
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.06)' horizontal={false} />
                  <XAxis
                    type='number'
                    tick={{ fill: 'rgba(240,223,218,0.4)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
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
                  <Bar dataKey='unitsSold' fill='#F26426' radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {top5Pie.length > 0 && (
              <div className='bg-white/[0.03] border border-white/[0.07] rounded-xl p-4'>
                <p className='text-dymAntiPop/60 text-sm font-medium mb-4'>Distribución de ingresos</p>
                <ResponsiveContainer width='100%' height={240}>
                  <PieChart>
                    <Pie
                      data={top5Pie}
                      cx='50%'
                      cy='50%'
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey='value'
                    >
                      {top5Pie.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1E1A21', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                      formatter={(v) => [formatCurrency(Number(v ?? 0)), 'Ingresos']}
                    />
                    <Legend
                      iconType='circle'
                      iconSize={8}
                      formatter={(value) => (
                        <span style={{ color: 'rgba(240,223,218,0.6)', fontSize: 11 }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className='bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden'>
            <div className='px-4 py-3 border-b border-white/[0.07]'>
              <p className='text-dymAntiPop/60 text-sm font-medium'>Ranking de productos</p>
            </div>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-white/[0.07]'>
                    <th className='px-4 py-2.5 text-left text-dymAntiPop/40 font-medium text-xs uppercase tracking-wider w-10'>#</th>
                    <th className='px-4 py-2.5 text-left text-dymAntiPop/40 font-medium text-xs uppercase tracking-wider'>Producto</th>
                    <th className='px-4 py-2.5 text-right text-dymAntiPop/40 font-medium text-xs uppercase tracking-wider'>Unidades</th>
                    <th className='px-4 py-2.5 text-right text-dymAntiPop/40 font-medium text-xs uppercase tracking-wider'>Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map((product, i) => (
                    <tr
                      key={product.productId}
                      className='border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors'
                    >
                      <td className='px-4 py-2.5'>
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                          i === 0 ? 'bg-yellow-500/20 text-yellow-400'
                          : i === 1 ? 'bg-gray-400/20 text-gray-300'
                          : i === 2 ? 'bg-orange-700/20 text-orange-500'
                          : 'text-dymAntiPop/30'
                        }`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className='px-4 py-2.5 text-dymAntiPop font-medium'>{product.name}</td>
                      <td className='px-4 py-2.5 text-dymAntiPop font-medium text-right'>{product.unitsSold}</td>
                      <td className='px-4 py-2.5 text-dymAntiPop/70 text-right'>{formatCurrency(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TopProductsReport;
