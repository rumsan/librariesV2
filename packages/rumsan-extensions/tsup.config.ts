import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts', 'src/**/*.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  onSuccess: 'echo ">>>=======================================<<<"',
  // Ensure we don't bundle any of the peer dependencies
  external: [
    '@nestjs/common',
    '@nestjs/swagger',
    '@prisma/client',
    '@rumsan/prisma',
    '@rumsan/sdk',
    'class-transformer',
    'class-validator',
    'http-status-codes',
    'rxjs',
  ],
});
