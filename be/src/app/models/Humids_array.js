const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const HumidArray = mongoose.Schema ({
    name: {type: String, required: true},
    values: [{type: Number, required: true}],
    dateValues: [{type: String, required: true}]
});

module.exports = mongoose.model('HUMID_ARRAY', HumidArray);