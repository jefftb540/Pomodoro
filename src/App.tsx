import React from 'react';
import { PomodoroTimer } from './components/pomodoro-timer';

function App() {
  return (
    <div className="App">
      <PomodoroTimer pomodoroTime={1500} shortRestTime={300} longRestTime={1500} cycleNumber={4} />
    </div>
  );
}

export default App;
