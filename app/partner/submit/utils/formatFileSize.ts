export function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return "0 bytes";
  }

  const units = ["bytes", "KB", "MB", "GB"];
  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  const value =
    bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`;
}