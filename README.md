# `remark-mdx-react-docgen-typescript`

📝 A mdx plugin to extract a react component documentation using `react-docgen-typescript`

[![npm version](https://badge.fury.io/js/remark-mdx-react-docgen-typescript.svg)](https://badge.fury.io/js/remark-mdx-react-docgen-typescript)

## Installation

```sh
npm install -D remark-directive remark-mdx-react-docgen-typescript
```

## Setup

```js
import remarkReactDocgen from 'remark-mdx-react-docgen-typescript';
// or
// const remarkReactDocgen = require('remark-mdx-react-docgen-typescript').default;
```

See [**Using plugins**](https://github.com/remarkjs/remark/blob/master/doc/plugins.md#using-plugins) for more instructions in the official documentation.

## Usage

For example, given a file named example.mdx with the following contents:

```md
::component-docs{file="./Component.tsx"}
```

The following script:

```js
import { readFile } from 'node:fs/promises';

import { compile } from '@mdx-js/mdx';
import remarkDirective from 'remark-directive';
import remarkReactDocgen from 'remark-mdx-react-docgen-typescript';

const { contents } = await compile(await readFile('example.mdx'), {
  jsx: true,
  remarkPlugins: [remarkDirective, remarkReactDocgen],
});
console.log(contents);
```

Roughly yields:

```jsx
export default function MDXContent() {
  return <ComponentDocs
    propsData={[{
      "tags": {},
      "filePath": "${cwd}/__fixtures__/Component.tsx",
      "description": "",
      "displayName": "Component",
      "methods": [],
      "props": {...}
      ...
    }]}
  />
}
```

You may use `@mdx-js/react` to define the component for `ComponentDocs` tag name:

```jsx
import { MDXProvider } from '@mdx-js/react';
import ComponentDocs from './ComponentDocs';
// ^-- Assumes an integration is used to compile MDX to JS, such as
// `@mdx-js/esbuild`, `@mdx-js/loader`, `@mdx-js/node-loader`, or
// `@mdx-js/rollup`, and that it is configured with
// `options.providerImportSource: '@mdx-js/react'`.

/** @type {import('mdx/types.js').MDXComponents} */
const components = {
  ComponentDocs,
};

console.log(
  <MDXProvider components={components}>
    <Post />
  </MDXProvider>
);
```

The file path is relative to the markdown file path. You can use `<rootDir>` at the start of the path to import files relatively from the rootDir:

```md
::component-docs{file="<rootDir>/Component.tsx"}
```

You may also specify additional attributes that will be forwarded as props to ComponentDocs component:

```md
::component-docs{file="./Component.tsx" extraProp="value"}
```

## Options

- `componentName: string`: The name of tag/component this plugin will use in JSX. Defaults to `ComponentDocs`.
- `directiveName: string`: The directive name. Defaults to `component-docs`.
- `fileAttrName: string`: The attribute name for file path. Defaults to `file`.
- `rootDir: string`: Change what `<rootDir>` refers to. Defaults to `process.cwd()`.
- `reactDocGenOptions: object`: Options for [`react-docgen-typescript`](https://github.com/styleguidist/react-docgen-typescript?tab=readme-ov-file#options).

## Testing

After installing dependencies with `npm install`, the tests can be run with: `npm test`

## License

Rippling People Center Inc.
[Apache 2.0](LICENSE)
