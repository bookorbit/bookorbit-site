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
          { text: 'Dashboard', link: '/dashboard' },
          { text: 'Users & Permissions', link: '/users' },
        ]
      },
      {
        text: 'Book Management',
        items: [
          { text: 'Library File Structure', link: '/library-file-structure' },
          { text: 'Adding Books', link: '/adding-books' },
          { text: 'Book Details & Viewer', link: '/book-details' },
          { text: 'Book Dock', link: '/book-dock' },
        ]
      },
      {
        text: 'Organizing Your Library',
        items: [
          { text: 'Collections', link: '/collections' },
          { text: 'Smart Scopes', link: '/smart-scopes' },
          { text: 'Table View', link: '/table-view' },
        ]
      },
      {
        text: 'Import & Migration',
        items: [
          { text: 'Migration', link: '/migration' },
        ]
      },
      {
        text: 'Settings',
        items: [
          { text: 'Metadata', link: '/metadata' },
          { text: 'Appearance', link: '/appearance' },
          { text: 'Reader', link: '/reader' },
          { text: 'Kobo Sync', link: '/kobo' },
          { text: 'Email', link: '/email' },
          { text: 'OPDS', link: '/opds' },
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
