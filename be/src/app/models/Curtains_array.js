const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const CurtainArray = mongoose.Schema ({
    name: {type: String, required: true},
    values: [{type: String, required: true}]
});

module.exports = mongoose.model('CURTAIN_ARRAY', CurtainArray);