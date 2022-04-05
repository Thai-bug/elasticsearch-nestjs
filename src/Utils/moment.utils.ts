import * as moment from 'moment';
import 'moment-timezone';

const defaultTimeZone = 'Asia/Ho_Chi_Minh';

export const getCurrentTime = () =>
  moment().tz(defaultTimeZone).format('HH:mm:ss DD/MM/YYYY');

export const convertToMoment = (
  date: string,
  format: string = 'DD/MM/YYYY',
) => {
  return moment(date, format).tz(defaultTimeZone);
};

export const getMoment = (
  type: string = 'start',
  timeType: moment.unitOfTime.StartOf = 'day',
) => {
  let result = null;
  switch (type) {
    case 'start':
      result = moment().startOf(timeType);
      break;
    default:
      result = moment().endOf(timeType);
      break;
  }
  return result;
};

export const isValidDate = (date: string, format: string = 'DD/MM/YYYY') => {
  const result = moment(date, format);
  return result.isValid();
};

export const isBefore = (
  date: string,
  comparedDate: moment.Moment,
  format = 'DD/MM/YYYY',
  type: moment.unitOfTime.StartOf = 'day',
) => {
  return moment(date, format).isBefore(comparedDate, type);
};

export const isAfter = (
  date: string,
  comparedDate: moment.Moment,
  format = 'DD/MM/YYYY',
  type: moment.unitOfTime.StartOf = 'day',
) => {
  return moment(date, format).isAfter(comparedDate, type);
};
