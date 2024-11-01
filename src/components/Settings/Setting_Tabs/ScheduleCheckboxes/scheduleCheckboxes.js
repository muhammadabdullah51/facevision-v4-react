import React, { useState } from "react";
import './scheduleCheckboxes.css';

const ScheduleCheckboxes = () => {
    // Separate states for each day
    const [monday, setMonday] = useState({ active: true, onEntry: "09:00 AM", onExit: "05:00 PM" });
    const [tuesday, setTuesday] = useState({ active: true, onEntry: "09:00 AM", onExit: "05:00 PM" });
    const [wednesday, setWednesday] = useState({ active: true, onEntry: "09:00 AM", onExit: "05:00 PM" });
    const [thursday, setThursday] = useState({ active: false, onEntry: "09:00 AM", onExit: "05:00 PM" });
    const [friday, setFriday] = useState({ active: false, onEntry: "09:00 AM", onExit: "05:00 PM" });
    const [saturday, setSaturday] = useState({ active: false, onEntry: "09:00 AM", onExit: "05:00 PM" });
    const [sunday, setSunday] = useState({ active: false, onEntry: "09:00 AM", onExit: "05:00 PM" });

    const days = [
        { day: "Monday", state: monday, setState: setMonday },
        { day: "Tuesday", state: tuesday, setState: setTuesday },
        { day: "Wednesday", state: wednesday, setState: setWednesday },
        { day: "Thursday", state: thursday, setState: setThursday },
        { day: "Friday", state: friday, setState: setFriday },
        { day: "Saturday", state: saturday, setState: setSaturday },
        { day: "Sunday", state: sunday, setState: setSunday },
    ];

    const toggleDay = (dayState, setDayState) => {
        setDayState((prev) => ({
            ...prev,
            active: !prev.active,
        }));
    };

    const handleTimeChange = (dayState, setDayState, field, value) => {
        setDayState((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <div className="schedule-container">
            <div className="header">
            <h2>Attendance Calculation</h2>
            <p className="attendance-calculation">Set your entry and exit times for each day.</p>
            </div>
            <div className="day-checkboxes">
                {days.map(({ day, state, setState }) => (
                    <div key={day} className="day-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={state.active}
                                onChange={() => toggleDay(state, setState)}
                            />
                            {day}
                        </label>
                        {state.active && (
                            <div className="time-selectors">
                                <label>On Entry</label>
                                <input
                                    type="time"
                                    value={state.onEntry}
                                    onChange={(e) => handleTimeChange(state, setState, "onEntry", e.target.value)}
                                />
                                <label>On Exit</label>
                                <input
                                    type="time"
                                    value={state.onExit}
                                    onChange={(e) => handleTimeChange(state, setState, "onExit", e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                ))}
                <div className="additional-settings">
                    <button>Set up Entry and Exit Time</button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleCheckboxes;
