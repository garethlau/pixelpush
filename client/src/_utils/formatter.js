export function formatFileSize(size) {
  return !isNaN(size)
    ? size > 1000000
      ? `${(size / (1024 * 1024)).toFixed(1)} MB`
      : `${(size / 1024).toFixed(1)} KB`
    : "";
}

export function formatDate(dateStr) {
  const localeDate = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  return new Date(dateStr).toLocaleDateString(undefined, localeDate);
}
