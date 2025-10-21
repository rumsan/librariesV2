import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts', 'src/**/*.tsx'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  minify: false,
  treeshake: true,
  external: [
    'react',
    'react-dom',
    'clsx',
    'tailwind-merge',
    '@radix-ui/react-slot',
    'class-variance-authority',
  ],
  esbuildOptions(options: any) {
    options.jsx = 'automatic';
    options.banner = {
      js: '"use client";',
    };
  },
  async onSuccess() {
    // Copy CSS files
    const fs = await import('fs/promises');

    try {
      //await fs.mkdir('dist/styles', { recursive: true });
      // await fs.copyFile('src/styles/globals.css', 'dist/styles/globals.css');
    } catch (error) {
      console.warn('Could not copy CSS files:', error);
    }
  },
});
