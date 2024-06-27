const mongoose = require('mongoose');

const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const TempArray = new Schema ({ 
    name: {type: String, required: true},
    values: [{type: Number, required: true}], // array of temp' values for the last 12 updates
    dateValues: [{type: String, required: true}] // array of dates of temp' values for the last 12 updates
});

module.exports = mongoose.model('TEMP_ARRAY', TempArray); // TEMP_ARRAY is the name field of the record in database