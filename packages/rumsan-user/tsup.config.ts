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
    '@casl/ability',
    '@nestjs/common',
    '@nestjs/config',
    '@nestjs/core',
    '@nestjs/event-emitter',
    '@nestjs/jwt',
    '@nestjs/passport',
    '@nestjs/swagger',
    '@paralleldrive/cuid2',
    '@prisma/client',
    '@rumsan/extensions',
    '@rumsan/prisma',
    'axios',
    'class-transformer',
    'class-validator',
    'passport-jwt',
    'viem',
  ],
});
