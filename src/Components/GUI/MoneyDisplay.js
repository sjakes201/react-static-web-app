import React, { useState, useEffect } from 'react';
import './MoneyDisplay.css'; // Import the CSS file for styling

const MoneyDisplay = ({ amount }) => {
  const [currentAmount, setCurrentAmount] = useState(amount);
  const [isShaking, setIsShaking] = useState(false);

  const [shakeClass, setShakeClass] = useState("shake-light")

  useEffect(() => {
    if (currentAmount === 0) {
      setCurrentAmount(amount);
      return;
    }
    let change = amount - currentAmount;

    let changeAbs = Math.abs(amount - currentAmount);
    let msJump = 5;

    let animationTime = 500;
    if (changeAbs <= 1000) {
      animationTime = 500;
    } else if (changeAbs <= 5000) {
      setShakeClass("shake-light");
      animationTime = 800;
    } else if (changeAbs <= 10000) {
      setShakeClass("shake-medium");
      animationTime = 1000;
    } else if (changeAbs <= 50000) {
      setShakeClass("shake-medium");
      animationTime = 1500;
    } else {
      setShakeClass("shake-intense");
      animationTime = 2000;
    }

    let changePerMS = msJump * (change / animationTime);

    if (change >= 1000) {
      setIsShaking(true);
    }
    // Animate to the new amount
    const interval = setInterval(() => {
      setCurrentAmount((prevAmount) => {
        if (change > 0) {
          if (prevAmount < amount) {
            return prevAmount + changePerMS; 
          } else {
            clearInterval(interval);
            setIsShaking(false)
            return amount;
          }
        } else {
          if (prevAmount > amount) {
            return prevAmount + changePerMS;
          } else {
            clearInterval(interval);
            setIsShaking(false)
            return amount;
          }
        }
      });
    }, msJump); // Adjust the interval time as needed

  }, [amount]);

  return (
    <div className='money-container'>
      <div className={`${isShaking ? shakeClass : ''}`}>
        ${currentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || amount}
      </div>
    </div>

  );
};

export default MoneyDisplay;
