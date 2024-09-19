import React from 'react';
import './card.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CardComponent = ({ title, amount, percentage, time, icon, viewMoreText }) => {
    return (
        <div className="card">
            <div className="card-header">
                <span className="card-title">{title}</span>
                <FontAwesomeIcon className="icon" icon={icon} />
            </div>
            <div className="card-content">
                <span className="card-amount">{amount}</span>
            </div>
            <div className="card-footer">
                <span className={`card-percentage ${percentage >= 0 ? 'positive' : 'negative'}`}>
                    {percentage >= 0 ? `↑ ${percentage}%` : `↓ ${Math.abs(percentage)}%`}
                </span>
                <span className="card-time">{time}</span>
                <span className="card-view-more">{viewMoreText}</span>
            </div>
        </div>
    );
};

export default CardComponent;
