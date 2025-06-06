//for backend storage
export const dateFormat = 'YYYY-MMM-DD';
export const dateTimeFormat = 'YYYY-MM-DDTHH:mm:ss';

//simple, easily readable
export const simpleTimeFormat = 'h a';
export const optionsTime: Intl.DateTimeFormatOptions = { hour: 'numeric', hour12: true };
export const optionsDate: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };

//fullcalendar time format
export const fcTimeFormat = 'HH:mm:ss';