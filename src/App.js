import { useState, useEffect,useRef  } from 'react';
import './App.css';
const BREAK = 'break';
const SESSION = 'session';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
}
function App() {
  const [running,setRunning] = useState(false);
  const [session,SetSession] = useState(25);
  const [secondsLeft,SetSecondsLeft] = useState(25*60);
  const [Type,setType] = useState(SESSION);
  const incrementSession = () =>{
    if(running) return;
    let tempSession = session;
    if(session < 60){
      tempSession += 1
      SetSession(tempSession);
    }
    SetSecondsLeft(tempSession * 60);
  }
  const decrementSession = () =>{
    if(running) return;
    let tempSession = session;
    if(session > 1){
      tempSession -= 1
      SetSession(tempSession);
    }
    SetSecondsLeft(tempSession * 60);
  }
  const [Break,SetBreak] = useState(5);
  const incrementBreak = () =>{
    if(running) return;
    if(Break < 60)
      SetBreak(Break+1);
  }
  const decrementBreak = () =>{
    if(running) return;
    if(Break > 1)
      SetBreak(Break-1);
  }


  const countDown = () =>{
    if(!running) return;
    if(secondsLeft > 0){
      let nextSecondLeft = secondsLeft;
      nextSecondLeft -= 1
      SetSecondsLeft(nextSecondLeft);
    }else{
      if(Type === SESSION){
        SetSecondsLeft(Break * 60)
        setType(BREAK);
      }else{
        SetSecondsLeft(session * 60)
        setType(SESSION);
      }
      let audio = document.getElementById("beep");
      if (audio){
        audio.play();
      }
    }
  } 


  const resetTimer = () => {
    setRunning(false);
    SetSecondsLeft(25 * 60);
    SetSession(25);
    SetBreak(5);
    setType(SESSION);
    let audio = document.getElementById("beep");
    if (audio){
      audio.pause();
      audio.currentTime = 0;
    }
  }

  const startStop = () => {
    let nextState = !running;
    setRunning(nextState);
  }

  const secondToTime = (sec) =>{
    if(sec === 0){
      return "00:00"
    }
    const minutesLeft = Math.floor(sec / 60);
    const secondsLeft = sec % 60;
    return minutesLeft.toString().padStart(2,'0') + ':' + secondsLeft.toString().padStart(2,'0')
  }

  useInterval(() => {
    countDown();
  }, 1000);

  return (
    <div className="App">
      <div id="title">25 + 5 Clock</div>
      <div id="clock-container" className="clock-container">
        <div id="break-label" className="label">Break Length</div>
        <div className="blank"></div>
        <div id="session-label" className="label">Session Length</div>
        <div id="break-decrement" className="icon" onClick={() => decrementBreak()}>-</div>
        <div id="break-length"className="text">{Break}</div>
        <div id="break-increment" className="icon" onClick={() => incrementBreak()} >+</div>
        <div className="blank"></div>
        <div id="session-decrement" className="icon" onClick={() => decrementSession()}>-</div>
        <div id="session-length">{session}</div>
        <div id="session-increment" className="icon" onClick={() => incrementSession()}>+</div>
        <div id="timer-label"className="row">{Type}</div>
        <div id="time-left" className="row">{secondToTime(secondsLeft)}</div>
        <div id="start_stop" className="label" onClick={() => startStop()}>start stop</div>
        <div className="blank"></div>
        <div id="reset" className="label" onClick={() => resetTimer()}>reset</div>
        <audio id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"></audio>
      </div>
    </div>
  );
}

export default App;
