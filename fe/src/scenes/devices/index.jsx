import { Box, Typography, useTheme, Switch } from "@mui/material";
import { React, useState, useEffect } from 'react';

import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import StatBox from "../../components/StatBox";
import WindPowerTwoToneIcon from '@mui/icons-material/WindPowerTwoTone';
import RollerShadesClosedIcon from '@mui/icons-material/RollerShadesClosed';
import RollerShadesIcon from '@mui/icons-material/RollerShades';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import ModeFanOffIcon from '@mui/icons-material/ModeFanOff';
//SỬA FILE NÀY THÀNH điểu chỉnh rèm, hẹn giờ kéo rèm, cài đặt các thông số thời tiết để kéo và đóng rèm
const CurtainControl = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [lineChartData, setLineChartData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
  
        // console.log(data.sensorsArray[0].values);
        // console.log(tempValueArray);

        if(data.tempSensorsArray.length > 0) { 
          // setTempValueArray(data.tempSensorsArray[0].values);

          // const transformedData = [
          //   {
          //     id: "temp",
          //     color: tokens("dark").greenAccent[500],
          //     data: data.tempSensorsArray[0].values.map( (temp, index) => ({
          //       x: data.tempSensorsArray[0].dateValues[index],
          //       y: temp,
          //     })),
          //   },
          //   { 
          //     id: "light", 
          //     color: tokens("dark").redAccent[200],
          //     data: data.lightSensorsArray[0].values.map( (lux, index) => ({
          //       x: data.lightSensorsArray[0].dateValues[index],
          //       y: lux
          //     })),
          //   }
          // ];

          const transformedData = [
            {
              id: "temp",
              color: tokens("dark").greenAccent[500],
              data: data.tempSensorsArray[0].values.map( (temp, index) => ({
                x: index + 1,
                y: temp,
              })),
            },
            { 
              id: "light", 
              color: tokens("dark").redAccent[200],
              data: data.lightSensorsArray[0].values.map( (lux, index) => ({
                x: index + 1,
                y: lux
              })),
            }, 
            {
              id: "humid",
              color: tokens("dark").blueAccent[300],
              data: data.humidSensorsArray[0].values.map( (humidValue, index) => ({
                x: index + 1,
                y: humidValue
              })),
            }
          ];

          // console.log(transformedData);

          if (transformedData.length > 0) {
            // setLineChartData([transformedData]);
            
            setLineChartData(transformedData);
          }
        }

        if (data.humidSensorsArray[0].values.length > 0) { 
          setHumidityData(data.humidSensorsArray[0].values);
        }
        
        if (data.lightSensorsArray[0].values.length > 0) { 
          setLightArrayValue(data.lightSensorsArray[0].values);
        }

        if (data.tempSensorsArray[0].values.length > 0) { 
          setTempValueArray(data.tempSensorsArray[0].values);
        }

        if (data.fanSensors.length > 0) { 
          setFanValue(data.fanSensors[0].value === "1");
        }
        if (data.sensors.length > 0) {
          setLightBulbValue(data.sensors[0].value === "1");
          setTempValue(data.tempSensors[0].temp);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data initially
    fetchData();

    // Fetch data every 5 seconds
    const intervalId = setInterval(fetchData, 1000);

    // Cleanup function
    return () => clearInterval(intervalId);
  }, []);

  // console.log(lineChartData[0]);


  // Dyn Edit
  const [antiTheftMode, setAntiTheftMode] = useState(false); // Anti-Theif
  const [tempValue, setTempValue] = useState(false); 
  const [lightArrayValue, setLightArrayValue] = useState([]); // Light (Lux)
  const [curtainsValue, setCurtainsValue] = useState(false); // Curtains
  const [lightBulbValue, setLightBulbValue] = useState(false); // Light Buld (Led)
  const [antiTheftEnabled, setAntiTheftEnabled] = useState(false);
  const [tempArrayValue, setTempValueArray] = useState([]); // Temperature
  const [fanValue, setFanValue] = useState(false); /// fan

  // console.log(fanValue);


  // Toggle Anti-Theft Mode
  const handleToggle = () => {
    setAntiTheftMode(!antiTheftMode);
  };

  const handleToggleCurtains = () => {
    setCurtainsValue(!curtainsValue);
  };

  const handleToggleFan = () => {
    setFanValue(!fanValue);
  };

  const handleToggleLightBulb = () => {
    setLightBulbValue(!lightBulbValue);
  };

  const handleLedUpdate = async () => {
    try {
      const response = await fetch('http://localhost:5000/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'updateLed' }) // Send action to update LED
      });
      if (!response.ok) {
        throw new Error('Failed to save data');
      }
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleFanUpdate = async () => {
    try {
      const response = await fetch('http://localhost:5000/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'updateFan' }) // Send action to update FAN
      });
      if (!response.ok) {
        throw new Error('Failed to save data');
      }
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleCurtainsUpdate = async () => {
    try {
      const response = await fetch('http://localhost:5000/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'updateCurtains' }) // Send action to update LED
      });
      if (!response.ok) {
        throw new Error('Failed to save data');
      }
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };


  return (
    <Box m="20px">
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="150px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title=" "
            subtitle="Fan" 
            icon={
              fanValue ? 
              <WindPowerTwoToneIcon
                sx={{ color: colors.greenAccent[600], fontSize: "45px" }}
              />
              : 
              <ModeFanOffIcon sx={{color: colors.greenAccent[600], fontSize: "45px"}}/>
            }
          />

          <Switch
            checked={fanValue}  // Use the consolidated state variable
            onClick={handleFanUpdate}
            onChange={handleToggleFan}  // Use the corrected function
            color="primary"
          />
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title=" "
            subtitle="Curtains"
            icon={
              curtainsValue ? (<RollerShadesClosedIcon sx={{ color: colors.greenAccent[600], fontSize: "45px"}} />) : (<RollerShadesIcon sx={{ color: colors.greenAccent[600], fontSize: "45px"}} />)
            }
          />
          
          <Switch
            checked={curtainsValue}  // Use the consolidated state variable
            onClick={handleCurtainsUpdate}
            onChange={handleToggleCurtains}  // Use the corrected function
            color="primary"
          />
          
        </Box>
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title=""
            subtitle="Light Bulb"
            icon={
              lightBulbValue == "1" ? (<LightbulbIcon sx={{ color: colors.greenAccent[600], fontSize: "45px" }}/>) : (<LightbulbOutlinedIcon sx={{ color: colors.greenAccent[600], fontSize: "45px"}}/>)
            }
          />
          
          <Switch
                checked={lightBulbValue} 
                onClick={handleLedUpdate}
                onChange={handleToggleLightBulb}  // Use the corrected function
                color="primary"
              />
          
        </Box>
      </Box>
    </Box>
  );
};

export default CurtainControl;
