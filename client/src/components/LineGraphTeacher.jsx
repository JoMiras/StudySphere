import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function LineGraphTeacher({ refreshData }) {
  const [studentData, setStudentData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [timeSpentData, setTimeSpentData] = useState([]);
  const [gpaData, setGpaData] = useState([]);

  const options = {};

  const data = {
    labels: Array.from(
      { length: Math.max(studentData.length, teacherData.length, timeSpentData.length, gpaData.length) },
      (_, index) => index + 1
    ),
    datasets: [
      {
        label: "Students",
        data: studentData,
        borderColor: "rgb(75, 192, 192)"
      },
      
      {
        label: "Time Spent",
        data: timeSpentData,
        borderColor: "rgb(255, 99, 132)"
      },
      {
        label: "GPA",
        data: gpaData,
        borderColor: "rgb(54, 162, 235)"
      }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:4000/users");
        const students = res.data.filter(user => user.role === "student");
        

        // Update student count
        setStudentData([students.length]);


        // Simulated time spent and GPA data
        const simulatedTimeSpentData = Array.from({ length: students.length }, () => Math.floor(Math.random() * 100) + 1);
        const simulatedGpaData = Array.from({ length: students.length }, () => (Math.random() * 4).toFixed(2));
        
        // Update time spent and GPA data
        setTimeSpentData(simulatedTimeSpentData);
        setGpaData(simulatedGpaData);
      } catch (error) {
        console.error(error);
      }
    };

    // Fetch data initially
    fetchData();
  }, [refreshData]);

  return (
    <div className='graph'>
      <Line options={options} data={data} />
    </div>
  );
}

export default LineGraphTeacher;
