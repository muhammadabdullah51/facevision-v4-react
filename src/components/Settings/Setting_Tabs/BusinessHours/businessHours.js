import React, { useEffect, useState } from "react";
import axios from "axios";
import './businessHours.css';
import { SERVER_URL } from "../../../../config";

const DayTimeSelector = ({ day, active, from, to, toggleDayActive, handleTimeChange }) => {
    return (
        <div className="day-row">
            <label>
                <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleDayActive(day)}
                />
                {day}
            </label>
            {active ? (
                <div className="time-inputs">
                    <label>From</label>
                    <input
                        type="time"
                        value={from}
                        onChange={(e) => handleTimeChange(day, "from", e.target.value)}
                    />
                    <label>To</label>
                    <input
                        type="time"
                        value={to}
                        onChange={(e) => handleTimeChange(day, "to", e.target.value)}
                    />
                </div>
            ) : (
                <p>Closed</p>
            )}
        </div>
    );
};

const BusinessHours = () => {
    const [enabled, setEnabled] = useState(true);
    const defaultBusinessHours = {
        "Monday": { active: true, from: "09:00", to: "17:30" },
        "Tuesday": { active: true, from: "09:00", to: "17:30" },
        "Wednesday": { active: true, from: "09:00", to: "17:30" },
        "Thursday": { active: true, from: "09:00", to: "17:30" },
        "Friday": { active: true, from: "09:00", to: "17:30" },
        "Saturday": { active: true, from: "09:00", to: "17:30" },
        "Sunday": { active: true, from: "09:00", to: "17:30" }
    };
    const [businessHours, setBusinessHours] = useState({});

    const toggleEnable = () => setEnabled(!enabled);

    const handleTimeChange = (day, field, value) => {
        setBusinessHours((prevHours) => ({
            ...prevHours,
            [day]: { ...prevHours[day], [field]: value }
        }));
    };

    const toggleDayActive = (day) => {
        setBusinessHours((prevHours) => ({
            ...prevHours,
            [day]: { ...prevHours[day], active: !prevHours[day].active }
        }));
    };

    useEffect(() => {
        const fetchBusinessHours = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}api/business-hours/`);
                if (response.data.length === 0) {
                    // If no data is found, set default business hours
                    setBusinessHours(defaultBusinessHours);
                } else {
                    // Transform response data into an object for businessHours
                    const fetchedHours = {};
                    response.data.forEach(item => {
                        fetchedHours[item.day] = {
                            active: item.active,
                            from: item.from_time.substring(0, 5), // Extract "HH:mm" from "HH:mm:ss"
                            to: item.to_time.substring(0, 5) // Extract "HH:mm" from "HH:mm:ss"
                        };
                    });
                    setBusinessHours(fetchedHours); // Set transformed state
                }
            } catch (error) {
                console.error('Error fetching business hours:', error);
                // Set to default in case of an error
                setBusinessHours(defaultBusinessHours);
            }
        };

        fetchBusinessHours();
    }, []); // Empty dependency array to run only once on mount


    const saveBusinessHours = async () => {
        try {
            const res = await axios.post(`${SERVER_URL}api/business-hours/`, businessHours); // Adjust the URL as needed
            alert("Business hours saved successfully!");
            console.log(res.data);
            
        } catch (error) {
            console.error('Error saving business hours:', error);
            alert("Failed to save business hours.");
        }
    };

    return (
        <div className="business-hours">
            <div className="header">
                <h2>Business hours</h2>
                <p>Control your working day and time according to your time zone.</p>
            </div>
            <div className="enable-toggle">
                <label>
                    <input type="checkbox" checked={enabled} onChange={toggleEnable} />
                    Enable
                </label>
            </div>
            <p>Enable this to consider business hours for a global time along with shifts time for attendance.</p>
            {console.log("business hours")}
            {console.log(businessHours)}
            {Object.keys(businessHours).map((day) => (
                <DayTimeSelector
                    key={day}
                    day={day}
                    active={businessHours[day]?.active} // Safe access
                    from={businessHours[day]?.from || "09:00"} // Default time
                    to={businessHours[day]?.to || "17:30"} // Default time
                    toggleDayActive={toggleDayActive}
                    handleTimeChange={handleTimeChange}
                />
            ))}

            <div className="additional-settings">
                <button onClick={saveBusinessHours}>Save Business Hours</button>
            </div>
        </div>
    );
};

export default BusinessHours;
