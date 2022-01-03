/**
 * @type {import('vite').UserConfig}
 */
const config = {
  root: 'src',
  base: '', // needed to get relative paths in docs/index.html
  build: {
    outDir: '../docs',
    emptyOutDir: true, // needed to delete content in outDir because it is outside root
    sourcemap: true,
    rollupOptions: {
      output: {
        dir: 'docs' // needed to get relative paths in docs/index.html
      }
    }
  }
}

export default config
