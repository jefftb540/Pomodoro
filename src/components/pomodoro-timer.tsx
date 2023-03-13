import React, { useCallback, useEffect, useState } from 'react';
import { useInterval } from '../hooks/use-interval';
import { secondsToHours, secondsToMinutes } from '../utils/seconds-to-time';
import { Button } from './button';
import { Timer } from './timer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellStart = require('../sounds/bell-start.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinish = require('../sounds/bell-finish.mp3');

const startWorkingSound = new Audio(bellStart);
const stopWorkingSound = new Audio(bellFinish);

interface Props {
  pomodoroTime: number;
  shortRestTime: number;
  longRestTime: number;
  cycleNumber: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = useState(props.pomodoroTime);
  const [timeCounting, setTimeCounting] = useState(false);
  const [working, setWorking] = useState(false);
  const [resting, setResting] = useState(false);

  const [completedCycles, setCompletedCycles] = useState(0);
  const [fullWorkingTime, setFullWorkingTime] = useState(0);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);

  const initCycles = () => {
    return new Array(props.cycleNumber).fill(true);
  };

  const [cycles, setCycle] = useState(initCycles());

  const startWorking = useCallback(() => {
    setTimeCounting(true);
    setWorking(true);
    setResting(false);
    setMainTime(props.pomodoroTime);
    startWorkingSound.play();
  }, [setTimeCounting, setWorking, setResting, setMainTime, startWorkingSound, props.pomodoroTime]);

  const startResting = useCallback(
    (long = false) => {
      setTimeCounting(true);
      setWorking(false);
      setResting(true);
      stopWorkingSound.play();
      if (long) {
        setMainTime(props.longRestTime);
      } else {
        setMainTime(props.shortRestTime);
      }
    },
    [setTimeCounting, setWorking, setResting, stopWorkingSound, props.longRestTime, props.shortRestTime]
  );
  useEffect(() => {
    if (working) document.body.classList.add('working');
    if (resting) document.body.classList.remove('working');

    if (mainTime > 0) return;

    if (working && cycles.length > 0) {
      startResting();
      cycles.pop();
    } else if (working && cycles.length <= 0) {
      startResting(true);
      setCycle(initCycles());
      setCompletedCycles(completedCycles + 1);
    }

    if (working) setCompletedPomodoros(completedPomodoros + 1);
    if (resting) startWorking();
  }, [
    working,
    resting,
    mainTime,
    completedCycles,
    completedPomodoros,
    cycles,
    startResting,
    setCycle,
    setCompletedCycles,
    setCompletedPomodoros,
    startWorking,
    initCycles,
  ]);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (working) setFullWorkingTime(fullWorkingTime + 1);
    },
    timeCounting ? 1000 : null
  );
  return (
    <div className="pomodoro">
      <h2>You are: {working ? 'Working' : 'Resting'}</h2>
      <Timer mainTime={mainTime} />
      <div className="controls">
        <Button text="Work" onClick={() => startWorking()} />
        <Button text="Rest" onClick={() => startResting()} />
        <Button
          text={timeCounting ? 'Pause' : 'Resume'}
          onClick={() => setTimeCounting(!timeCounting)}
          className={!working && !resting ? 'hidden' : ''}
        />
      </div>
      <div className="details">
        <p>Ciclos concluídos: {completedCycles}</p>
        <p>Horas trabalhadas: {secondsToHours(fullWorkingTime)}</p>
        <p>Pomodoros concluídos: {completedPomodoros}</p>
      </div>
    </div>
  );
}
