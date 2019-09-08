// Loop through an object
module.exports.each = (o,f) => {Object.keys(o).forEach(k => {f(o[k],k,o)})}