// Existing widget layouts and registered Siri actions.
export const widgetGuides = [
  {
    name: "Today",
    size: "SMALL",
    description:
      "Today's total and a seven-day rhythm. Tap to open Home, or edit the widget’s focus to show your budget, week, or category.",
  },
  {
    name: "Budget room",
    size: "SMALL",
    description:
      "Keep remaining room, days left, and daily pace close. Tap through to your budget when you need the detail.",
  },
  {
    name: "Quick actions",
    size: "SMALL · MEDIUM",
    description:
      "Three shortcuts: Add, Scan, and Trends. The medium layout also shows today’s spending.",
  },
  {
    name: "Spending Pulse",
    size: "MEDIUM",
    description:
      "A seven-day view of your spending rhythm, right on your Home Screen.",
  },
  {
    name: "Where It Went",
    size: "MEDIUM",
    description:
      "A quick look at your category spending, without opening the full breakdown.",
  },
  {
    name: "Monthly Brief",
    size: "LARGE",
    description:
      "A larger overview of the month, including spending, categories, and budget context.",
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
