import { useState } from 'react';

function ScheduleUpdateForm({ scheduleId }) {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [instructor, setInstructor] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const data = { name, startTime, endTime, instructor };
    fetch(`/schedule/${scheduleId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        console.log(`Updated ${result} schedules`);
        // Do something with the result, like display a success message
      })
      .catch(error => {
        console.error('Error updating schedule:', error);
        // Handle the error, like displaying an error message
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={event => setName(event.target.value)} />
      </label>
      <br />
      <label>
        Start Time:
        <input type="text" value={startTime} onChange={event => setStartTime(event.target.value)} />
      </label>
      <br />
      <label>
        End Time:
        <input type="text" value={endTime} onChange={event => setEndTime(event.target.value)} />
      </label>
      <br />
      <label>
        Instructor:
        <input type="text" value={instructor} onChange={event => setInstructor(event.target.value)} />
      </label>
      <br />
      <button type="submit">Update Schedule</button>
    </form>
  );
}

export default ScheduleUpdateForm;