const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const Curtain = mongoose.Schema ({
    name: {type: String, required: true},
    value: {type: String, required: true}
});

module.exports = mongoose.model('BBC_CURTAIN', Curtain);