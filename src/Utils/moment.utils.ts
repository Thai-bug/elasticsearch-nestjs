import * as moment from 'moment';
import 'moment-timezone';

const defaultTimeZone = 'Asia/Ho_Chi_Minh';

export const getCurrentTime = () =>
  moment().tz(defaultTimeZone).format('HH:mm:ss DD/MM/YYYY');
