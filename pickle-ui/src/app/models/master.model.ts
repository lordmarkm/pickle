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
  org: string;
}
