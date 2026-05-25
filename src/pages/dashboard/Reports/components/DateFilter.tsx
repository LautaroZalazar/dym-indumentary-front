import React from 'react';
import { ReportPeriod } from '../../../../redux/slices/reports.slice';

interface DateFilterProps {
  period: ReportPeriod;
  date: string;
  onPeriodChange: (period: ReportPeriod) => void;
  onDateChange: (date: string) => void;
}

const PERIOD_OPTIONS: { value: ReportPeriod; label: string }[] = [
  { value: 'day', label: 'Día' },
  { value: 'month', label: 'Mes' },
  { value: 'year', label: 'Año' },
  { value: 'all', label: 'Histórico' },
];

const DateFilter: React.FC<DateFilterProps> = ({ period, date, onPeriodChange, onDateChange }) => {
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.slice(0, 7);
  const currentYear = today.slice(0, 4);

  const handlePeriodChange = (newPeriod: ReportPeriod) => {
    onPeriodChange(newPeriod);
    if (newPeriod === 'day') onDateChange(today);
    else if (newPeriod === 'month') onDateChange(currentMonth + '-01');
    else if (newPeriod === 'year') onDateChange(currentYear + '-01-01');
    else onDateChange('');
  };

  return (
    <div className='flex flex-wrap items-center gap-3'>
      <div className='flex bg-white/[0.05] rounded-lg p-1 gap-1'>
        {PERIOD_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handlePeriodChange(opt.value)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
              period === opt.value
                ? 'bg-dymOrange text-white shadow'
                : 'text-dymAntiPop/55 hover:text-dymAntiPop hover:bg-white/[0.07]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {period === 'day' && (
        <input
          type='date'
          value={date}
          max={today}
          onChange={(e) => onDateChange(e.target.value)}
          className='bg-white/[0.05] border border-white/[0.1] text-dymAntiPop text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-dymOrange/50 [color-scheme:dark]'
        />
      )}
      {period === 'month' && (
        <input
          type='month'
          value={date.slice(0, 7)}
          max={currentMonth}
          onChange={(e) => onDateChange(e.target.value + '-01')}
          className='bg-white/[0.05] border border-white/[0.1] text-dymAntiPop text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-dymOrange/50 [color-scheme:dark]'
        />
      )}
      {period === 'year' && (
        <input
          type='number'
          value={date.slice(0, 4)}
          min='2020'
          max={currentYear}
          onChange={(e) => onDateChange(e.target.value + '-01-01')}
          className='bg-white/[0.05] border border-white/[0.1] text-dymAntiPop text-sm rounded-lg px-3 py-1.5 w-24 focus:outline-none focus:border-dymOrange/50 [color-scheme:dark]'
        />
      )}
    </div>
  );
};

export default DateFilter;
