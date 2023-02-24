import React, { useState } from 'react';

function ScheduleForm({ onCreateSchedule }) {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [instructor, setInstructor] = useState('');
  

  const handleSubmit = (event) => {
    event.preventDefault();

    const schedule = {
      name,
      start_time: startTime,
      end_time: endTime,
      instructor,
    };

    onCreateSchedule(schedule);

    setName('');
    setStartTime('');
    setEndTime('');
    setInstructor('');
  };

  return (
    <div className='container' id='schedule'>
      <h1>Create Schedule</h1>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" placeholder="Enter Name" name="name" id="name"  value={name} onChange={(event) => setName(event.target.value)} />
      </div>
      <div>
        <label htmlFor="start-time">Start Time:</label>
        <input type="text" placeholder="Start Time" name="name" id="name" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
      </div>
      <div>
        <label htmlFor="end-time">End Time:</label>
        <input type="text" placeholder="End Time" value={endTime} onChange={(event) => setEndTime(event.target.value)} />
      </div>
      <div>
        <label htmlFor="instructor">Instructor:</label>
        <input type="text" placeholder="Instructor" value={instructor} onChange={(event) => setInstructor(event.target.value)} />
      </div>
      <button type="submit"  class="registerbtn">Create Schedule</button>
    </form>
    </div>
  );
}

export default ScheduleForm;