var NODE_TYPE = 'read-measurement';

module.exports = function (RED) {
  function ReadMeasurementNode(config) {
    RED.nodes.createNode(this, config);

    this.on('input', function (msg, send, done) {
      var scd30Promise = RED.nodes.getNode(config.scd30Config).scd30;

      scd30Promise
        .then(function (scd30) {
          return scd30.readMeasurement();
        })
        .then(function (measurement) {
          msg.payload = measurement;
          send(msg);
        })
        .then(done)
        .catch(done);
    })
  }

  RED.nodes.registerType(NODE_TYPE, ReadMeasurementNode);
};
