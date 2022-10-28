import type {LoaderContext} from 'webpack';

import path from 'path';

/**
 *
 * Requires `include-defaults.js` with required shared libs
 *
 */
export default function patchDefaultSharedLoader(
  this: LoaderContext<Record<string, unknown>>,
  content: string
) {
  if (content.includes('include-defaults')) {
    // If already patched, return
    return content;
  }

  // avoid absolute paths as they break hashing when the root for the project is moved
  // @see https://webpack.js.org/contribute/writing-a-loader/#absolute-paths
  const pathIncludeDefaults = path.relative(
    this.context,
    path.resolve(__dirname, '../include-defaults.js')
  );

  const pathIncludeDefaultsServerComponents = path.relative(
    this.context,
    path.resolve(__dirname, '../include-defaults-sc.js')
  );

  if(/^['"]use client['"]/.test(content)) {
    return [
      '',
      `require(${JSON.stringify('./' + pathIncludeDefaults)});`,
      content
    ]
  }
  return [
    '',
    `require(${JSON.stringify('./' + pathIncludeDefaultsServerComponents)});`,
    content
  ].join("\n")

}

