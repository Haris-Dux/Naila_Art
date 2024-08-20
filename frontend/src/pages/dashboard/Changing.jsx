import React, { useState, useEffect, useRef } from 'react';
import './Changing.css';

const CircularProgress = ({ identifier, startValue, endValue, speed, circleColor }) => {
    const [progressValue, setProgressValue] = useState(startValue);
    const circularProgressRef = useRef(null);
    const progressRef = useRef(null);
    const animationStartedRef = useRef(false);

    useEffect(() => {
        const circularProgress = circularProgressRef.current;

        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animationStartedRef.current) {
                    startAnimation();
                } else if (!entry.isIntersecting) {
                    stopAnimation();
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, { threshold: 0.5 });
        if (circularProgress) {
            observer.observe(circularProgress);
        }

        return () => {
            observer.disconnect();
            stopAnimation();
        };
    }, [circularProgressRef.current]);

    const startAnimation = () => {
        animationStartedRef.current = true;
        progressRef.current = setInterval(() => {
            setProgressValue(prevValue => {
                const newValue = prevValue + 1;
                if (circularProgressRef.current) {
                    circularProgressRef.current.style.background = `conic-gradient(${circleColor} ${newValue * 3.6}deg, #ededed 0deg)`;
                }

                if (newValue === endValue) {
                    clearInterval(progressRef.current);
                    animationStartedRef.current = false;
                }

                return newValue;
            });
        }, speed);
    };

    const stopAnimation = () => {
        clearInterval(progressRef.current);
        setProgressValue(startValue); // Reset progress value
        animationStartedRef.current = false;
    };

    return (
        <div ref={circularProgressRef} id={`circular-progress-${identifier}`} className="circular-progress">
            <span className="progress-value">{`${progressValue}%`}</span>
        </div>
    );
};

export default CircularProgress;