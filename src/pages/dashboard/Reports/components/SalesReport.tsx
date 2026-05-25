import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useFetchSalesReportQuery, ReportPeriod } from '../../../../redux/slices/reports.slice';
import DateFilter from './DateFilter';
import InfoTooltip from './InfoTooltip';
import { exportToExcel } from '../utils/exportToExcel';

const StatCard: React.FC<{ label: string; value: string | number; sub?: string }> = ({
  label,
  value,
  sub,
}) => (
  <div className='bg-white/[0.04] border border-white/[0.07] rounded-xl p-4'>
    <p className='text-dymAntiPop/40 text-xs uppercase tracking-widest mb-1'>{label}</p>
    <p className='text-dymAntiPop text-2xl font-bold'>{value}</p>
    {sub && <p className='text-dymAntiPop/40 text-xs mt-0.5'>{sub}</p>}
  </div>
);

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v);

const DownloadIcon = () => (
  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3' />
  </svg>
);

const SalesReport: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const [date, setDate] = useState(today.slice(0, 7) + '-01');

  const { data, isLoading, isError } = useFetchSalesReportQuery({ period, date });

  const handleExportSummary = () => {
    if (!data) return;
    exportToExcel(
      [
        {
          'Ingresos totales': data.summary.totalRevenue,
          'Cantidad de órdenes': data.summary.orderCount,
          'Valor promedio': data.summary.avgOrderValue,
          'Órdenes completadas': data.summary.completedOrders,
          'Órdenes canceladas': data.summary.cancelledOrders,
        },
      ],
      'reporte-ventas-resumen',
      'Resumen',
    );
  };

  const handleExportOrders = () => {
    if (!data) return;
    exportToExcel(
      data.orders.map((o) => ({
        'N° Venta': o.orderNumber ?? '-',
        ID: o._id,
        Total: o.total,
        Estado: o.status,
        Fecha: new Date(o.createdAt).toLocaleString('es-AR'),
      })),
      'reporte-ventas-ordenes',
      'Órdenes',
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

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <DateFilter period={period} date={date} onPeriodChange={setPeriod} onDateChange={setDate} />
        <div className='flex gap-2'>
          <button
            onClick={handleExportSummary}
            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-dymAntiPop/70 hover:text-dymAntiPop hover:bg-white/[0.09] text-sm transition-colors'
          >
            <DownloadIcon /> Resumen Excel
            <InfoTooltip text='Una fila con el resumen del período: ingresos totales, cantidad de órdenes, valor promedio, completadas y canceladas.' />
          </button>
          <button
            onClick={handleExportOrders}
            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-dymAntiPop/70 hover:text-dymAntiPop hover:bg-white/[0.09] text-sm transition-colors'
          >
            <DownloadIcon /> Órdenes Excel
            <InfoTooltip text='Detalle de las últimas 100 órdenes del período: ID, total, estado (completada/cancelada) y fecha.' />
          </button>
        </div>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
        <StatCard label='Ingresos totales' value={formatCurrency(data.summary.totalRevenue)} />
        <StatCard label='Total órdenes' value={data.summary.orderCount} />
        <StatCard label='Valor promedio' value={formatCurrency(data.summary.avgOrderValue)} />
        <StatCard
          label='Completadas / Canceladas'
          value={`${data.summary.completedOrders} / ${data.summary.cancelledOrders}`}
        />
      </div>

      {data.chart.length > 0 && (
        <div className='bg-white/[0.03] border border-white/[0.07] rounded-xl p-4'>
          <p className='text-dymAntiPop/60 text-sm font-medium mb-4'>Ingresos por período</p>
          <ResponsiveContainer width='100%' height={220}>
            <BarChart data={data.chart} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.06)' />
              <XAxis
                dataKey='label'
                tick={{ fill: 'rgba(240,223,218,0.4)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(240,223,218,0.4)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ background: '#1E1A21', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#F0DFDA' }}
                formatter={(v) => [formatCurrency(Number(v ?? 0)), 'Ingresos']}
              />
              <Bar dataKey='revenue' fill='#F26426' radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {data.chart.length > 0 && (
        <div className='bg-white/[0.03] border border-white/[0.07] rounded-xl p-4'>
          <p className='text-dymAntiPop/60 text-sm font-medium mb-4'>Cantidad de órdenes</p>
          <ResponsiveContainer width='100%' height={180}>
            <LineChart data={data.chart} margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='rgba(255,255,255,0.06)' />
              <XAxis
                dataKey='label'
                tick={{ fill: 'rgba(240,223,218,0.4)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(240,223,218,0.4)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ background: '#1E1A21', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                labelStyle={{ color: '#F0DFDA' }}
                formatter={(v) => [v ?? 0, 'Órdenes']}
              />
              <Line
                type='monotone'
                dataKey='orders'
                stroke='#F26426'
                strokeWidth={2}
                dot={{ fill: '#F26426', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className='bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden'>
        <div className='px-4 py-3 border-b border-white/[0.07]'>
          <p className='text-dymAntiPop/60 text-sm font-medium'>Últimas órdenes</p>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-white/[0.07]'>
                <th className='px-4 py-2.5 text-left text-dymAntiPop/40 font-medium text-xs uppercase tracking-wider'>N° Venta</th>
                <th className='px-4 py-2.5 text-left text-dymAntiPop/40 font-medium text-xs uppercase tracking-wider'>Total</th>
                <th className='px-4 py-2.5 text-left text-dymAntiPop/40 font-medium text-xs uppercase tracking-wider'>Estado</th>
                <th className='px-4 py-2.5 text-left text-dymAntiPop/40 font-medium text-xs uppercase tracking-wider'>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {data.orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className='px-4 py-8 text-center text-dymAntiPop/30 text-sm'>
                    Sin órdenes en el período seleccionado
                  </td>
                </tr>
              ) : (
                data.orders.slice(0, 20).map((order) => (
                  <tr key={order._id} className='border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors'>
                    <td className='px-4 py-2.5 font-mono text-sm'>
                      {order.orderNumber
                        ? <span className='text-dymAntiPop font-semibold'>#{order.orderNumber}</span>
                        : <span className='text-dymAntiPop/30 text-xs'>{order._id?.slice(-8)}</span>
                      }
                    </td>
                    <td className='px-4 py-2.5 text-dymAntiPop font-medium'>{formatCurrency(order.total)}</td>
                    <td className='px-4 py-2.5'>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'completed'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {order.status === 'completed' ? 'Completada' : 'Cancelada'}
                      </span>
                    </td>
                    <td className='px-4 py-2.5 text-dymAntiPop/50 text-xs'>
                      {new Date(order.createdAt).toLocaleString('es-AR', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
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

export default SalesReport;
