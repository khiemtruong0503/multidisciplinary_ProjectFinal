const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const FanArray = mongoose.Schema ({ 
    name: {type: String, required: true},
    values: [{type: String, required: true}]
});

module.exports = mongoose.model('FAN_ARRAY', FanArray);