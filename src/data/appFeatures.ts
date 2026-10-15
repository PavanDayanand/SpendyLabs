// Existing widget layouts and registered Siri actions.
export const widgetGuides = [
  {
    name: "Today",
    sizes: ["Small", "Medium", "Large"],
    description:
      "Today’s recorded spending and seven-day context. The medium size becomes a weekly pulse; the large size shows a monthly brief. You can also edit its focus to a budget or category.",
  },
  {
    name: "Budget room",
    sizes: ["Small"],
    description: "Remaining room, budget progress, and days left in the cycle.",
  },
  {
    name: "Quick actions",
    sizes: ["Small", "Medium"],
    description:
      "Add, Scan, and Trends. The medium size also shows today’s recorded spending.",
  },
  {
    name: "Spending Pulse",
    sizes: ["Medium"],
    description:
      "Today’s total beside the last seven days of recorded spending.",
  },
  {
    name: "Where It Went",
    sizes: ["Medium"],
    description: "Your top three spending categories for this month.",
  },
  {
    name: "Monthly Brief",
    sizes: ["Large"],
    description:
      "This month’s total and comparison, the seven-day rhythm, top category, and budget room.",
  },
  {
    name: "Lock Screen",
    sizes: ["Circular", "Rectangular", "Inline"],
    description:
      "A compact today total on the Lock Screen, available in circular, rectangular, and inline styles.",
  },
];
export const siriActions = [
  {
    name: "Add Expense",
    phrase: "Add expense in Spendy",
    result:
      "Siri asks for the category and amount when needed. Spendy records the expense and returns a confirmation.",
  },
  {
    name: "Add Income",
    phrase: "Add income in Spendy",
    result:
      "Record an income entry with a category and amount through the same system flow.",
  },
  {
    name: "Log Transaction",
    phrase: "Log transaction in Spendy",
    result:
      "Choose expense or income, category, and amount. Details already provided do not need to be requested again.",
  },
  {
    name: "Quick Add",
    phrase: "Quick add in Spendy",
    result: "Open Spendy’s amount keypad to add an entry in the app.",
  },
  {
    name: "Scan Receipt",
    phrase: "Scan a receipt in Spendy",
    result:
      "Open the receipt camera. Review the extracted details before saving.",
  },
  {
    name: "Today’s Spending",
    phrase: "How much did I spend today in Spendy",
    result: "Get today’s recorded expense total through the system shortcut.",
  },
  {
    name: "Monthly Spending",
    phrase: "How much did I spend this month in Spendy",
    result: "Get recorded spending for the current month.",
  },
  {
    name: "Budget Room",
    phrase: "How much budget is left in Spendy",
    result:
      "Check remaining room and days left in the budget cycle, or find out if you are over the limit.",
  },
];
