export enum COLORS {
  CONFIRM = "#2D9CDB",
  CANCEL = "#EB5757",
  WHITE = "#FFFFFF",
  BACKGROUND = "#FAFAFA",
  GRAY6 = "#F2F2F2",
  BLACK = "#2D3436", // BLACK
}

// Reusable Buttons
export enum ButtonTags {
  CONFIRM = "confirm",
  CANCEL = "cancel",
}

export const constButtons = {
  [ButtonTags.CONFIRM]: {
    color: COLORS.CONFIRM,
    backgroundColor: COLORS.CONFIRM,
  },
  [ButtonTags.CANCEL]: {
    color: COLORS.CANCEL,
    backgroundColor: COLORS.CANCEL,
  },
};

// Reusable Graph
export enum GraphTags {
  PIE = "pie",
  BAR = "bar",
  LINE = "line",
}

export interface GraphDM {
  type: string;
  value: number;
}

export function getGraphTag(tag: string) {
  switch (tag) {
    case "pie":
      return GraphTags.PIE;
    case "bar":
      return GraphTags.BAR;
    case "line":
      return GraphTags.LINE;
    default:
      return GraphTags.PIE;
  }
}

export function getEndpoint(url: string) {
  if (url.includes("Weapons%20Distribution"))
    return "/api/crimes/statistics/weapons";
  if (url.includes("Weekday%20Distribution"))
    return "/api/crimes/statistics/weekdays";
  if (url.includes("Hour%20Distribution"))
    return "/api/crimes/statistics/hours/line";
  if (url.includes("Description%20Distribution"))
    return "/api/crimes/statistics/descriptions";
  if (url.includes("District%20Distribution"))
    return "/api/crimes/statistics/districts";
  if (url.includes("Month%20Distribution"))
    return "/api/crimes/statistics/months/pie";
  return "";
}

export function getCardTitle(title: string) {
  if (title === "Weekday Distribution")
    return "Distribution of Crime By Week Days";
  if (title === "Hour Distribution") return "Trend of crimes over time of day";
  if (title === "Description Distribution")
    return "Distribution of Crime by Description";
  if (title === "District Distribution")
    return "Distribution of Crime by Districts";
  if (title === "Month Distribution") return "Distribution of Crime by Months";
  return title;
}
