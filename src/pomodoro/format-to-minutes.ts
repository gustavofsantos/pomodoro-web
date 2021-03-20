export const formatToMinutes = (timeSec: number) => {
  const minutes = Math.floor(timeSec / 60);
  const seconds = timeSec - minutes * 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};
