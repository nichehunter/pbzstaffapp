export function toTitleCase(str) {
  const titleCase = str?.toLowerCase()
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  return titleCase;
}

export function toUpperCaseFirst(str) {
  const titleCase = str?.charAt(0).toUpperCase() + str.slice(1);

  return titleCase;
}

export function toUpperCase(str) {
  const upperCase = str?.toUpperCase();

  return upperCase;
}

export function toLowerCase(str) {
  const lowerCase = str?.toLowerCase();

  return lowerCase;
}
