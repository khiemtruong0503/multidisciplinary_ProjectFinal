import { Box, Button, IconButton,Switch, Slider, Typography, useTheme, LinearProgress } from "@mui/material";
import { React, useState, useEffect } from 'react';
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DeviceThermostatRoundedIcon from '@mui/icons-material/DeviceThermostatRounded';
import WindPowerTwoToneIcon from '@mui/icons-material/WindPowerTwoTone';
import RollerShadesIcon from '@mui/icons-material/RollerShades';
import RollerShadesClosedIcon from '@mui/icons-material/RollerShadesClosed';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import OpacityIcon from '@mui/icons-material/Opacity';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LightModeIcon from '@mui/icons-material/LightMode';
import LightMode from "@mui/icons-material/LightMode";

const Dashboard = () => {
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
  // Toggle Anti-Theft Mode
  const handleToggle = () => {
    setAntiTheftMode(!antiTheftMode);
  };

  const handleToggleCurtains = () => {
    setCurtainsValue(!curtainsValue);
  };
  const handleToggleLightBulb = () => {
    setLightBulbValue(!lightBulbValue);
  };
  const recentTheftAlerts = mockTransactions.slice(0, 5);

  const handleLedUpdate = async () => {
    try {
      const response = await fetch('http://localhost:5000/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'updateLedFanCurtains' }) // Send action to update LED
      });
      if (!response.ok) {
        throw new Error('Failed to save data');
      }
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // console.log("line chart data: ", lineChartData);
  console.log("\nhumidityData: ", humidityData);

  // functions for humidity box
  const normalise = (value) => ((value - 0) * 100) / (100 - 0); // for humidity 0 - 100 range
  const percentageChange = (newValue, oldValue) => ((Math.abs(oldValue - newValue) / oldValue * 100).toFixed(2)); 
  const lastHumidValue = humidityData.length > 0 ? humidityData[humidityData.length - 1] : null;
  const secondLastHumidValue = humidityData.length > 1 ? humidityData[humidityData.length - 2] : null;
  const lastTempValue = tempArrayValue.length > 0 ? tempArrayValue[tempArrayValue - 1] : null;
  const secondLastTempValue = tempArrayValue.length > 1 ? tempArrayValue[tempArrayValue - 2] : null;
  const lastLightValue = lightArrayValue.length > 0 ? lightArrayValue[lightArrayValue.length - 1] : null;
  const secondLastLightValue = lightArrayValue.length > 1 ? lightArrayValue[lightArrayValue.length - 2] : null;
  const latestLightValue = lightArrayValue.length > 0 ? lightArrayValue[lightArrayValue.length - 1] : 0;

  const changeColor = (value1, value2) => { 
    return (value1 >= value2) ? colors.greenAccent[600] : colors.redAccent[600];
  }

  // phải viết hoa tên class tag HTML
  const HumidArrowIcon = lastHumidValue > secondLastHumidValue ? ArrowUpwardIcon : ArrowDownwardIcon;
  const TempArrowIcon = lastTempValue > secondLastTempValue ? ArrowUpwardIcon : ArrowDownwardIcon;
  const LightArrowIcon = lastLightValue > secondLastLightValue ? ArrowUpwardIcon : ArrowDownwardIcon;

  const progressBarColor = (value) => { 
    if (value < 30) return colors.greenAccent[600];
    if (value >= 50 && value <= 75) return colors.blueAccent[300];
    if (value > 75) return colors.redAccent[600];
  }
  
  
  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="150px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Line Chart
              </Typography>
            </Box>
            <Box>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            {
              <LineChart 
                data={lineChartData}
                // data={transformedData}
              />
             }
          </Box>
        </Box>


        {/* Anti-Theft Box */}
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            overflow="auto"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              colors={colors.grey[100]}
              p="15px"
            >
              <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                Anti-Theft 
              </Typography>
              <Switch
                checked={antiTheftMode}  // Use the consolidated state variable
                onChange={handleToggle}  // Use the corrected function
                color="primary"
              />
            </Box>
            {recentTheftAlerts.map((alert, i) => (
              <Box
                key={`${alert.txId}-${i}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
              >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {alert.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {alert.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{alert.date}</Box>
              <Button variant="contained" size="small" sx={{backgroundColor: colors.greenAccent[500]}}>
                See More
              </Button>
            </Box>
          ))}
        </Box>
        {/* ROW 2 */}
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <StatBox
            title={humidityData.length > 0 ? `${humidityData[humidityData.length - 1]}%` : `0%`}
            subtitle="Humidity"
            icon={
              <OpacityIcon
                sx={{ color: colors.greenAccent[600], fontSize: "45px" }}
              />
            }
            
          />
          <Box
            sx={{ position: "absolute", top: "10px", right: "10px", display: "flex", alignItems: "center" }}
          >
          <HumidArrowIcon /* arrow icon*/ sx={{ color: changeColor(lastHumidValue, secondLastHumidValue) }} /> 
          <Typography 
            variant="body2" sx= {{ color: changeColor(lastHumidValue, secondLastHumidValue) }}
            // sx={{ position: "absolute", top: "10px", right: "10px" }} // Position the typography
          >
            {
              humidityData.length > 1 ?
              `${percentageChange(humidityData[humidityData.length - 1], humidityData[humidityData.length - 2])}%`
              : `0%`
            }
          </Typography>
          </Box>
          <Box
            width="250%" // Set width to 75% to span 3/4 of the box
            mt={4} // Add margin top for spacing
            pr={2} // Add padding right for spacing
          >
            <LinearProgress
              variant="determinate"
              value={humidityData.length > 0 ? normalise(humidityData[humidityData.length - 1]) : 0}
              sx={{
                height: 10,
                borderRadius: 5,
                // backgroundColor: colors.greenAccent[300],
                backgroundColor: colors.grey[500],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: colors.greenAccent[600]
                }
              }}
            />
          </Box>
        </Box>
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <StatBox
            title={`${tempValue}˚C`}
            subtitle="Indoor Temperature"
            icon={
              <DeviceThermostatRoundedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "45px" }}
              />
            }
          />
          <Box
            sx={{ position: "absolute", top: "10px", right: "10px", display: "flex", alignItems: "center" }}
          >
            <TempArrowIcon /* arrow icon*/ sx={{ color: changeColor(lastTempValue, secondLastTempValue) }} /> 
            <Typography 
              variant="body2" sx= {{ color: changeColor(lastTempValue, secondLastTempValue) }}
              // sx={{ position: "absolute", top: "10px", right: "10px" }} // Position the typography
            >
              {
                tempArrayValue.length > 1 ?
                `${percentageChange(tempArrayValue[tempArrayValue.length - 1], tempArrayValue[tempArrayValue.length - 2])}%`
                : `0%`
              }
            </Typography>
          </Box>
          <Box
            width="250%" // Set width to 75% to span 3/4 of the box
            mt={4} // Add margin top for spacing
            pr={2} // Add padding right for spacing
          >
            <LinearProgress
              variant="determinate"
              value={humidityData.length > 0 ? normalise(humidityData[humidityData.length - 1]) : 0}
              sx={{
                height: 10,
                borderRadius: 5,
                // backgroundColor: colors.greenAccent[300],
                backgroundColor: colors.grey[500],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: progressBarColor(tempValue)
                }
              }}
            />
          </Box>
        </Box>
        {/* ROW 3 */}
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
        >
          <StatBox
            title={`${latestLightValue} lux`}
            subtitle="Light"
            icon={
              <LightModeIcon
                sx={{ color: colors.greenAccent[600], fontSize: "45px" }}
              />
            }
          />
          <Box
            sx={{ position: "absolute", top: "10px", right: "10px", display: "flex", alignItems: "center" }}
          >
          <LightArrowIcon /* arrow icon*/ sx={{ color: changeColor(lastLightValue, secondLastLightValue) }} /> 
          <Typography 
            variant="body2" sx= {{ color: changeColor(lastLightValue, secondLastLightValue) }}
            // sx={{ position: "absolute", top: "10px", right: "10px" }} // Position the typography
          >
            {
              humidityData.length > 1 ?
              `${percentageChange(lightArrayValue[lightArrayValue.length - 1], lightArrayValue[lightArrayValue.length - 2])}%`
              : `0%`
            }
          </Typography>
          </Box>
          <Box
            width="250%" // Set width to 75% to span 3/4 of the box
            mt={4} // Add margin top for spacing
            pr={2} // Add padding right for spacing
          >
            <LinearProgress
              variant="determinate"
              value={humidityData.length > 0 ? normalise(humidityData[humidityData.length - 1]) : 0}
              sx={{
                height: 10,
                borderRadius: 5,
                // backgroundColor: colors.greenAccent[300],
                backgroundColor: colors.grey[500],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: progressBarColor(tempValue)
                }
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
