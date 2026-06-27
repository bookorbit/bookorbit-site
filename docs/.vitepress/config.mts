import { defineConfig } from 'vitepress'
import { resolve } from 'node:path'
import { searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  title: "BookOrbit",
  description: "Self-hostable book and library management with Kobo support.",
  vite: {
    optimizeDeps: {
      exclude: [
        '@nolebase/vitepress-plugin-enhanced-readabilities/client',
        'vitepress',
        '@nolebase/ui',
      ],
    },
    ssr: {
      noExternal: [
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/ui',
      ],
    },
    server: {
      fs: {
        allow: [
          searchForWorkspaceRoot(process.cwd()),
          resolve(process.cwd(), '..')
        ]
      }
    }
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/what-is-bookorbit' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'What is BookOrbit?', link: '/what-is-bookorbit' },
          { text: 'Installation', link: '/installation' },
          { text: 'Creating a Library', link: '/creating-a-library' },
          { text: 'Users & Permissions', link: '/users' },
          { text: 'Dashboard', link: '/dashboard' },
        ]
      },
      {
        text: 'Building Your Library',
        items: [
          { text: 'Library File Structure', link: '/library-file-structure' },
          { text: 'Adding Books', link: '/adding-books' },
          { text: 'Book Dock', link: '/book-dock' },
          { text: 'Migration', link: '/migration' },
        ]
      },
      {
        text: 'Browsing & Reading',
        items: [
          { text: 'Book Details & Viewer', link: '/book-details' },
          { text: 'Table View', link: '/table-view' },
          { text: 'Reader', link: '/reader' },
          { text: 'Annotations & Highlights', link: '/annotations' },
          { text: 'Display', link: '/appearance' },
        ]
      },
      {
        text: 'Organizing',
        items: [
          { text: 'Collections', link: '/collections' },
          { text: 'Smart Scopes', link: '/smart-scopes' },
          { text: 'Metadata', link: '/metadata' },
        ]
      },
      {
        text: 'Sync & Integrations',
        items: [
          { text: 'Kobo Sync', link: '/kobo' },
          { text: 'KOReader Sync', link: '/koreader' },
          { text: 'KOReader Plugin', link: '/koreader-plugin' },
          { text: 'Hardcover Sync', link: '/hardcover' },
          { text: 'OPDS', link: '/opds' },
          { text: 'Email', link: '/email' },
        ]
      },
      {
        text: 'Admin & Security',
        items: [
          { text: 'OIDC / SSO', link: '/oidc' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/neonsolstice/bookorbit' }
    ],

    search: {
      provider: 'local'
    }
  }
})
