
// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Project JobQuest Documentation',
  tagline: 'A Scalable, Clutter-Free Job Aggregation Platform',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://jobquest-docs.example.com',
  baseUrl: '/',

  organizationName: 'your-github-org',
  projectName: 'jobquest-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/haRsh-cse-rgb/Documentation/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/jobquest-social-card.jpg',
      navbar: {
        title: 'JobQuest Docs',
        logo: {
          alt: 'JobQuest Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/haRsh-cse-rgb/Documentation',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Introduction',
                to: '/docs/introduction',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/jobquest',
              },
              {
                label: 'X',
                href: 'https://x.com/jobquest',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/haRsh-cse-rgb/Documentation',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} JobQuest, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      mermaid: {
        theme: { light: 'neutral', dark: 'forest' },
      },
    }),
};

export default config;
