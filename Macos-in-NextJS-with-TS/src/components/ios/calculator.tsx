"use client"

import React, { useState } from 'react';

export const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNum = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setIsNewNumber(true);
  };

  const calculate = () => {
    try {
      const result = eval(equation + display);
      setDisplay(String(result));
      setEquation('');
      setIsNewNumber(true);
    } catch (e) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  };

  const btnClass = "w-full aspect-square flex items-center justify-center text-[32px] rounded-full active:opacity-70 transition-opacity cursor-pointer pointer-events-auto";
  const numClass = `${btnClass} bg-[#333333] text-white`;
  const opClass = `${btnClass} bg-[#ff9f0a] text-white font-medium`;
  const funcClass = `${btnClass} bg-[#a5a5a5] text-black font-medium`;

  return (
    <div className="w-full h-full bg-black flex flex-col pb-10 pointer-events-auto">
      <div className="flex-1 flex flex-col items-end justify-end p-6 overflow-hidden select-text pointer-events-auto">
        <div className="text-gray-400 text-2xl h-8">{equation}</div>
        <div className="text-white text-[70px] font-light tracking-tight w-full text-right overflow-hidden text-ellipsis">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-3 p-4 pointer-events-auto">
        <button className={funcClass} onClick={clear}>AC</button>
        <button className={funcClass} onClick={() => setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display)}>+/-</button>
        <button className={funcClass} onClick={() => setDisplay(String(Number(display) / 100))}>%</button>
        <button className={opClass} onClick={() => handleOp('/')}>÷</button>

        <button className={numClass} onClick={() => handleNum('7')}>7</button>
        <button className={numClass} onClick={() => handleNum('8')}>8</button>
        <button className={numClass} onClick={() => handleNum('9')}>9</button>
        <button className={opClass} onClick={() => handleOp('*')}>×</button>

        <button className={numClass} onClick={() => handleNum('4')}>4</button>
        <button className={numClass} onClick={() => handleNum('5')}>5</button>
        <button className={numClass} onClick={() => handleNum('6')}>6</button>
        <button className={opClass} onClick={() => handleOp('-')}>−</button>

        <button className={numClass} onClick={() => handleNum('1')}>1</button>
        <button className={numClass} onClick={() => handleNum('2')}>2</button>
        <button className={numClass} onClick={() => handleNum('3')}>3</button>
        <button className={opClass} onClick={() => handleOp('+')}>+</button>

        <button className={`${numClass} col-span-2 !aspect-auto !justify-start pl-8`} onClick={() => handleNum('0')}>0</button>
        <button className={numClass} onClick={() => handleNum('.')}>.</button>
        <button className={opClass} onClick={calculate}>=</button>
      </div>
    </div>
  );
};
