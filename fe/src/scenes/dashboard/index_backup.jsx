import { Box, Button, IconButton,Switch, Slider, Typography, useTheme } from "@mui/material";
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

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [lineChartData, setLineChartData] = useState([]);
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
                x: [1,2,3,4,5,6,7,8,9,10,11,12][index],
                y: temp,
              })),
            },
            { 
              id: "light", 
              color: tokens("dark").redAccent[200],
              data: data.lightSensorsArray[0].values.map( (lux, index) => ({
                x: [1,2,3,4,5,6,7,8,9,10,11,12][index],
                y: lux
              })),
            }
          ];

          // console.log(transformedData);
          
          if (transformedData.length > 0) {
            // setLineChartData([transformedData]);
            
            setLineChartData(transformedData);
          }
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
  const [tempValue, setTempValue] = useState(false); // Temperature
  const [lightValue, setLightValue] = useState(false); // Light (Lux)
  const [curtainsValue, setCurtainsValue] = useState(false); // Curtains
  const [lightBulbValue, setLightBulbValue] = useState(false); // Light Buld (Led)
  const [antiTheftEnabled, setAntiTheftEnabled] = useState(false);
  // Toggle Anti-Theft Mode
  const handleToggle = () => {
    setAntiTheftMode(!antiTheftMode);
    // Here you might also handle backend updates or further state changes
  };

  const handleToggleCurtains = () => {
    setCurtainsValue(!curtainsValue);
    // Here you might also handle backend updates or further state changes
  };
  const handleToggleLightBulb = () => {
    setLightBulbValue(!lightBulbValue);
    // Here you might also handle backend updates or further state changes
  };
  const recentTheftAlerts = mockTransactions.slice(0, 5);

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

  console.log("line chart data: ", lineChartData);

  //
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
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="28˚C"
            subtitle="Indoor Temperature"
            icon={
              <DeviceThermostatRoundedIcon
                sx={{ color: colors.greenAccent[600], fontSize: "45px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${tempValue}˚C`}
            subtitle="Fan"
            icon={
              <WindPowerTwoToneIcon
                sx={{ color: colors.greenAccent[600], fontSize: "45px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
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
                onChange={handleToggleCurtains}  // Use the corrected function
                color="primary"
              />
          
        </Box>
        <Box
          gridColumn="span 3"
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

        {/* ROW 2 */}
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

        {/* ROW 3 */}
        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;
