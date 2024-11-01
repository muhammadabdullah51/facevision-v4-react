import React from "react";
import "./dashboard_table.css"; // Import the CSS file for styling

const Table = () => {
    const data = [
        { advertiser: "HBO", date: "12 / 04 / 2022 08:25", owner: "Camila Rios", channel: "bt.dk", status: "Pending", commission: "34,55 USD" },
        { advertiser: "Lirum Larum Leg", date: "16 / 04 / 2022 15:20", owner: "Diana Smith", channel: "Berlinske.dk", status: "Pending", commission: "18,42 USD" },
        { advertiser: "Kop & Kande", date: "17 / 04 / 2022 16:45", owner: "Wade Warren", channel: "Berlinske.dk", status: "Paid", commission: "21,55 USD" },
        { advertiser: "Temashop", date: "20 / 04 / 2022 05:35", owner: "Guy Hawkins", channel: "bt.dk", status: "Paid", commission: "42,19 USD" },
    ];

    return (
        <div className="table-container">
            <h3>Latest Conversions <span className="live-data">Live data</span></h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Advertiser</th>
                        <th>Date</th>
                        <th>Owner</th>
                        <th>Channel</th>
                        <th>Status</th>
                        <th>Commission</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.advertiser}</td>
                            <td>{row.date}</td>
                            <td>{row.owner}</td>
                            <td>{row.channel}</td>
                            <td><span className={row.status.toLowerCase()}>{row.status}</span></td>
                            <td>{row.commission}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
