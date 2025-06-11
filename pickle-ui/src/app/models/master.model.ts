export interface Master {
  orgs: MasterOrg[];
}

export interface MasterOrg {
  name: string;
  courts: MasterCourt[];
}

export interface MasterCourt {
  id: string;
  name: string;
  orgName: string;
  checked?: boolean;
  start?: string; //'16:00:00' formatted for fullcalendar slotMinTime
  end?: string; //'22:00:00'
}
