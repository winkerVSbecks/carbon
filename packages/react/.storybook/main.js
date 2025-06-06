/**
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

import remarkGfm from 'remark-gfm';
import fs from 'fs';
import glob from 'fast-glob';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

// We can't use .mdx files in conjuction with `storyStoreV7`, which we are using to preload stories for CI purposes only.
// MDX files are fine to ignore in CI mode since they don't make a difference for VRT testing
const storyGlobs = [
  './Welcome/Welcome.mdx',
  '../src/**/*.stories.js',
  '../src/**/*.mdx',
  '../src/components/Tile/Tile.mdx',
  '../src/**/next/*.stories.js',
  '../src/**/next/**/*.stories.js',
  '../src/**/next/*.mdx',
  '../src/**/*-story.js',
];

const stories = glob
  .sync(storyGlobs, {
    ignore: ['../src/**/docs/*.mdx', '../src/**/next/docs/*.mdx'],
    cwd: __dirname,
  })
  // Filters the stories by finding the paths that have a story file that ends
  // in `-story.js` and checks to see if they also have a `.stories.js`,
  // if so then defer to the `.stories.js`
  .filter((match) => {
    const filepath = path.resolve(__dirname, match);
    const basename = path.basename(match, '.js');
    const denylist = new Set([
      'DataTable-basic-story',
      'DataTable-batch-actions-story',
      'DataTable-filtering-story',
      'DataTable-selection-story',
      'DataTable-sorting-story',
      'DataTable-toolbar-story',
      'DataTable-dynamic-content-story',
      'DataTable-expansion-story',
    ]);
    if (denylist.has(basename)) {
      return false;
    }
    if (basename.endsWith('-story')) {
      const component = basename.replace(/-story$/, '');
      const storyName = path.resolve(
        filepath,
        '..',
        'next',
        `${component}.stories.js`
      );
      if (fs.existsSync(storyName)) {
        return false;
      }
      return true;
    }
    return true;
  });
const config = {
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: true,
        backgrounds: false,
        controls: true,
        docs: true,
        toolbars: true,
        viewport: true,
      },
    },
    '@storybook/addon-webpack5-compiler-babel',
    /**
     * For now, the storybook-addon-accessibility-checker fork replaces the @storybook/addon-a11y.
     * Eventually they plan to attempt to get this back into the root addon with the storybook team.
     * See more: https://ibm-studios.slack.com/archives/G01GCBCGTPV/p1697230798817659
     */
    '@storybook/addon-a11y',
    // 'storybook-addon-accessibility-checker',
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-interactions',
  ],
  features: {
    previewCsfV3: true,
    buildStoriesJson: true,
  },
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  stories,
  typescript: {
    reactDocgen: 'react-docgen', // Favor docgen from prop-types instead of TS interfaces
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.s?css$/,
      sideEffects: true,
      use: [
        {
          loader:
            process.env.NODE_ENV === 'production'
              ? MiniCssExtractPlugin.loader
              : 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            sourceMap: true,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                require('autoprefixer')({
                  overrideBrowserslist: ['last 1 version'],
                }),
              ],
            },
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            implementation: require('sass'),
            sassOptions: {
              includePaths: [
                path.resolve(__dirname, '..', 'node_modules'),
                path.resolve(__dirname, '..', '..', '..', 'node_modules'),
              ],
              silenceDeprecations: ['mixed-decls'],
            },
            warnRuleAsWarning: true,
            sourceMap: true,
          },
        },
      ],
    });
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
        })
      );
    }
    return config;
  },
  docs: {
    autodocs: true,
    defaultName: 'Overview',
  },
};

export default config;
