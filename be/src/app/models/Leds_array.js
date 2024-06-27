const mongoose = require('mongoose');

const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const LedArray = new Schema ({ 
    name: {type: String, required: true},
    values: [{type: mongoose.Types.Decimal128, required: true}] // array of leds' values for the last 12 updates
});

module.exports = mongoose.model('LED_ARRAY', LedArray);