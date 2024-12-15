# ESP32 IoT Dashboard Project

Este proyecto consta de un sistema IoT que recolecta datos de temperatura y humedad mediante un ESP32, los almacena en AWS DynamoDB y los visualiza en una aplicación web React. Además, permite observar datos en tiempo real utilizando WebSockets y consultar datos históricos, integrando tecnologías modernas como AWS Lambda y Chart.js.

## Características principales

- **Recolección de datos**: Un ESP32 obtiene datos de un sensor DHT11 de temperatura y humedad y los envía al backend.
- **Backend en AWS**: Funciones Lambda en AWS procesan las solicitudes y manejan el almacenamiento en DynamoDB.
- **Visualización de datos**: Aplicación React que muestra gráficos en tiempo real e históricos utilizando Chart.js.
- **Consulta histórica**: Los usuarios pueden seleccionar intervalos de tiempo para visualizar datos históricos almacenados.
- **Interfaz de usuario intuitiva**: Diseño minimalista que facilita la interacción y comprensión de los datos.

## Estructura del proyecto

### **1. Backend (AWS Lambda)**
- **`lambda_function.py`**:
  - Procesa datos enviados por el ESP32 a través de WebSockets.
  - Consulta y guarda datos en AWS DynamoDB.
  - Soporta endpoints para:
    - Envío de datos desde el ESP32.
    - Obtención de datos históricos según un rango de fechas.

### **2. Firmware ESP32**
- **`esp32_code.ino`**:
  - Configura el sensor DHT11 para medir temperatura y humedad.
  - Envía datos periódicamente al backend mediante WebSockets.
  - Manejo básico de errores de conexión.

### **3. Frontend (React)**
- **`App.js`**:
  - Punto de entrada de la aplicación React.
  - Maneja la navegación y estados globales.
- **`components/RealTimeChart.js`**:
  - Componente para visualizar datos en tiempo real utilizando WebSockets.
  - Actualización automática de datos desde el backend.
- **`components/HistoricalChart.js`**:
  - Permite seleccionar un rango de fechas y muestra gráficos históricos.
- **`components/Navbar.js`**:
  - Barra de navegación para moverse entre secciones.
- **`utils/api.js`**:
  - Manejo de las solicitudes HTTP al backend (GET y POST) para la visualización de los datos históricos.

### **4. Infraestructura AWS**
- **DynamoDB**:
  - Almacena datos de temperatura y humedad con timestamp.
- **Lambda Functions**:
  - Lógica para procesar datos entrantes y consultas históricas.

## Instalación y configuración

### **Requisitos previos**
- AWS CLI configurado.
- Arduino IDE instalado para programar el ESP32.
- Node.js y npm instalados para el frontend.

### **Pasos de instalación**
1. **Configuración del ESP32**:
   - Carga `esp32_code.ino` al ESP32 utilizando Arduino IDE.
   - Asegúrate de configurar la red Wi-Fi y la URL del backend en el código.

2. **Configuración del backend**:
   - Despliega `lambda_function.py` en AWS Lambda.
   - Configura DynamoDB con una tabla para almacenar los datos.

3. **Instalación del frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   - Abre `http://localhost:3000` en tu navegador.

## Uso

1. **Recolección de datos en tiempo real**:
   - Enciende el ESP32 para comenzar a enviar datos.
   - Observa el gráfico de datos en tiempo real en la aplicación React.

2. **Consulta de datos históricos**:
   - Selecciona un rango de fechas en la sección "Historial" de la aplicación.
   - Visualiza el gráfico con los datos almacenados en DynamoDB.

## Tecnologías utilizadas

- **Hardware**: ESP32, sensor DHT11.
- **Backend**: AWS Lambda, AWS DynamoDB, Python.
- **Frontend**: React, Chart.js.
- **Comunicación**: WebSockets, HTTP GET.

## Créditos
Proyecto desarrollado como parte de un sistema IoT para el curso electivo Internet de las Cosas del programa Maestría en Ingeniería con enfásis en Análitica de Datos de la Universidad del Quindío, integrando tecnologías web y de hardware.

Desarrollado por los estudiantes Daniel Alejandro Cangrejo López y Mariana Jiménez Duarte con base en los códigos base suministrados por el docente Alexander López Parrado.

---
Cualquier duda o mejora, ¡no dudes en contribuir! 🚀
