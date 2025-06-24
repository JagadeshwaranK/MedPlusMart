import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import '../styles/offer.css'; // Create this CSS file

const LimitedOffer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = {...prevTime};
        if (newTime.seconds > 0) {
          newTime.seconds--;
        } else {
          newTime.seconds = 59;
          if (newTime.minutes > 0) {
            newTime.minutes--;
          } else {
            newTime.minutes = 59;
            if (newTime.hours > 0) {
              newTime.hours--;
            } else {
              // Offer expired
              clearInterval(timer);
            }
          }
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="limited-offer-container">
      <div className="offer-content">
        <div className="offer-badge">LIMITED OFFER</div>
        <h2 className="offer-title">Exclusive Health Savings</h2>
        <h3 className="offer-subtitle">Up to 30% Off Essential Medicines</h3>
        
        <div className="countdown-timer">
          <div className="timer-segment">
            <span className="timer-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
            <span className="timer-label">Hours</span>
          </div>
          <div className="timer-segment">
            <span className="timer-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
            <span className="timer-label">Minutes</span>
          </div>
          <div className="timer-segment">
            <span className="timer-number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
            <span className="timer-label">Seconds</span>
          </div>
        </div>

        <p className="offer-description">
          Stock up on your health essentials now with our biggest discount of the season. 
          Use code <strong>HEALTH30</strong> at checkout for an extra 5% off.
        </p>

        <div className="offer-cta">
          <Link to="/productlist">
            <Button variant="danger" size="lg" className="offer-button">
              SHOP NOW & SAVE
            </Button>
          </Link>
          <div className="offer-note">Offer ends soon! Limited quantities available.</div>
        </div>
      </div>
    </div>
  );
};

export default LimitedOffer;