export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  navItems: [
    {
      label: 'Balances',
      href: '/balances',
    },
    {
      label: 'Leaderboard',
      href: '/leaderboard',
    },
  ],
  navMenuItems: [
    {
      label: 'Logout',
      href: '/logout',
    },
  ],
};
