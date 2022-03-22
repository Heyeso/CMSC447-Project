export enum COLORS {
  CONFIRM = "#2D9CDB",
  CANCEL = "#EB5757",
  WHITE = "#FFFFFF",
  GRAY6 = "#F2F2F2",
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
