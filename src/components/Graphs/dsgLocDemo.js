import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  // Legend,
  ResponsiveContainer
} from 'recharts';
import SERVER_URL from '../../config';
import "./dsgLocDemo.css"

const colors = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
const generateColors = (count) => {
  const hueStep = 360 / count;
  return Array.from({ length: count }, (_, i) => `hsl(${i * hueStep}, 70%, 60%)`);
};

const DsgLocDemo = () => {
  const [chartData, setChartData] = useState([]);
  const [designations, setDesignations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/dsg-chart/`);
        const data = await response.json();

        const locationsMap = new Map();
        const designationsSet = new Set();

        data.forEach(designation => {
          designationsSet.add(designation.designation);
          designation.locations.forEach(location => {
            if (!locationsMap.has(location.location)) {
              locationsMap.set(location.location, {});
            }
            locationsMap.get(location.location)[designation.designation] = location.count;
          });
        });

        const transformedData = Array.from(locationsMap).map(([location, counts]) => {
          const locationEntry = { location };
          Array.from(designationsSet).forEach(designation => {
            locationEntry[designation] = counts[designation] || 0;
          });
          return locationEntry;
        });

        const allDesignations = Array.from(designationsSet);
        const generatedColors = generateColors(allDesignations.length);

        setChartData(transformedData);
        setDesignations(allDesignations.map((d, i) => ({ name: d, color: generatedColors[i] })));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="chart-container">
      <h2 className="chart-title">
        Employee Location-wise Designation Distribution
      </h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="location"
              tick={{ fill: '#4b5563' }}
              axisLine={{ stroke: '#9ca3af' }}
            />
            <YAxis
              tick={{ fill: '#4b5563' }}
              axisLine={{ stroke: '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            {/* <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="legend-text">{value}</span>
              )}
            /> */}
            {designations.map((designationObj) => (
              <Bar
                key={designationObj.name}
                dataKey={designationObj.name}
                name={designationObj.name}
                fill={designationObj.color}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DsgLocDemo;