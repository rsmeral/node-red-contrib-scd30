var NODE_TYPE = 'read-measurement';

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour12: false,
    hour: 'numeric',
    minute: 'numeric'
  });
}

module.exports = function (RED) {
  function ReadMeasurementNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    this.on('input', function (msg, send, done) {
      var scd30Promise = RED.nodes.getNode(config.scd30Config).scd30;

      scd30Promise
        .then(function (scd30) {
          return scd30.readMeasurement();
        })
        .then(function (measurement) {
          msg.payload = measurement;
          send(msg);
          node.status({fill: 'green', shape: 'dot', text: `${Math.round(measurement.co2Concentration)} ppm at ${formatDate(new Date())}`});
          done();
        })
        .catch(function(err) {
          node.status({fill: 'red', shape: 'ring', text: 'Error'});
          done(err);
        });
    })
  }

  RED.nodes.registerType(NODE_TYPE, ReadMeasurementNode);
};
