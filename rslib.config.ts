import { defineConfig } from '@rslib/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2021',
      dts: true,
    },
    {
      format: 'cjs',
      syntax: 'es2021',
    },
  ],
  source: {
    entry: {
      index: './src',
    },
  },
  output: { target: 'web' },
  plugins: [pluginReact()],
});
