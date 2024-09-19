import React, { useState } from "react";
import './businessHours.css';

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
                    <input
                        type="time"
                        value={from}
                        onChange={(e) => handleTimeChange(day, "from", e.target.value)}
                    />
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
    const [enabled, setEnabled] = useState(false);
    const [timezone, setTimezone] = useState("UTC-08:00");

    // Separate states for each day
    const [monday, setMonday] = useState({ active: true, from: "09:00", to: "17:30" });
    const [tuesday, setTuesday] = useState({ active: true, from: "09:00", to: "17:30" });
    const [wednesday, setWednesday] = useState({ active: true, from: "09:00", to: "17:30" });
    const [thursday, setThursday] = useState({ active: true, from: "09:00", to: "17:30" });
    const [friday, setFriday] = useState({ active: true, from: "09:00", to: "17:30" });
    const [saturday, setSaturday] = useState({ active: false, from: "Closed", to: "Closed" });
    const [sunday, setSunday] = useState({ active: false, from: "Closed", to: "Closed" });

    const toggleEnable = () => setEnabled(!enabled);

    const handleTimeChange = (day, field, value) => {
        switch (day) {
            case "Monday":
                setMonday({ ...monday, [field]: value });
                break;
            case "Tuesday":
                setTuesday({ ...tuesday, [field]: value });
                break;
            case "Wednesday":
                setWednesday({ ...wednesday, [field]: value });
                break;
            case "Thursday":
                setThursday({ ...thursday, [field]: value });
                break;
            case "Friday":
                setFriday({ ...friday, [field]: value });
                break;
            case "Saturday":
                setSaturday({ ...saturday, [field]: value });
                break;
            case "Sunday":
                setSunday({ ...sunday, [field]: value });
                break;
            default:
                break;
        }
    };

    const toggleDayActive = (day) => {
        switch (day) {
            case "Monday":
                setMonday({ ...monday, active: !monday.active });
                break;
            case "Tuesday":
                setTuesday({ ...tuesday, active: !tuesday.active });
                break;
            case "Wednesday":
                setWednesday({ ...wednesday, active: !wednesday.active });
                break;
            case "Thursday":
                setThursday({ ...thursday, active: !thursday.active });
                break;
            case "Friday":
                setFriday({ ...friday, active: !friday.active });
                break;
            case "Saturday":
                setSaturday({ ...saturday, active: !saturday.active });
                break;
            case "Sunday":
                setSunday({ ...sunday, active: !sunday.active });
                break;
            default:
                break;
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
            <div className="timezone">
                <label>Timezone</label>
                <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                    <option value="UTC-08:00">UTC-08:00 Pacific Time</option>
                </select>
            </div>
            <DayTimeSelector
                day="Monday"
                active={monday.active}
                from={monday.from}
                to={monday.to}
                toggleDayActive={toggleDayActive}
                handleTimeChange={handleTimeChange}
            />
            <DayTimeSelector
                day="Tuesday"
                active={tuesday.active}
                from={tuesday.from}
                to={tuesday.to}
                toggleDayActive={toggleDayActive}
                handleTimeChange={handleTimeChange}
            />
            <DayTimeSelector
                day="Wednesday"
                active={wednesday.active}
                from={wednesday.from}
                to={wednesday.to}
                toggleDayActive={toggleDayActive}
                handleTimeChange={handleTimeChange}
            />
            <DayTimeSelector
                day="Thursday"
                active={thursday.active}
                from={thursday.from}
                to={thursday.to}
                toggleDayActive={toggleDayActive}
                handleTimeChange={handleTimeChange}
            />
            <DayTimeSelector
                day="Friday"
                active={friday.active}
                from={friday.from}
                to={friday.to}
                toggleDayActive={toggleDayActive}
                handleTimeChange={handleTimeChange}
            />
            <DayTimeSelector
                day="Saturday"
                active={saturday.active}
                from={saturday.from}
                to={saturday.to}
                toggleDayActive={toggleDayActive}
                handleTimeChange={handleTimeChange}
            />
            <DayTimeSelector
                day="Sunday"
                active={sunday.active}
                from={sunday.from}
                to={sunday.to}
                toggleDayActive={toggleDayActive}
                handleTimeChange={handleTimeChange}
            />

            <div className="additional-settings">
                <button>Set up Outside business hours</button>
            </div>
        </div>
    );
};

export default BusinessHours;
