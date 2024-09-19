import React from "react";
import Card from '../Cards/card';
import { faExchangeAlt, faCopy, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import PrefomanceGraph from '../Graphs/prefomanceGraph';
import Table from '../Tables/Dashboard_Table/dashboard_table';
import ProjectGraph from '../Graphs/projectStatus';

const Dashboard = () => {
    return (
        <div className="dashboard-main">
            <div className="dashboard-cards">
                <Card
                    title="Pending"
                    amount="2,480.30"
                    percentage={2.15}
                    time="Last month"
                    icon={faExchangeAlt}
                    viewMoreText="View more"
                />
                <Card
                    title="Completed"
                    amount="5,340.50"
                    percentage={-1.35}
                    time="Last month"
                    icon={faCopy}
                    viewMoreText="See details"
                />
                <Card
                    title="Approved"
                    amount="1,200.00"
                    percentage={3.25}
                    time="This month"
                    icon={faCheckCircle}
                    viewMoreText="View details"
                />
                <Card
                    title="Rejected"
                    amount="320.50"
                    percentage={-0.75}
                    time="This month"
                    icon={faTimesCircle}
                    viewMoreText="Check reasons"
                />
            </div>
            <div className="dashboard-graphs">
                <div className="prefomance-graph">
                    <PrefomanceGraph />
                </div>
                <div className="geography-graph">
                <ProjectGraph/>
                </div>
            </div>
            <div className="dashboard-table">
                <Table />
            </div>
        </div>
    );
};

export default Dashboard;
