import { GraphDM, GraphTags } from "./constants";
// Data Models
export interface QuickViewDM extends QuickViewVM {
  tag: GraphTags;
}

// View Models
export interface QuickViewVM {
  title: string;
  data: GraphDM[];
}

export interface MapDataVM {
  CrimeCode: string;
  CrimeDate: {
    dayOfWeek: number;
    hour: number;
    month: number;
    year: number;
  }
  Date: string;
  Description: string;
  District: string;
  GeoLocation: {
    Latitude: number;
    Longitude: number;
  }
  Inside_Outside: string;
  Location: string;
  Neighborhood: string;
  Post: number;
  Premise: string;
  RowID: number;
  Shape: string;
  Total_Incidents: number;
  VRIName: string;
  Weapon: string;
}

