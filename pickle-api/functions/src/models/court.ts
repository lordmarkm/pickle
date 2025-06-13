export interface Court {
  id?: string;
  image?: string;
  org?: string;
  orgName?: string;
  name?: string;
  start?: string; //'16:00:00' formatted for fullcalendar slotMinTime
  end?: string; //'22:00:00'
  owner?: string;
}