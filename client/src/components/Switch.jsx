import React, { useState } from 'react';
import './Switch.scss';

const Switch = ({ onSwitch }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleSwitch = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onSwitch && onSwitch(newValue);
  };

  return (
    <label className={`switch ${isChecked ? 'dark' : 'light'}`}>
      <input type="checkbox" checked={isChecked} onChange={handleSwitch} />
      <span className="slider round"></span>
    </label>
  );
};

export default Switch;
