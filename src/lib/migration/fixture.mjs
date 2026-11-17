// Synthetic ledger only. Never put a user's financial backup in a test fixture.
export function migrationFixture() {
  return {
    userName: 'Migration Test', currency: '₹', theme: 'dark', hasSeenOnboarding: true,
    accounts: [
      { id: 'bank', label: 'Everyday', openingBalance: 1000, icon: '🏦' },
      { id: 'cash', label: 'Cash', openingBalance: -10, icon: '💵' },
    ],
    categories: {
      expense: [
        { id: 'food', label: 'Coffee & Lunch', iconType: 'icon', iconName: 'fastfood', color: '#FF9500', folder: 'My essentials', hidden: true },
        { id: 'subscriptions', label: 'Subscriptions', iconType: 'icon', iconName: 'receipt', color: '#AF52DE' },
      ],
      income: [{ id: 'paycheck', label: 'Paycheck', iconType: 'icon', iconName: 'money', color: '#30D158' }],
    },
    transactions: [
      { id: 'tx_income', title: 'Pay day', amount: 500, type: 'income', category: 'paycheck', accountId: 'bank', date: '2026-11-01T12:34:56.789Z', notes: 'Keep this note 👋' },
      { id: 'tx_lunch', title: 'Lunch', amount: '12.25', type: 'expense', category: 'food', accountId: 'bank', date: '2026-11-02T18:05:00+05:30' },
      { id: 'tx_transfer', title: 'Cash withdrawal', amount: 100, type: 'transfer', category: 'transfer', accountId: 'bank', toAccountId: 'cash', date: 1793707200000 },
      { id: 'tx_subscription', title: 'Music', amount: 9.99, type: 'expense', category: 'subscriptions', accountId: 'bank', date: '2026-11-05T00:00:00Z', subscriptionId: 'sub_music', previousBilling: '2026-11-05' },
    ],
    subscriptions: [{ id: 'sub_music', name: 'Music', amount: 9.99, cycle: 'monthly', nextBilling: '2026-12-05', account: 'bank', category: 'subscriptions', autoDeduct: true, isPaused: false, isTrial: true, status: 'active', icon: { type: 'icon', value: 'music' }, color: '#00AABB' }],
    budget: { amount: 300, period: 'monthly', startDay: 3, isActive: true, categoryBudgets: { food: 50 } },
    goals: [{ id: 'goal_trip', name: 'Holiday', target: 2500 }],
    cardShape: 'rounded', topGradientColor: '#001A99', enableGradient: true,
  };
}
