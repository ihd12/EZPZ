import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./AirportDetectionPage.css";

// Chart.js 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AirportDetectionPage() {
  const [airportList, setAirportList] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState("");
  const [detectionData, setDetectionData] = useState([]);
  const [chartData, setChartData] = useState(null);

  // 공항 목록 가져오기
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL+"/api/airport-detections/distinct")
      .then((response) => {
        setAirportList(response.data);
        if (response.data.length > 0) {
          setSelectedAirport(response.data[0].airportName);
        }
      })
      .catch((error) => console.error("공항 목록 불러오기 오류:", error));
  }, []);

  // 선택된 공항의 적발 데이터 가져오기
  useEffect(() => {
    if (selectedAirport) {
      axios
        .get(process.env.REACT_APP_API_URL+`/api/airport-detections/name/${selectedAirport}`)
        .then((response) => {
          setDetectionData(response.data);

          // 데이터 그룹화
          const groupCategoryData = (data) => {
            const groupedData = {};
            let totalSum = 0;

            data.forEach((item) => {
              let category = item.category;
              groupedData[category] = (groupedData[category] || 0) + item.detectionCount;
              totalSum += item.detectionCount;
            });

            groupedData["합계"] = totalSum;
            return groupedData;
          };

          const groupedData = groupCategoryData(response.data);
          const labels = Object.keys(groupedData);
          const values = Object.values(groupedData);

          setChartData({
            labels,
            datasets: [
              {
                label: "적발 건수",
                data: values,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          });
        })
        .catch((error) => console.error("적발 현황 불러오기 오류:", error));
    }
  }, [selectedAirport]);

  return (
    <div className="airport-detection-page">
      <div className="description-section2">
        <h1>국내 공항 적발 현황</h1>
        <p className="checklist-alert">현재 각 공항들의 금지물품 적발 현황입니다.</p>
      </div>

      <div className="airport-select-box">
        <label>공항 선택: </label>
        <select value={selectedAirport} onChange={(e) => setSelectedAirport(e.target.value)}>
          {airportList.map((airport, index) => (
            <option key={index} value={airport.airportName}>
              {airport.airportName}
            </option>
          ))}
        </select>
        <h4>제주공항, 청주공항 : 2024/08,  그 외 공항 : 2024/12 기준</h4>
      </div>

      <div className="chart-container">
        {chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: {
                  display: true,
                  text: "공항 별 적발 현황",
                  font: { size: 30 },
                  padding: 20,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { display: true, color: "rgba(0, 0, 0, 0.1)" },
                  ticks: { font: { size: 20 } },
                },
                x: {
                  grid: { display: false },
                  ticks: { font: { size: 16 } },
                },
              },
            }}
            style={{ height: "500px" }}
          />
        ) : (
          <p>데이터를 불러오는 중...</p>
        )}
      </div>
    </div>
  );
}

export default AirportDetectionPage;
