import React, { createContext, useState, useContext, useEffect } from "react";

const CountdownContext = createContext();

export const useCountdown = () => useContext(CountdownContext);

export const CountdownProvider = ({ children }) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [expiryTime, setExpiryTime] = useState(null);

  useEffect(() => {
    let interval = null;

    if (isActive && expiryTime) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = expiryTime - now;

        if (distance <= 0) {
          clearInterval(interval);
          setIsActive(false);
          setIsValid(false);
          setMinutes(0);
          setSeconds(0);
        } else {
          setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
          setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
          setIsValid(true);
        }
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, expiryTime]);

  const startCountdown = (durationInMilliseconds) => {
    const now = new Date().getTime();
    const endTime = now + durationInMilliseconds;
    setExpiryTime(endTime);
    setIsActive(true);
  };

  const stopCountdown = () => {
    setIsActive(false);
  };

  return (
    <CountdownContext.Provider
      value={{
        minutes,
        seconds,
        isValid,
        isActive,
        startCountdown,
        stopCountdown,
      }}
    >
      {children}
    </CountdownContext.Provider>
  );
};
