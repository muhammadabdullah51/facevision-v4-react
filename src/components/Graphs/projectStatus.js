import React from 'react';
import LineChartComponent from './lineChart';
import './linechart.css';

const DashboardCard = () => {
    return (
        <div className="dashboard-card">
            <div>
                <h4>Project Status</h4>
                <p>Progress</p>
                <h2>$4,374</h2>
                <p>Your Earnings</p>
            </div>
            <div className="line-chart-container">
                <LineChartComponent />
            </div>
            <div className="earnings-info">
                <p>Donates <span className="negative">$756.26 ↓ -139.34</span></p>
                <p>Podcasts <span className="positive">$2,217.03 ↑ 12.6%</span></p>
            </div>
        </div>
    );
};

export default DashboardCard;
