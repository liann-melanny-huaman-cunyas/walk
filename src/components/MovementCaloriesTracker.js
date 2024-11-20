import React, { useState, useEffect } from 'react';

const MovementCaloriesTracker = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [steps, setSteps] = useState('');
  const [distance, setDistance] = useState('');
  const [history, setHistory] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('movementHistory');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setHistory(parsedHistory);
      // Calculate total calories from history
      const totalCals = parsedHistory.reduce((sum, entry) => sum + parseFloat(entry.caloriesBurned), 0);
      setTotalCalories(totalCals);
    }
  }, []);

  const calculateMovementTime = () => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const timeDiff = (end - start) / 1000 / 60;
    return timeDiff > 0 ? timeDiff.toFixed(2) : '0.00';
  };

  const calculateCaloriesBySteps = () => {
    const stepsNum = parseFloat(steps);
    return (stepsNum * 0.04).toFixed(2);
  };

  const calculateVelocity = () => {
    const distanceNum = parseFloat(distance);
    const timeNum = calculateMovementTime() / 60;
    return timeNum > 0 ? (distanceNum / timeNum).toFixed(2) : '0.00';
  };

  const handleSave = () => {
    const caloriesBurned = calculateCaloriesBySteps();
    const newEntry = {
      id: Date.now(),
      startTime,
      endTime,
      steps,
      distance,
      caloriesBurned,
    };

    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    localStorage.setItem('movementHistory', JSON.stringify(updatedHistory));

    // Update total calories
    setTotalCalories(prev => prev + parseFloat(caloriesBurned));

    // Clear form
    setStartTime('');
    setEndTime('');
    setSteps('');
    setDistance('');
  };

  const handleClear = () => {
    localStorage.removeItem('movementHistory');
    setHistory([]);
    setTotalCalories(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 to-yellow-600 flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white/90 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r to-stone-600 from-yellow-600 mb-6">
            CAMINADOR FIS
          </h1>
          
          <div className="grid gap-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Inicio su caminata</label>
                <input
                  type="time"
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Termino su caminata</label>
                <input
                  type="time"
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Pasos realizado</label>
                <input
                  type="number"
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  placeholder="Number of steps"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Distancia (km)</label>
                <input
                  type="number"
                  className="w-full p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="Distance traveled"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Calorias quemadas</p>
                <p className="text-xl font-bold text-blue-600">{calculateCaloriesBySteps()} cal</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Tiemp trascurrido</p>
                <p className="text-xl font-bold text-purple-600">{calculateMovementTime()} min</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Velocidad</p>
                <p className="text-xl font-bold text-green-600">{calculateVelocity()} km/h</p>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all"
              >
                Guardar su actividad
              </button>
              <button
                onClick={handleClear}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/90 rounded-2xl shadow-2xl p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Total Calories: {totalCalories.toFixed(2)} cal
          </h2>
          
          <div className="max-h-64 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-center text-gray-500">No se registran actividades</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="p-2">Inicio</th>
                    <th className="p-2">Finzalizo</th>
                    <th className="p-2">Pasos</th>
                    <th className="p-2">Calorias</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr key={entry.id} className="border-b hover:bg-blue-50">
                      <td className="p-2 text-center">{entry.startTime}</td>
                      <td className="p-2 text-center">{entry.endTime}</td>
                      <td className="p-2 text-center">{entry.steps}</td>
                      <td className="p-2 text-center">{entry.caloriesBurned} cal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementCaloriesTracker;