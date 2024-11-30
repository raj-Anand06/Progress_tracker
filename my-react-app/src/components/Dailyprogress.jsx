import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Dailyprogress.css'; // Importing the CSS file

function Dailyprogress() {
  const [data, setData] = useState([]); // Array to store day-to-day task completion details
  const [date, setDate] = useState('');
  const [questionsSolved, setQuestionsSolved] = useState('');

  // Load data from localStorage when the component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('dailyProgressData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData)) {
          setData(parsedData);
        }
      } catch (error) {
        console.error("Error parsing saved data", error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (data.length > 0) {
      try {
        localStorage.setItem('dailyProgressData', JSON.stringify(data));
      } catch (error) {
        console.error("Error saving data to localStorage", error);
      }
    }
  }, [data]);

  const addData = () => {
    if (date && questionsSolved) {
      const newData = [...data, { date, questionsSolved: parseInt(questionsSolved, 10) }];
      // Sort data by date (dd-mm-yyyy format)
      newData.sort((a, b) => {
        const dateA = new Date(a.date.split('-').reverse().join('-')); // Convert dd-mm-yyyy to yyyy-mm-dd format for comparison
        const dateB = new Date(b.date.split('-').reverse().join('-'));
        return dateA - dateB;
      });
      setData(newData);
      setDate('');
      setQuestionsSolved('');
    }
  };

  const deleteData = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  // Function to format date to dd-mm-yyyy
  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="container">
      <h2 className="header">Daily Progress Tracker</h2>
      <div className="input-container">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Questions Solved"
          value={questionsSolved}
          onChange={(e) => setQuestionsSolved(e.target.value)}
        />
        <button onClick={addData}>Add</button>
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="5 5" stroke="#ddd" /> {/* Customized grid lines */}
            <XAxis 
              dataKey="date" 
              tickFormatter={(tick) => formatDate(tick)} // Format the date on the X-axis
              axisLine={{ stroke: '#8884d8', strokeWidth: 1 }} // Axis line styling
              tick={{ fill: '#8884d8', fontSize: 12 }} // Axis ticks styling
            />
            <YAxis 
              axisLine={{ stroke: '#8884d8', strokeWidth: 1 }} // Axis line styling
              tick={{ fill: '#8884d8', fontSize: 12 }} // Axis ticks styling
            />
            <Tooltip 
              formatter={(value, name, props) => [`${value} questions solved`, name]} 
              contentStyle={{ backgroundColor: '#333', color: '#fff', borderRadius: 5 }}
              labelStyle={{ fontSize: 14 }}
            />
            <Legend wrapperStyle={{ fontSize: 14 }} />
            <Line 
              type="monotone" 
              dataKey="questionsSolved" 
              stroke="url(#gradientStroke)" 
              activeDot={{ r: 8 }} 
              strokeWidth={2} 
            />
            <defs>
              <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff7300" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#ff00ff" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data List */}
      <div className="data-list">
        <div className="data-list-container">
          {data.map((entry, index) => (
            <div key={index} className="data-entry">
              <span>{formatDate(entry.date)}</span> {/* Show formatted date */}
              <span>{entry.questionsSolved}</span>
              <button className="delete-button" onClick={() => deleteData(index)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dailyprogress;
