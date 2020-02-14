var SCD30 = require('scd30-node').SCD30;

var NODE_TYPE = 'scd30-config';

module.exports = function (RED) {
  function SCD30ConfigNode(config) {
    RED.nodes.createNode(this, config);

    this.busNumber = config.busNumber;

    this.scd30 = SCD30.connect(busNumber);

    this.on('close', function () {
      this.scd30.close().then(done);
    });
  }
  RED.nodes.registerType(NODE_TYPE, SCD30ConfigNode);
};
