import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',  // Your entry point
  output: [
    {
      file: 'dist/expression-manager-script.min.js',  // UMD format, minified
      format: 'umd',
      name: 'EMScript',
      plugins: [terser()],
    }
  ],
  plugins: [
    resolve(),  // Resolves node_modules
    babel({ babelHelpers: 'bundled' }),  // Transpiles with Babel
  ]
};

