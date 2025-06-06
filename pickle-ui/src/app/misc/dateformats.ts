//for backend storage
export const dateFormat = 'YYYY-MMM-DD';
export const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss';

//simple, easily readable
export const optionsTime: Intl.DateTimeFormatOptions = { hour: 'numeric', hour12: true };
export const optionsDate: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };