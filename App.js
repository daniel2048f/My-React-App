// Imports
import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { Line } from "react-chartjs-2";
import useWebSocket from "react-use-websocket";
import DatePicker from "react-datepicker"; // Importa react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Importa los estilos de react-datepicker
import "./App.css";

function App() {
  const [flag, setFlag] = useState(false);
  const [repetitions, setRepetitions] = useState(0);
  const [startTime, setStartTime] = useState(null); // Guarda el timestamp al hacer Start
  const [socketUrl] = useState(
    "wss://q8bl57mzwa.execute-api.us-east-1.amazonaws.com/production/"
  );
  const { lastMessage } = useWebSocket(socketUrl);

  // Estado de la gráfica en tiempo real
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "ESP32 Temperature",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [],
      },
      {
        label: "ESP32 Humidity",
        backgroundColor: "rgb(132, 99, 255)",
        borderColor: "rgb(132, 99, 255)",
        data: [],
      },
    ],
  });

  // Nuevo estado para la gráfica de datos históricos
  const [historicalData, setHistoricalData] = useState({
    labels: [],
    datasets: [
      {
        label: "ESP32 Temperature (Historical)",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [],
      },
      {
        label: "ESP32 Humidity (Historical)",
        backgroundColor: "rgb(132, 99, 255)",
        borderColor: "rgb(132, 99, 255)",
        data: [],
      },
    ],
  });

  // Estados para los valores del calendario (selección de fecha/hora)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Actualiza el número de repeticiones en el párrafo
  useEffect(() => {
    const paragraph1 = document.getElementById("paragraph1");
    paragraph1.innerText = `Number of repetitions: ${repetitions}`;
  }, [repetitions]);

  // Actualiza la gráfica en tiempo real con los datos recibidos del WebSocket
  useEffect(() => {
    if (lastMessage != null) {
      try {
        const messageData = JSON.parse(lastMessage.data);
        const tempValue = messageData.temp;
        const humValue = messageData.hum;
        const timestamp = new Date(messageData.timestamp);
        const newLabel = `${timestamp.getDate()}-${
          timestamp.getMonth() + 1
        }-${timestamp.getFullYear()} ${timestamp.getHours()}:${timestamp.getMinutes()}`;

        // Actualizar la gráfica con el nuevo punto de datos
        setData((prevData) => ({
          labels: [...prevData.labels, newLabel],
          datasets: [
            {
              ...prevData.datasets[0],
              data: [...prevData.datasets[0].data, tempValue],
            },
            {
              ...prevData.datasets[1],
              data: [...prevData.datasets[1].data, humValue],
            },
          ],
        }));

        setRepetitions((prevRepetitions) => prevRepetitions + 1);
      } catch (error) {
        console.error("Error parsing WebSocket message: ", error);
      }
    }
  }, [lastMessage]);

  // Maneja el evento del botón Start/Stop
  const handleClick = () => {
    if (!flag) {
      setData({
        labels: [],
        datasets: [
          { ...data.datasets[0], data: [] }, // Limpia los datos de temperatura
          { ...data.datasets[1], data: [] }, // Limpia los datos de humedad
        ],
      });

      setStartTime(Date.now()); // Usa Date.now() para obtener el tiempo actual en milisegundos
      setRepetitions(0); // Reinicia el contador de repeticiones
      setFlag(true); // Cambia el botón a "Stop"
    } else {
      setFlag(false); // Cambia el botón a "Start"
    }
  };

  // Nueva función para manejar el envío de fechas y actualizar la gráfica histórica
  const handleFetchDataBetweenDates = () => {
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate).getTime();
    const JSONResponse = httpGet(
      `https://2pug5h4074.execute-api.us-east-1.amazonaws.com/alpha/data?start_time=${startTimestamp}&end_time=${endTimestamp}`
    );
    const esp32Items = JSON.parse(JSONResponse);

    // Procesar los datos recibidos y actualizar la gráfica
    const labels = esp32Items.map((item) => {
      const myDate = new Date(item.timestamp);
      return `${myDate.getDate()}-${
        myDate.getMonth() + 1
      }-${myDate.getFullYear()} ${myDate.getHours()}:${myDate.getMinutes()}`;
    });

    const tempData = esp32Items.map((item) => item.temp);
    const humData = esp32Items.map((item) => item.hum);

    setHistoricalData({
      labels: labels,
      datasets: [
        {
          ...historicalData.datasets[0],
          data: tempData,
        },
        {
          ...historicalData.datasets[1],
          data: humData,
        },
      ],
    });
  };

  return (
    <div>
      <div id="buttondiv">
        <button id="button1" onClick={handleClick}>
          {flag ? "Stop" : "Start"}
        </button>
      </div>
      <p id="paragraph1"></p>
      <div>
        <p id="paragraph2"></p>
      </div>
      <Line data={data} />

      {/* Nueva sección para el calendario y la gráfica histórica */}
      <h2>Select Date Range for Historical Data</h2>
      <div>
        <label>Start Date: </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          showTimeSelect
          dateFormat="Pp" // Muestra fecha y hora en formato amigable
        />
      </div>
      <div>
        <label>End Date: </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          showTimeSelect
          dateFormat="Pp"
        />
      </div>
      <button onClick={handleFetchDataBetweenDates}>Fetch Data</button>

      <Line data={historicalData} />
    </div>
  );
}

export default App;

// Synchronous implementation
function httpGet(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send();
  return xmlHttp.responseText;
}
