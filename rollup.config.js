import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/main.ts',
  output: [
    {
      file: 'main.cjs',
      format: 'cjs',
      sourcemap: false,
    },
  ],
  context: 'this',
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
    }),
    resolve({
      exportConditions: ['node'],
    }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env'],
      exclude: 'node_modules/**',
    }),
  ],
};
