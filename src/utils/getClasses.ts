export const getClasses = (classes: unknown[]) =>
  classes
    .filter((item) => item !== "")
    .join(" ")
    .trim();
