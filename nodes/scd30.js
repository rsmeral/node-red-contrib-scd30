const SCD30 = require("scd30-node").SCD30;

var NODE_TYPE = "scd30";

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  });
}

const sleep = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const SCD30Initializer = function (RED) {
  function SCD30Node(config) {
    this.scd30 = null;

    const stopContinuous = async (scd30) => {
      try {
        await scd30.stopContinuousMeasurement();
      } catch (e) {
        this.log("Continuous measurement already stopped");
      }
    };

    const startContinuous = async (scd30) => {
      try {
        await scd30.startContinuousMeasurement();
      } catch (e) {
        this.warn("Continuous measurement already on");
      }
    };

    const setMeasurementInterval = async (scd30, interval) => {
      try {
        await scd30.setMeasurementInterval(interval);
      } catch (e) {
        this.error("Got an error while setting measurement interval");
      }
    };

    const setAltitudeCompensation = async (scd30, altitude) => {
      try {
        await scd30.setAltitudeCompensation(altitude);
      } catch (e) {
        this.error("Got an error while setting altitude compensation");
      }
    };

    const setTempOffset = async (scd30, offset) => {
      try {
        await scd30.setTemperatureOffset(Math.round(offset * 100));
      } catch (e) {
        this.error("Got an error while setting temperature offset");
      }
    };

    const setAsc = async (scd30, ascEnabled) => {
      try {
        await scd30.setAutomaticSelfCalibration(ascEnabled);
      } catch (e) {
        this.error("Got an error while setting automatic self-calibration");
      }
    };

    const getConnection = async () => {
      if (!this.scd30) {
        this.scd30 = await SCD30.connect(Number(config.busNumber));
        await stopContinuous(this.scd30);
        await setTempOffset(this.scd30, config.tempOffset);
        await setAsc(this.scd30, config.asc);
        await setMeasurementInterval(this.scd30, config.measurementInterval);
        await setAltitudeCompensation(this.scd30, config.altitude);
        await startContinuous(this.scd30);
      }
      return this.scd30;
    };

    RED.nodes.createNode(this, config);

    this.on("input", async (msg, send, done) => {
      try {
        const scd30 = await getConnection();

        const isDataReady = await scd30.isDataReady();
        if (!isDataReady) {
          this.warn("Data not ready");
          done();
          return;
        }

        const measurement = await scd30.readMeasurement();

        send({ topic: "scd30", payload: measurement });

        this.status({
          fill: "green",
          shape: "dot",
          text: `${Math.round(
            measurement.co2Concentration,
          )} ppm at ${formatDate(new Date())}`,
        });
        done();
      } catch (e) {
        this.error("Caught error");
        this.error(e);
        this.status({ fill: "red", shape: "ring", text: "Error" });
        done(e);
      }
    });
  }

  RED.nodes.registerType(NODE_TYPE, SCD30Node);
};

module.exports = SCD30Initializer;
