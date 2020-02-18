# node-red-contrib-scd30

Node-RED node for reading measurements from Sensirion SCD30, the CO2, temperature, and humidity sensor.

Uses [scd30-node](https://github.com/rsmeral/scd30-node).

## Usage

Find the `scd30` node in the `sensor` category in the palette, and use in your flow.

![SCD30 node](https://github.com/rsmeral/node-red-contrib-scd30/blob/master/scd30-node.png?raw=true)

The node replaces the message payload with an object containing the measured values:
```typescript
{
  co2Concentration: <number>,
  temperature: <number>,
  relativeHumidity: <number>
}
```

### Requirements

The SCD30 must be in continuous measurement mode and a measurement must be available when triggering this node. You can use [scd30-cli](https://github.com/rsmeral/scd30-cli) to set this up:
```
$ scd30-cli start-continuous-measurement
Continuous measurement started.
Ambient pressure compensation deactivated.

$ scd30-cli set-measurement-interval 5
Continuous measurement interval set to 5 seconds.
```

The measurement interval must be shorter than the interval at which you sample the sensor in Node-RED.

The permission to read the I2C bus device (e.g. `/dev/i2c-1`) is required.

## Usage in Docker on Raspberry Pi

When starting the Node-RED container, use these options:
* `--device /dev/i2c-1` – point to the I2C device to which the SCD30 is connected
* `--group-add <id of i2c group>` – make the container process run as a member of the `i2c` group

For example:
```
docker run -d \
  -p 1880:1880 \
  -v /home/pi/.node-red:/data \
  --device /dev/i2c-1 \
  --group-add 998 \
  --name nodered \
  nodered/node-red
```
