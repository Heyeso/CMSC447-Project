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

