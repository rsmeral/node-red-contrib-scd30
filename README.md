# node-red-contrib-scd30

Node-RED node for reading measurements from Sensirion SCD30, the CO2, temperature, and humidity sensor.

Uses [scd30-node](https://github.com/rsmeral/scd30-node).

## Usage in Docker

Use the `--device /dev/i2c-1` parameter in your `docker run` command or add the following to your `docker-compose.yml` file:
```yaml
devices:
  - /dev/i2c-1
```
