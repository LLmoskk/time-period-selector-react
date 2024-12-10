import { useState } from 'react';
import './index.css';
import { cn } from './utils';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
type WeekDay = (typeof weekDays)[number];

const weekDayDisplayZh: Record<WeekDay, string> = {
  Mon: '周一',
  Tue: '周二',
  Wed: '周三',
  Thu: '周四',
  Fri: '周五',
  Sat: '周六',
  Sun: '周日',
};

const weekDayDisplayEn: Record<WeekDay, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

export type Time = Record<WeekDay, number[]>;

export interface TimePeriodSelectorProps {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  language?: 'zh' | 'en';
  showTime?: boolean;
}

export function TimePeriodSelector(props: TimePeriodSelectorProps) {
  const { className, style, title, language = 'en', showTime } = props;
  const weekDayDisplay =
    language === 'en' ? weekDayDisplayEn : weekDayDisplayZh;

  const [selectedSlots, setSelectedSlots] = useState<Time>({
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{
    day: WeekDay;
    hour: number;
  } | null>(null);

  const handleClick = (day: WeekDay, hour: number) => {
    if (isSelecting) return;

    setSelectedSlots((prev) => {
      const currentHours = prev[day];
      if (currentHours.includes(hour)) {
        return {
          ...prev,
          [day]: currentHours.filter((h) => h !== hour),
        };
      } else {
        return {
          ...prev,
          [day]: [...currentHours, hour].sort((a, b) => a - b),
        };
      }
    });
  };

  const handleMouseDown = (day: WeekDay, hour: number) => {
    setIsSelecting(true);
    setSelectionStart({ day, hour });
  };

  const handleMouseEnter = (day: WeekDay, hour: number) => {
    if (!isSelecting || !selectionStart || selectionStart.day !== day) return;

    const minHour = Math.min(selectionStart.hour, hour);
    const maxHour = Math.max(selectionStart.hour, hour);
    const hours = Array.from(
      { length: maxHour - minHour + 1 },
      (_, i) => minHour + i
    );

    setSelectedSlots((prev) => ({
      ...prev,
      [day]: Array.from(new Set([...prev[day], ...hours])).sort(
        (a, b) => a - b
      ),
    }));
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setSelectionStart(null);
  };

  const formatSelectedTimes = () => {
    return Object.entries(selectedSlots)
      .filter(([, hours]) => hours.length > 0)
      .map(([day, hours]) => {
        const timeRanges: [number, number][] = [];
        let start = hours[0];
        let prev = hours[0];

        for (let i = 1; i <= hours.length; i++) {
          if (i === hours.length || hours[i] !== prev + 1) {
            timeRanges.push([start, prev + 1]);
            if (i < hours.length) {
              start = hours[i];
              prev = hours[i];
            }
          } else {
            prev = hours[i];
          }
        }

        const formattedHours = timeRanges
          .map(
            ([start, end]) =>
              `${String(start).padStart(2, '0')}:00~${String(end).padStart(
                2,
                '0'
              )}:00`
          )
          .join('、');

        return `${weekDayDisplay[day as WeekDay]} ${formattedHours}`;
      })
      .join('\n');
  };

  const handleClear = () => {
    setSelectedSlots({
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: [],
    });
  };
  return (
    <div
      className={cn(
        'w-[520px] border border-gray-200 bg-white p-5 md:w-[700px]',
        className
      )}
      style={style}
    >
      <div className='mb-5 flex items-center justify-between'>
        <h3 className='m-0'>{title}</h3>
        <a
          onClick={handleClear}
          className='cursor-pointer text-blue-500 hover:text-blue-600'
        >
          {language === 'zh' ? '清空' : 'Clear'}
        </a>
      </div>

      <table className='w-full border'>
        <thead className='border-b'>
          <tr>
            <th
              rowSpan={2}
              className='border p-1 text-center text-xs font-normal'
            >
              {language === 'zh' ? '日期/时间' : 'Date/Time'}
            </th>
            <th
              colSpan={12}
              className='border p-1 text-center text-xs font-normal'
            >
              00:00~12:00
            </th>
            <th
              colSpan={12}
              className='border p-1 text-center text-xs font-normal'
            >
              12:00~24:00
            </th>
          </tr>
          <tr>
            {Array.from({ length: 24 }).map((_, i) => (
              <th key={i} className='p-1 text-center text-xs font-normal'>
                {i}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weekDays.map((day) => (
            <tr key={day}>
              <td className='h-8 w-14 border-b text-xs text-center'>
                {weekDayDisplay[day]}
              </td>
              {Array.from({ length: 24 }).map((_, hourIndex) => (
                <td
                  key={hourIndex}
                  className={`h-[30px] w-[20px] cursor-pointer border border-gray-200 transition-colors ${
                    selectedSlots[day].includes(hourIndex)
                      ? 'bg-blue-500 hover:bg-blue-500'
                      : 'bg-white hover:bg-blue-50'
                  }`}
                  onMouseDown={() => handleMouseDown(day, hourIndex)}
                  onMouseEnter={() => handleMouseEnter(day, hourIndex)}
                  onMouseUp={handleMouseUp}
                  onClick={() => handleClick(day, hourIndex)}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {showTime && (
        <>
          <div className='mb-5 mt-5 border-b border-gray-200' />

          <div className='mb-2'>
            {language === 'zh' ? '已选择时间:' : 'Selected Times:'}
          </div>
          <pre className='whitespace-pre-wrap text-xs '>
            {formatSelectedTimes()}
          </pre>
        </>
      )}
    </div>
  );
}
