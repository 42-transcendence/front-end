export function byteToReadable(numberOfBytes: number) {
    const units = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    const exponent = Math.min(
        Math.floor(Math.log(numberOfBytes) / Math.log(1024)),
        units.length - 1,
    );

    const approx = numberOfBytes / (1024 ** exponent);
    const output =
        exponent === 0
            ? `${numberOfBytes} bytes`
            : `${approx.toFixed(3)} ${
                  units[exponent]
              } (${numberOfBytes} bytes)`;

    return output;
}
