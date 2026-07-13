import { defineConfig } from 'astro/config'
import { unified } from '@astrojs/markdown-remark'
import starlight from '@astrojs/starlight'
import vue from '@astrojs/vue'
import starlightImageZoom from 'starlight-image-zoom'
import starlightLinksValidator from 'starlight-links-validator'

export default defineConfig({
  site: 'https://bookorbit.app',
  markdown: {
    processor: unified(),
  },
  integrations: [
    vue(),
    starlight({
      title: 'BookOrbit',
      description: 'Documentation for the self-hosted library and reading platform.',
      favicon: '/favicon.svg',
      editLink: {
        baseUrl: 'https://github.com/bookorbit/bookorbit-site/edit/main/',
      },
      lastUpdated: true,
      plugins: [starlightLinksValidator(), starlightImageZoom()],
      logo: {
        src: './src/assets/bookorbit-mark.svg',
      },
      customCss: ['./src/styles/theme.css', './src/styles/content.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/bookorbit/bookorbit',
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'What is BookOrbit?', slug: 'what-is-bookorbit' },
            { label: 'Installation', slug: 'installation' },
            { label: 'Creating a Library', slug: 'creating-a-library' },
            { label: 'Adding Books', slug: 'adding-books' },
          ],
        },
        {
          label: 'Building Your Library',
          items: [
            { label: 'Library File Structure', slug: 'library-file-structure' },
            { label: 'Book Dock', slug: 'book-dock' },
            { label: 'Migration', slug: 'migration' },
          ],
        },
        {
          label: 'Browsing & Reading',
          items: [
            { label: 'Dashboard', slug: 'dashboard' },
            { label: 'Book Details & Viewer', slug: 'book-details' },
            { label: 'Table View', slug: 'table-view' },
            { label: 'Reader', slug: 'reader' },
            { label: 'Annotations & Highlights', slug: 'annotations' },
            { label: 'Display', slug: 'appearance' },
          ],
        },
        {
          label: 'Organizing',
          items: [
            { label: 'Collections', slug: 'collections' },
            { label: 'Smart Scopes', slug: 'smart-scopes' },
            { label: 'Metadata', slug: 'metadata' },
          ],
        },
        {
          label: 'Sync & Integrations',
          items: [
            { label: 'Kobo Sync', slug: 'kobo' },
            { label: 'KOReader Sync', slug: 'koreader' },
            { label: 'KOReader Plugin', slug: 'koreader-plugin' },
            { label: 'Hardcover Sync', slug: 'hardcover' },
            { label: 'OPDS', slug: 'opds' },
            { label: 'Email', slug: 'email' },
          ],
        },
        {
          label: 'Admin & Security',
          items: [
            { label: 'Users & Permissions', slug: 'users' },
            { label: 'Account Activity', slug: 'account-activity' },
            { label: 'OIDC / SSO', slug: 'oidc' },
          ],
        },
      ],
    }),
  ],
})
