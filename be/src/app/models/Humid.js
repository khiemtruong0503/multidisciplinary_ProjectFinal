const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const Humid = mongoose.Schema ({
    name: {type: String, required: true}, 
    humid: {type: Number, required: true}
});

module.exports = mongoose.model('BBC_HUMIDITY', Humid);