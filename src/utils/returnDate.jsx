import moment from "moment";

export const calculateReturnDate = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);

  // Check if the start or end date falls on a weekend
  const isStartWeekend = start.day() === 6 || start.day() === 0; // 6 is Saturday, 0 is Sunday
  const isEndWeekend = end.day() === 6 || end.day() === 0; // 6 is Saturday, 0 is Sunday
  const isEndFriday = end.day() === 5; // 5 is Friday

  // Handle cases based on the start and end dates
  if (isStartWeekend) {
    return {
      error:
        "Start date cannot be on a weekend.",
    };
  }
  if (isEndWeekend) {
    return {
      error:
        "End date cannot be on a weekend.",
    };
  }

  // Calculate return date based on the end date's day of the week
  if (isEndFriday) {
    const returnDate = end.add(3, "days"); // Add 3 days to reach Monday
    return { date: returnDate.format("YYYY-MM-DD") };
  } else {
    const returnDate = end.add(1, "days");
    return { date: returnDate.format("YYYY-MM-DD") };
  }
}
