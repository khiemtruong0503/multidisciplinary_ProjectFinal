const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');

const Leds = require('../models/Leds');
const Temps = require('../models/Temps');
const Lights = require('../models/Lights');
const Humids = require('../models/Humid');
const Fans = require('../models/Fans');
const Curtains = require('../models/Curtains');

const LedsArray = require('../models/Leds_array');
const TempArray = require('../models/Temps_array');
const LightArray = require('../models/Lights_array');
const HumidArray = require('../models/Humids_array');
const FanArray = require('../models/Fans_array');
const CurtainsArray = require('../models/Curtains_array');

const mqtt = require('mqtt');
const io = require('socket.io')();
const EventEmitter = require('events');
const Fans_array = require('../models/Fans_array');
const Curtains_array = require('../models/Curtains_array');

let input, inputArray;

class dashBoardController extends EventEmitter { 
    constructor(io, mqttClient) { 
        super();
        this.io = io;
        this.mqttClient = mqttClient;

        this.updateLed = this.updateLed.bind(this);
        // this.updateFan = this.updateFan.bind(this);
        // this.updateCurtains = this.updateCurtains.bind(this);

        this.mqttClient.on('connect', () => { 
            console.log('Connected to Adafruit MQTT Broker');
            this.mqttClient.subscribe('khiemtruong0503/feeds/bbc-led');
            this.mqttClient.subscribe('khiemtruong0503/feeds/bbc-temp');
            this.mqttClient.subscribe('khiemtruong0503/feeds/bbc-light');
            this.mqttClient.subscribe('khiemtruong0503/feeds/bbc-humidity');
            this.mqttClient.subscribe('khiemtruong0503/feeds/bbc-fan');
            this.mqttClient.subscribe('khiemtruong0503/feeds/bbc-curtain');
        });

        this.mqttClient.on('message', async (topic, message) => { 
            console.log('Received message: ', message.toString(), ' from feed: ', topic);

            const data = JSON.parse(JSON.stringify(message.toString()));

            // get current date
            const currentDate = new Date(); // get current date (format: DD/MM/YYYY Mon)
            // let dayOfWeek = currentDate.getDay();

            // switch (dayOfWeek) { 
            //     case 0: 
            //         dayOfWeek = "Sun";
            //         break;
            //     case 1:
            //         dayOfWeek = "Mon";
            //         break;
            //     case 2: 
            //         dayOfWeek = "Tue";
            //         break;
            //     case 3:
            //         dayOfWeek = "Wed";
            //         break;
            //     case 4: 
            //         dayOfWeek = "Thu";
            //         break;
            //     case 5:
            //         dayOfWeek = "Fri";
            //         break;
            //     case 6:
            //         dayOfWeek = "Sat";
            //         break;
            // }

            try { 
                // find document based on the topic in Adafruit IO
                // let input, inputArray;
                switch (topic) { 
                    case 'khiemtruong0503/feeds/bbc-led': 
                        input = await Leds.findOne( { name: "BBC_LED" });
                        inputArray = await LedsArray.findOne({ name: "LED_ARRAY" });
                        
                        console.log("Led: " + input.toString());
                        console.log("Leds Array: " + inputArray.toString());

                        inputArray.values.shift(); // remove oldest value of the 12 most recent values
                        inputArray.values.push(input.value); // insert newest value
                        break;
                    case 'khiemtruong0503/feeds/bbc-temp': 
                        input = await Temps.findOne( {name: "BBC_TEMP" });
                        inputArray = await TempArray.findOne({ name: "TEMP_ARRAY" });
                        
                        console.log("Temp: " + input.toString());
                        console.log("\ninputArray: ", inputArray.values);

                        // remove the first element of array, in this case is the oldest light value
                        while (inputArray.values.length >= 12) { 
                            inputArray.values.shift(); 
                        }
                        while (inputArray.dateValues.length >= 12) { 
                            inputArray.dateValues.shift();
                        }
                        // then add the newest light value to the end of array
                        inputArray.values.push(data);
                        inputArray.dateValues.push(
                            currentDate.getDate() + "/" 
                            + (currentDate.getMonth() + 1)
                            + " "
                            + currentDate.getHours() + ":"
                            + currentDate.getMinutes() + ":"
                            + currentDate.getSeconds()
                        );
                        break;
                    case 'khiemtruong0503/feeds/bbc-light': 
                        input = await Lights.findOne( {name: "BBC_LIGHT" });
                        inputArray = await LightArray.findOne( { name: "LIGHT_ARRAY" });

                        console.log("\nLight inputArray: ", inputArray);
                        console.log("\ninputArray: ", inputArray.values);
                        
                        // remove the first element of array, in this case is the oldest light value
                        while (inputArray.values.length >= 12) { 
                            inputArray.values.shift(); 
                        }
                        while (inputArray.dateValues.length >= 12) { 
                            inputArray.dateValues.shift();
                        }
                        // then add the newest light value to the end of array
                        // inputArray.values.push(input.light_value);
                        inputArray.values.push(data);
                        inputArray.dateValues.push(
                            currentDate.getDate() + "/" 
                            + (currentDate.getMonth() + 1)
                            + " "
                            + currentDate.getHours() + ":"
                            + currentDate.getMinutes() + ":"
                            + currentDate.getSeconds()
                        );

                        // console.log("Light: " + input.toString());
                        break;
                    case 'khiemtruong0503/feeds/bbc-humidity':
                        input = await Humids.findOne( {name: "BBC_HUMIDITY"} );
                        inputArray = await HumidArray.findOne( { name: "HUMID_ARRAY"} );

                        console.log("\nHumid inputArray: ", inputArray);
                        console.log("\nHumid input: ", input);
                        // remove the first element of array, in this case is the oldest humid value
                        while (inputArray.values.length >= 12) { 
                            inputArray.values.shift();
                        }
                        while (inputArray.dateValues.length >= 12) { 
                            inputArray.values.shift();
                        }

                        // then add the newst humid value to the end of array
                        inputArray.values.push(data);
                        inputArray.dateValues.push(
                            currentDate.getDate() + "/"
                            + (currentDate.getMonth() + 1) 
                            + " "
                            + currentDate.getHours() + ":"
                            + currentDate.getMinutes() + ":"
                            + currentDate.getSeconds()
                        )
                        break;
                    case 'khiemtruong0503/feeds/bbc-fan':
                        input = await Fans.findOne( {name: "BBC_FAN"} );
                        inputArray = await FanArray.findOne( {name: "FAN_ARRAY"} );

                        console.log("\nFan array: ", inputArray);
                        console.log("\nFan input: ", input);

                        // remove the first element of array, in this case is the oldest fan value
                        while (inputArray.values.length >= 12) { 
                            inputArray.values.shift();
                        }
                        inputArray.values.push(data);

                        break;
                    case 'khiemtruong0503/feeds/bbc-curtain': 
                        input = await Curtains.findOne( {name: "BBC_CURTAIN"} );
                        inputArray = await CurtainsArray.findOne( {name: "CURTAIN_ARRAY"});

                        console.log("\nCurtains array: ", inputArray);
                        console.log("\nCurtains input: ", input);

                        break;
                }

                if(!input) { 
                    console.error('Sensor not found.');
                    return;
                }

                // Update the appropriate field with the received message
                switch (topic) { 
                    case 'khiemtruong0503/feeds/bbc-led': 
                        console.log('message: ' + message.toString());
                        input.value = data;
                        break;
                    case 'khiemtruong0503/feeds/bbc-temp':
                        console.log('message: ' + message.toString());
                        input.temp = data;
                        break;
                    case 'khiemtruong0503/feeds/bbc-light': 
                        console.log('message: ' + message.toString());
                        input.light_value = data;
                        break;
                    case 'khiemtruong0503/feeds/bbc-humidity':
                        console.log('message: ' + message.toString());
                        input.humid = data;
                        break;
                    case 'khiemtruong0503/feeds/bbc-fan':
                        console.log('message: ' + message.toString());
                        input.value = data;
                        break;
                    case 'khiemtruong0503/feeds/bbc-curtain':
                        console.log('message: ' + message.toString());
                        input.value = data;
                        break;
                }

                // Save the updated document to the database
                await input.save();
                await inputArray.save();

                console.log('Sensor data saved to mongoDB!');

                this.emitSensorData();
            } catch (error) { 
                console.error('Error saving sensor data: ', error);
            }
        });
    }

    async emitSensorData() { 
        try { 
            const sensors = await Leds.find({});
            // Emit the updated sensor data to all connect clients
            this.io.emit('sensorDataUpdated', multipleMongooseToObject(sensors));
        } catch (error) { 
            console.error('Error fetching sensor data: ', error);
        }
    }

    // endpoint: localhost:5000/dashboard
    async dashboard(req, res, next) { 
        try { 
            const sensors = await Leds.find({});
            const tempSensors = await Temps.find({});
            const sensorsArray = await LedsArray.find({});
            const tempSensorsArray = await TempArray.find({});
            const lightSensors = await Lights.find({});
            const lightSensorsArray = await LightArray.find({});
            const humidSensors = await Humids.find({});
            const humidSensorsArray = await HumidArray.find({});
            const fanSensors = await Fans.find({});
            const fanSensorsArray = await FanArray.find({});
            const curtainsSensors = await Curtains.find({});
            const curtainsArraySensors = await CurtainsArray.find({});

            res.json( { 
                sensors: multipleMongooseToObject(sensors),
                tempSensors: multipleMongooseToObject(tempSensors),
                sensorsArray: multipleMongooseToObject(sensorsArray),
                tempSensorsArray: multipleMongooseToObject(tempSensorsArray), 
                lightSensors: multipleMongooseToObject(lightSensors),
                lightSensorsArray: multipleMongooseToObject(lightSensorsArray),
                humidSensors: multipleMongooseToObject(humidSensors),
                humidSensorsArray: multipleMongooseToObject(humidSensorsArray),
                fanSensors: multipleMongooseToObject(fanSensors),
                fanSensorsArray: multipleMongooseToObject(fanSensorsArray),
                curtainsSensors: multipleMongooseToObject(curtainsSensors),
                curtainsArraySensors: multipleMongooseToObject(curtainsArraySensors)
            });
        } catch (error) { 
            next(error);
        }
    }

    async updateLed (req, res, next) { 
        try { 
            const { action } = req.body;
            console.log('Request body hihi:', req.body);

            if (action == 'updateLed') { 
                const led = await Leds.findOne({ name: "BBC_LED" });
                led.value = led.value == 0 ? 1 : 0;
                await led.save();

                this.mqttClient.publish('khiemtruong0503/feeds/bbc-led', led.value.toString());

                res.json({ success: true, message: 'LED state updated successfully', lightstate: led.value });
            }
            else if (action == 'updateFan') { 
                const fan = await Fans.findOne({ name: "BBC_FAN" });
                fan.value = fan.value == 0 ? 1 : 0;
                await fan.save();
    
                this.mqttClient.publish('khiemtruong0503/feeds/bbc-fan', fan.value.toString());
    
                res.json({ success: true, message: 'FAN state updated successfuly', fanstate: fan.value });
            }
            else if (action == 'updateCurtains') { 
                console.log('inside updateCurtains');
                const curtains = await Curtains.findOne({ name: "BBC_CURTAIN" });
                curtains.value = curtains.value == 0 ? 1 : 0;
                await curtains.save();

                this.mqttClient.publish('khiemtruong0503/feeds/bbc-curtain', curtains.value.toString());

                res.json({ success: true, message: 'CURTAINS state updated successfully', curtainstate: curtains.value });
            }
            else {
                res.status(400).json({ success: false, message: 'LED state failed to update' });
            }
        } catch (error) { 
            console.error('Error updating LED: ', error);
            res.status(500).json({ success: false, message: 'An error occured' });
        }
    }

    // async updateFan (req, res, next) { 
    //     try {
    //         const { action } = req.body;

    //         console.log('Request body hehe:', req.body);
    //         console.log('action: ', action.toString());
    //         if (action == 'updateFan') { 
    //             console.log('\nDa vao updateFan');
    //             const fan = await Fans.findOne({ name: "BBC_FAN" });
    //             fan.value = fan.value == 0 ? 1 : 0;
    //             await fan.save();
    
    //             this.mqttClient.publish('khiemtruong0503/feeds/bbc-fan', fan.value.toString());
    
    //             res.json({ success: true, message: 'FAN state updated successfuly', fanstate: fan.value });
    //         }
    //         else { 
    //             res.status(400).json({ success: false, message: 'FAN state failed to update' });
    //         }
    //     } catch (error) { 
    //         console.error('Error updating FAN: ', error);
    //         res.status(500).json({ success: false, message: 'An error occured' });
    //     }
    // }

    // async updateCurtains (req, res, next) { 
    //     try {
    //         if (action == 'updateCurtains') { 
    //             // const curtains = await Curtains.
    //         }
    //     } catch (error) { 
    //         console.error('Error updating CURTAINS: ', error);
    //         res.status(500).json({ success: false, message: 'An error occured' });
    //     }
    //}
}

module.exports = new dashBoardController(io, mqtt.connect('mqtt://io.adafruit.com', {
    input: input,
    inputArray: inputArray,
    clean: true
}));