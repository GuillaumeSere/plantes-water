import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarPlant = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const savedPlants = localStorage.getItem('plants');
    if (savedPlants) {
      const parsedPlants = JSON.parse(savedPlants);
      setPlants(parsedPlants);
    }
  }, []);

  const plantsToWater = plants.filter((plant) => {
    return plant.wateringDates.includes(
      selectedDate.toISOString().split('T')[0]
    );
  });

    return (
        <div className='container-calendar'>
            <h1>Calendrier d'arrosage</h1>
            <Calendar value={selectedDate} onChange={setSelectedDate} className="calendar" />
            <h4>Plantes à arroser aujourd'hui :</h4>
            {plantsToWater.length === 0 ? (
                <p>Aucune plante à arroser aujourd'hui.</p>
            ) : (
                <ul>
                    {plantsToWater.map((plant) => (
                        <li key={plant.id}>{plant.name}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default CalendarPlant
