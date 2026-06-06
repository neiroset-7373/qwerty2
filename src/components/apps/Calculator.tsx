import { useState } from 'react';
import StatusBar from '../system/StatusBar';
import NavBar from '../system/NavBar';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(display);
    } else if (operator) {
      const currentValue = parseFloat(prevValue);
      let result = 0;

      switch (operator) {
        case '+': result = currentValue + inputValue; break;
        case '-': result = currentValue - inputValue; break;
        case '×': result = currentValue * inputValue; break;
        case '÷': result = currentValue / inputValue; break;
      }

      setDisplay(String(result));
      setPrevValue(String(result));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = () => {
    if (!operator || prevValue === null) return;

    const inputValue = parseFloat(display);
    const currentValue = parseFloat(prevValue);
    let result = 0;

    switch (operator) {
      case '+': result = currentValue + inputValue; break;
      case '-': result = currentValue - inputValue; break;
      case '×': result = currentValue * inputValue; break;
      case '÷': result = currentValue / inputValue; break;
    }

    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const percent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const Button = ({
    value,
    onClick,
    className = '',
    span = 1
  }: {
    value: string | React.ReactNode;
    onClick: () => void;
    className?: string;
    span?: number;
  }) => (
    <button
      className={`app-btn rounded-full text-2xl font-semibold flex items-center justify-center transition-all ${className} ${span === 2 ? 'col-span-2' : ''}`}
      onClick={onClick}
    >
      {value}
    </button>
  );

  return (
    <div className="absolute inset-0 flex flex-col bg-black animate-slide-left">
      <StatusBar dark />

      {/* Display */}
      <div className="flex-1 flex items-end justify-end px-6 pb-4">
        <div className="text-white text-6xl font-light tracking-tight overflow-hidden">
          {display.length > 8 ? display.substring(display.length - 8) : display}
        </div>
      </div>

      {/* Buttons */}
      <div className="px-4 pb-8">
        <div className="grid grid-cols-4 gap-3">
          <Button value="C" onClick={clear} className="bg-slate-300 text-slate-900 h-16" />
          <Button value="±" onClick={toggleSign} className="bg-slate-300 text-slate-900 h-16" />
          <Button value="%" onClick={percent} className="bg-slate-300 text-slate-900 h-16" />
          <Button value="÷" onClick={() => performOperation('÷')} className="bg-amber-500 text-white h-16" />

          <Button value="7" onClick={() => inputDigit('7')} className="bg-slate-700 text-white h-16" />
          <Button value="8" onClick={() => inputDigit('8')} className="bg-slate-700 text-white h-16" />
          <Button value="9" onClick={() => inputDigit('9')} className="bg-slate-700 text-white h-16" />
          <Button value="×" onClick={() => performOperation('×')} className="bg-amber-500 text-white h-16" />

          <Button value="4" onClick={() => inputDigit('4')} className="bg-slate-700 text-white h-16" />
          <Button value="5" onClick={() => inputDigit('5')} className="bg-slate-700 text-white h-16" />
          <Button value="6" onClick={() => inputDigit('6')} className="bg-slate-700 text-white h-16" />
          <Button value="-" onClick={() => performOperation('-')} className="bg-amber-500 text-white h-16" />

          <Button value="1" onClick={() => inputDigit('1')} className="bg-slate-700 text-white h-16" />
          <Button value="2" onClick={() => inputDigit('2')} className="bg-slate-700 text-white h-16" />
          <Button value="3" onClick={() => inputDigit('3')} className="bg-slate-700 text-white h-16" />
          <Button value="+" onClick={() => performOperation('+')} className="bg-amber-500 text-white h-16" />

          <Button value="0" onClick={() => inputDigit('0')} className="bg-slate-700 text-white h-16" span={2} />
          <Button value="." onClick={inputDecimal} className="bg-slate-700 text-white h-16" />
          <Button value="=" onClick={calculate} className="bg-amber-500 text-white h-16" />
        </div>
      </div>

      <NavBar />
    </div>
  );
}
