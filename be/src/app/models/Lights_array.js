const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const lightArray = mongoose.Schema ({ 
    name: {type: String, required: true}, 
    values: [{type: Number, required: true}],
    dateValues: [{type: String, required: true}]
});

module.exports = mongoose.model('LIGHT_ARRAY', lightArray); // LIGHT_ARRAY is the name field of the record in database
