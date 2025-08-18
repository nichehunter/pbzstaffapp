import moment from "moment";

export function LeaveBalance(props) {
  const { dataId } = props;

  return dataId;
}

export function countBusinessDays(startDate, endDate) {
  const businessDays = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    // Check if the current day is not a weekend (Saturday or Sunday)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      businessDays.push(moment(new Date(currentDate)).format("yyyy-MM-DD"));
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return businessDays;
}
