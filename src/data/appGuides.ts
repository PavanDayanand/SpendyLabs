// Plain copy, kept separate from the component so it is easy to edit.
export const appGuides = [
  {
    name: "Transactions",
    title: "Start with the everyday.",
    description:
      "Your recorded transactions are the starting point for everything Spendy shows you.",
    steps: [
      {
        title: "Add an expense or income",
        text: "Tap Add, choose the type, enter the amount, then pick a category and account.",
      },
      {
        title: "Keep the useful details",
        text: "Set the date and add a note when you need one. Review the entry before saving.",
      },
      {
        title: "Find it again",
        text: "Open See all from Recent activity. Search your transactions or narrow the list with account and category filters.",
      },
    ],
    note: "A transfer moves money between accounts. It is kept separate from expense and income totals.",
  },
  {
    name: "Budgets",
    title: "Give your spending some room.",
    description:
      "Choose a limit that fits your week or month. Spendy follows the cycle you set, rather than assuming it starts on the first.",
    steps: [
      {
        title: "Set your cycle",
        text: "Open Budget, enter your limit, choose weekly or monthly, and select a start day.",
      },
      {
        title: "Watch the room left",
        text: "Recorded expenses in that cycle reduce your remaining budget. The page also shows how many days remain.",
      },
      {
        title: "Check your pace",
        text: "Look at daily room and the spending projection. Edit the budget when your plan changes; optional reminders can flag 80% and 100% of the limit.",
      },
    ],
    note: "Daily room is a planning guide, not a spending restriction. It changes as you record expenses and the days remaining change.",
  },
  {
    name: "Subscriptions",
    title: "Keep the repeat things in view.",
    description:
      "Track your commitments and renewal dates in one place, without handing over a bank login.",
    steps: [
      {
        title: "Add the subscription",
        text: "Open Subscriptions and tap Add. Enter the price, billing cycle, and next renewal date.",
      },
      {
        title: "See what comes next",
        text: "Check renewals due today and upcoming dates. Home Insights brings time-sensitive renewals into view too.",
      },
      {
        title: "Confirm the payment",
        text: "Record a payment once it is confirmed. You can manage auto-logging, pause the subscription, or edit its details as needed.",
      },
    ],
    note: "A renewal date means a charge is expected. It does not prove money left your account. An unrecorded renewal is a prompt to check the payment.",
  },
  {
    name: "Analytics",
    title: "See where the numbers lead.",
    description:
      "Turn your recorded entries into a view of spending, categories, and cash flow.",
    steps: [
      {
        title: "Choose a period",
        text: "Open Analytics and select the date range you want to understand.",
      },
      {
        title: "Narrow the view",
        text: "Use the filters to focus on relevant records. Category spending shows totals and expense counts; View all opens the full breakdown.",
      },
      {
        title: "Read the context",
        text: "Open Spendy Insights for the changes, patterns, and budget context supported by your recorded history.",
      },
    ],
    note: "Income and expenses have separate totals. Moving money between accounts is not treated as new spending.",
  },
];
