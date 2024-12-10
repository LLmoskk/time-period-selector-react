import { useState } from 'react';
import './index.css';

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
  style?: React.CSSProperties;
  title?: string;
  language?: 'zh' | 'en';
  showTime?: boolean;
  value?: Time;
  onChange?: (value: Time) => void;
}

export function TimePeriodSelector(props: TimePeriodSelectorProps) {
  const { style, title, language = 'en', showTime, value, onChange } = props;
  const weekDayDisplay =
    language === 'en' ? weekDayDisplayEn : weekDayDisplayZh;

  const [selectedSlots, setSelectedSlots] = useState<Time>(
    value || {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: [],
    }
  );
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{
    day: WeekDay;
    hour: number;
  } | null>(null);

  const handleClick = (day: WeekDay, hour: number) => {
    if (isSelecting) return;

    const newSelectedSlots = { ...selectedSlots };
    const currentHours = selectedSlots[day];

    if (currentHours.includes(hour)) {
      newSelectedSlots[day] = currentHours.filter((h) => h !== hour);
    } else {
      newSelectedSlots[day] = [...currentHours, hour].sort((a, b) => a - b);
    }

    setSelectedSlots(newSelectedSlots);
    onChange?.(newSelectedSlots);
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

    const newSelectedSlots = {
      ...selectedSlots,
      [day]: Array.from(new Set([...selectedSlots[day], ...hours])).sort(
        (a, b) => a - b
      ),
    };

    setSelectedSlots(newSelectedSlots);
    onChange?.(newSelectedSlots);
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
    const emptySlots: Time = {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: [],
    };
    setSelectedSlots(emptySlots);
    onChange?.(emptySlots);
  };
  
  return (
    <div className='time-period-selector' style={style}>
      <div className='time-period-header'>
        <h3 className='time-period-title'>{title}</h3>
        <a onClick={handleClear} className='clear-button'>
          {language === 'zh' ? '清空' : 'Clear'}
        </a>
      </div>

      <table className='time-period-table'>
        <thead className='time-period-thead'>
          <tr>
            <th rowSpan={2} className='time-period-th'>
              {language === 'zh' ? '日期/时间' : 'Date/Time'}
            </th>
            <th colSpan={12} className='time-period-th'>
              00:00~12:00
            </th>
            <th colSpan={12} className='time-period-th'>
              12:00~24:00
            </th>
          </tr>
          <tr>
            {Array.from({ length: 24 }).map((_, i) => (
              <th key={i} className='time-period-hour-th'>
                {i}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weekDays.map((day) => (
            <tr key={day}>
              <td className='time-period-day'>{weekDayDisplay[day]}</td>
              {Array.from({ length: 24 }).map((_, hourIndex) => (
                <td
                  key={hourIndex}
                  className={`time-period-hour ${
                    selectedSlots[day].includes(hourIndex) ? 'selected' : ''
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
          <div className='time-period-divider' />

          <div className='time-period-selected-times'>
            {language === 'zh' ? '已选择时间:' : 'Selected Times:'}
          </div>
          <pre className='time-period-selected-times-text'>
            {formatSelectedTimes()}
          </pre>
        </>
      )}
    </div>
  );
}
