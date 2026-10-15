// Checked against the app's facts extractor, comparison helper and insight rules.
export const insightGuides = [
  {
    title: "Your recorded spending",
    text: "Spendy adds expense entries within the selected dates and account or category scope. Income is counted separately, and transfers are excluded from spending. Future-dated expenses are not counted as spending to date.",
    example:
      "If you log ₹500 of groceries and transfer ₹2,000 between accounts, recorded spending is ₹500.",
  },
  {
    title: "A fair comparison",
    text: "An ongoing period is compared with the same elapsed part of the previous period, including the time of day. A completed period uses its completed comparison range. If there is no suitable history, Spendy avoids presenting a percentage increase from zero.",
    example:
      "₹3,000 through the 12th compared with ₹2,400 through the same point last month means ₹600 more, or 25% higher recorded spending.",
  },
  {
    title: "Category changes and patterns",
    text: "Expenses are grouped by category and compared with that category’s earlier spending. The rules consider the size of a change and how many entries support it. Broader trends need more history; an isolated entry is not enough for every pattern.",
    example:
      "A rise in restaurant spending can help explain an overall increase. A day with no entries means no spending was recorded, not proof you spent nothing.",
  },
  {
    title: "Budget room and pace",
    text: "Your active budget uses expenses in its own weekly or monthly cycle. Remaining room comes from the limit after recorded spending; daily room spreads what remains across the days left. Projections extend the average recorded pace so far across the cycle. Spendy also checks how much of the limit you have used against how much of the cycle has passed.",
    example:
      "₹4,000 remaining with 10 days left gives ₹400 per day. A large one-off expense can change the projection; it is an estimate, not a prediction of your next purchase.",
  },
  {
    title: "Renewals and commitments",
    text: "Renewal attention checks active subscriptions, due dates, and linked recorded payments. Paused or cancelled subscriptions are excluded. Monthly commitment estimates normalise yearly prices across 12 months and weekly prices to an approximate month; trials are excluded from paid commitments in the insight calculation.",
    example:
      "A ₹1,200 yearly subscription contributes ₹100 to an estimated monthly commitment. Its actual bill is still due according to its billing cycle.",
  },
  {
    title: "What appears first",
    text: "Home gives time-sensitive items their own priority: renewals today, payment checks, and budget limits. Upcoming renewals remain in the full list. Other insights are ranked by importance, supporting evidence, relevance, size of the change, and whether you can act on them. Overlapping and repeatedly shown observations are reduced.",
    example:
      "An expected renewal today can lead the Home preview without replacing tomorrow’s renewals in the full insight list.",
  },
];
