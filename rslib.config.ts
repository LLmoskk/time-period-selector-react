import { defineConfig } from '@rslib/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2021',
      bundle: true,
      dts: true,
    },
    {
      format: 'cjs',
      syntax: 'es2021',
      bundle: true,
      dts: true,
    },
  ],
  output: { target: 'web' },
  plugins: [pluginReact()],
});
