export enum COLORS {
  CONFIRM = "#2D9CDB",
  CANCEL = "#EB5757",
  WHITE = "#FFFFFF",
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
