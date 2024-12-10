import React from 'react';
import { Time, TimePeriodSelector } from '../src/index';
import { useState } from 'react';

const App = () => {
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
    <TimePeriodSelector
      value={selectedTime}
      onChange={setSelectedTime}
      style={{ margin: '200px auto' }}
      title='Time period selector'
      showTime
    />
  );
};

export default App;
