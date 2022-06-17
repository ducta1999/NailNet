import { format, isBefore } from "date-fns";

export const formatDate = (date, defaultText) => {
  if (!date) return defaultText;
  return format(date, "DD-MM-YYYY");
};

export const formatDateToSendAPI = (date, defaultText) => {
  if (!date) return defaultText;
  return format(date, "YYYY-MM-DD");
};

export const formatDateStringToSendAPI = (date, defaultText) => {
  var date1 = date.split("/");
  var newDate = date1[1] + "/" + date1[0] + "/" + date1[2];
  return format(newDate, "YYYY-MM-DD");
};

export const checkIsBefore = (date1, date2) => {
  var result = isBefore(date1, date2);

  return result;
};
