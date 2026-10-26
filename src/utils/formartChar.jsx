export function toTitleCase(str) {
  if (str === null || str === undefined) return "";

  return String(str)
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function toUpperCaseFirst(str) {
  if (str === null || str === undefined) return "";

  const value = String(str);

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function toUpperCase(str) {
  if (str === null || str === undefined) return "";

  return String(str).toUpperCase();
}

export function toLowerCase(str) {
  if (str === null || str === undefined) return "";

  return String(str).toLowerCase();
}
