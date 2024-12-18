# TimePeriodSelector - Drag to Select Time Period of the Day

`TimePeriodSelector` is a React component that allows users to select time periods for a specific day by dragging. It supports both Chinese and English languages and allows customization of styles.

![20241210114758_rec_](https://github.com/user-attachments/assets/08f6ee87-1c07-4344-ac36-d412902a1939)


## Installation

Install the component via npm:

```bash
npm install time-period-selector-react
```

## Usage

```jsx
import { TimePeriodSelector, Time} from 'time-period-selector-react';

const MyComponent = () => {

  const [selectedTime, setSelectedTime] = useState<Time>({
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  });

  return (
    <div>
      <TimePeriodSelector
        title='Select Time Period'
        language='en'
        showTime
        style={{ margin: '200px auto' }}
        value={selectedTime}
        onChange={setSelectedTime}
      />
    </div>
  );
};
```

## Props

| Name      | Type                | Description                     |
| --------- | ------------------- | ------------------------------- |
| style     | React.CSSProperties | The style of the component      |
| value     | Time                | The selected time periods        |
| onChange  | (value: Time) => void | The callback function           |
| title     | string              | The title of the component      |
| language  | 'zh','en'           | The language of the component   |
| showTime  | boolean             | Whether to show time            |

## Component Features

- Drag and drop to select time periods for a specific day
- Support both Chinese and English languages
- Customize the style of the week day

## Component Structure

The TimePeriodSelector component uses weekDays as the list of days in a week and renders the selection area for each day based on this list. Each day's selected time periods (Time type) are stored as an array of numbers representing the selected time range.

```tsx
const weekDays: readonly ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
type WeekDay = (typeof weekDays)[number];
export type Time = Record<WeekDay, number[]>;
```

## License

MIT License
