import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { visualizer } from 'rollup-plugin-visualizer';
import pkg from './package.json' with { type: 'json' };

// Shared plugins for all formats
const basePlugins = [
  peerDepsExternal(),
  resolve(),
  commonjs(),
  typescript({
    tsconfig: './tsconfig.json',
    useTsconfigDeclarationDir: true,
  }),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**',
    extensions: ['.ts', '.tsx'],
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript'
    ],
  }),
];

// Shared external dependencies
const external = ['react', 'react-dom', 'styled-components'];

// CSS processing plugin
const cssPlugin = postcss({
  extract: 'style.css',
  modules: true,
  autoModules: true,
  minimize: true,
  sourceMap: true,
});

export default [
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/esm',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: true,
    },
    plugins: [...basePlugins, cssPlugin],
    external,
  },
  
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/cjs',
      format: 'cjs',
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: true,
    },
    plugins: [...basePlugins],
    external,
  },
  
  // UMD build (minified)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/umd/pulse-ui.min.js',
      format: 'umd',
      name: 'PulseUI',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'styled-components': 'styled',
      },
      sourcemap: true,
    },
    plugins: [
      ...basePlugins,
      cssPlugin,
      terser(),
      visualizer({
        filename: 'bundle-analysis.html',
        title: 'Pulse UI Bundle Analysis',
        open: true,
        gzipSize: true,
        brotliSize: true
      }),
    ],
    external,
  },
];
