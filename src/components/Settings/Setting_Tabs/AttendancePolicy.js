import React from 'react'
import BusinessHours from './BusinessHours/businessHours';
import ScheduleCheckboxes from './ScheduleCheckboxes/scheduleCheckboxes';
import '../settings.css';
const AttendancePolicy = () => {
  return (
    <div className='business-Hours-main'>
      <BusinessHours/>
      {/* <ScheduleCheckboxes/> */}
    </div>
  )
}

export default AttendancePolicy
