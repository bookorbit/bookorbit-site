import { defineConfig } from 'astro/config'
import { unified } from '@astrojs/markdown-remark'
import starlight from '@astrojs/starlight'
import starlightImageZoom from 'starlight-image-zoom'
import starlightLinksValidator from 'starlight-links-validator'
import { remarkMermaid } from './src/plugins/remark-mermaid.mjs'

export default defineConfig({
  site: 'https://bookorbit.app',
  markdown: {
    processor: unified({ remarkPlugins: [remarkMermaid] }),
  },
  vite: {
    optimizeDeps: {
      include: ['mermaid'],
    },
  },
  integrations: [
    starlight({
      title: 'BookOrbit',
      description: 'Documentation for the self-hosted library and reading platform.',
      favicon: '/favicon-96.png',
      editLink: {
        baseUrl: 'https://github.com/bookorbit/bookorbit-site/edit/main/',
      },
      lastUpdated: true,
      plugins: [starlightLinksValidator(), starlightImageZoom()],
      components: {
        MarkdownContent: './src/components/MarkdownContent.astro',
      },
      logo: {
        src: './src/assets/bookorbit-mark.png',
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
            { label: 'How I Use BookOrbit', slug: 'my-workflow' },
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
            { label: 'Book Requests', slug: 'book-requests' },
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
            { label: 'Storyteller Read-Aloud', slug: 'storyteller-read-aloud' },
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
            { label: 'Kokoro Text-to-Speech', slug: 'text-to-speech' },
          ],
        },
        {
          label: 'Admin & Security',
          items: [
            { label: 'Users & Permissions', slug: 'users' },
            { label: 'Account Activity', slug: 'account-activity' },
            { label: 'OIDC / SSO', slug: 'oidc' },
            { label: 'Authentication Proxies', slug: 'auth-proxies' },
          ],
        },
        {
          label: 'Support & Legal',
          items: [
            { label: 'BookOrbit iOS Support', slug: 'support' },
            { label: 'Privacy Policy', slug: 'privacy' },
          ],
        },
      ],
    }),
  ],
})
