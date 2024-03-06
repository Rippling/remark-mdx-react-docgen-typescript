import { compile } from '@mdx-js/mdx';
import path from 'node:path';
import remarkDirectivePlugin from 'remark-directive';
import { VFile } from 'vfile';
import { expect, test } from 'vitest';
import reactDocGenPlugin from '../dist/index.js';

const cwd = process.cwd();

const vfile = (value: string) =>
  new VFile({
    value,
    path: path.resolve('./test.mdx'),
  });

test('No directive used', async () => {
  const inputData = vfile(`
    # Hello World
  `);
  const result = await compile(inputData, {
    remarkPlugins: [remarkDirectivePlugin, reactDocGenPlugin],
    jsx: true,
  });

  expect(String(result)).toMatchInlineSnapshot(`
  "/*@jsxRuntime automatic @jsxImportSource react*/
  function _createMdxContent(props) {
    const _components = {
      h1: "h1",
      ...props.components
    };
    return <_components.h1>{"Hello World"}</_components.h1>;
  }
  export default function MDXContent(props = {}) {
    const {wrapper: MDXLayout} = props.components || ({});
    return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
  }
  "
  `);
});

test('Directive used as textDirective', async () => {
  const inputData = vfile(`
    :component-docs
  `);
  try {
    await compile(inputData, {
      remarkPlugins: [remarkDirectivePlugin, reactDocGenPlugin],
      jsx: true,
    });
    expect(true).toBe(false);
  } catch (e) {
    expect(true).toBe(true);
  }
});

test('Directive used as containerDirective', async () => {
  const inputData = vfile(`:::component-docs\n\nChildren\n:::`);
  try {
    await compile(inputData, {
      remarkPlugins: [remarkDirectivePlugin, reactDocGenPlugin],
      jsx: true,
    });
    expect(true).toBe(false);
  } catch (e) {
    expect(true).toBe(true);
  }
});

test('No `file` attribute provided', async () => {
  const inputData = vfile(`::component-docs`);
  try {
    await compile(inputData, {
      remarkPlugins: [remarkDirectivePlugin, reactDocGenPlugin],
      jsx: true,
    });
    expect(true).toBe(false);
  } catch (e) {
    expect(true).toBe(true);
  }
});

test('Valid usage', async () => {
  const inputData = vfile(
    '::component-docs{file="./__fixtures__/Component.tsx"}'
  );
  const result = await compile(inputData, {
    remarkPlugins: [remarkDirectivePlugin, reactDocGenPlugin],
    jsx: true,
  });
  expect(String(result)).toMatchInlineSnapshot(`
  "/*@jsxRuntime automatic @jsxImportSource react*/
  function _createMdxContent(props) {
    const {ComponentDocs} = props.components || ({});
    if (!ComponentDocs) _missingMdxReference("ComponentDocs", true);
    return <ComponentDocs propsData={[{
      "tags": {},
      "filePath": "${cwd}/__fixtures__/Component.tsx",
      "description": "",
      "displayName": "Component",
      "methods": [],
      "props": {
        "name": {
          "defaultValue": null,
          "description": "",
          "name": "name",
          "declarations": [{
            "fileName": "remark-mdx-react-docgen-typescript/__fixtures__/Component.tsx",
            "name": "TypeLiteral"
          }],
          "required": true,
          "type": {
            "name": "string"
          }
        },
        "age": {
          "defaultValue": null,
          "description": "",
          "name": "age",
          "declarations": [{
            "fileName": "remark-mdx-react-docgen-typescript/__fixtures__/Component.tsx",
            "name": "TypeLiteral"
          }],
          "required": true,
          "type": {
            "name": "number"
          }
        },
        "employmentType": {
          "defaultValue": null,
          "description": "",
          "name": "employmentType",
          "declarations": [{
            "fileName": "remark-mdx-react-docgen-typescript/__fixtures__/Component.tsx",
            "name": "TypeLiteral"
          }],
          "required": true,
          "type": {
            "name": "enum",
            "raw": "\\"full-time\\" | \\"part-time\\"",
            "value": [{
              "value": "\\"full-time\\""
            }, {
              "value": "\\"part-time\\""
            }]
          }
        }
      }
    }]} file="${cwd}/__fixtures__/Component.tsx" />;
  }
  export default function MDXContent(props = {}) {
    const {wrapper: MDXLayout} = props.components || ({});
    return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
  }
  function _missingMdxReference(id, component) {
    throw new Error("Expected " + (component ? "component" : "object") + " \`" + id + "\` to be defined: you likely forgot to import, pass, or provide it.");
  }
  "
  `);
});

test('Valid usage with <rootDir>', async () => {
  const inputData = vfile(
    '::component-docs{file="<rootDir>/__fixtures__/Component.tsx"}'
  );
  const result = await compile(inputData, {
    remarkPlugins: [remarkDirectivePlugin, reactDocGenPlugin],
    jsx: true,
  });
  expect(String(result)).toMatchInlineSnapshot(`
  "/*@jsxRuntime automatic @jsxImportSource react*/
  function _createMdxContent(props) {
    const {ComponentDocs} = props.components || ({});
    if (!ComponentDocs) _missingMdxReference("ComponentDocs", true);
    return <ComponentDocs propsData={[{
      "tags": {},
      "filePath": "${cwd}/__fixtures__/Component.tsx",
      "description": "",
      "displayName": "Component",
      "methods": [],
      "props": {
        "name": {
          "defaultValue": null,
          "description": "",
          "name": "name",
          "declarations": [{
            "fileName": "remark-mdx-react-docgen-typescript/__fixtures__/Component.tsx",
            "name": "TypeLiteral"
          }],
          "required": true,
          "type": {
            "name": "string"
          }
        },
        "age": {
          "defaultValue": null,
          "description": "",
          "name": "age",
          "declarations": [{
            "fileName": "remark-mdx-react-docgen-typescript/__fixtures__/Component.tsx",
            "name": "TypeLiteral"
          }],
          "required": true,
          "type": {
            "name": "number"
          }
        },
        "employmentType": {
          "defaultValue": null,
          "description": "",
          "name": "employmentType",
          "declarations": [{
            "fileName": "remark-mdx-react-docgen-typescript/__fixtures__/Component.tsx",
            "name": "TypeLiteral"
          }],
          "required": true,
          "type": {
            "name": "enum",
            "raw": "\\"full-time\\" | \\"part-time\\"",
            "value": [{
              "value": "\\"full-time\\""
            }, {
              "value": "\\"part-time\\""
            }]
          }
        }
      }
    }]} file="${cwd}/__fixtures__/Component.tsx" />;
  }
  export default function MDXContent(props = {}) {
    const {wrapper: MDXLayout} = props.components || ({});
    return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
  }
  function _missingMdxReference(id, component) {
    throw new Error("Expected " + (component ? "component" : "object") + " \`" + id + "\` to be defined: you likely forgot to import, pass, or provide it.");
  }
  "
  `);
});

test('Used Options', async () => {
  const inputData = vfile(
    '::props-table{filePath="<rootDir>/../__fixtures__/Component.tsx" additionalProp="value"}'
  );
  const result = await compile(inputData, {
    remarkPlugins: [
      remarkDirectivePlugin,
      [
        reactDocGenPlugin,
        {
          directiveName: 'props-table',
          componentName: 'PropsTable',
          fileAttributeName: 'filePath',
          rootDir: `${cwd}/src`,
        },
      ],
    ],
    jsx: true,
  });
  expect(String(result)).toMatchInlineSnapshot(`
  "/*@jsxRuntime automatic @jsxImportSource react*/
  function _createMdxContent(props) {
    const {PropsTable} = props.components || ({});
    if (!PropsTable) _missingMdxReference("PropsTable", true);
    return <PropsTable propsData={[{
      "tags": {},
      "filePath": "${cwd}/__fixtures__/Component.tsx",
      "description": "",
      "displayName": "Component",
      "methods": [],
      "props": {
        "name": {
          "defaultValue": null,
          "description": "",
          "name": "name",
          "declarations": [{
            "fileName": "remark-mdx-react-docgen-typescript/__fixtures__/Component.tsx",
            "name": "TypeLiteral"
          }],
          "required": true,
          "type": {
            "name": "string"
          }
        },
        "age": {
          "defaultValue": null,
          "description": "",
          "name": "age",
          "declarations": [{
            "fileName": "remark-mdx-react-docgen-typescript/__fixtures__/Component.tsx",
            "name": "TypeLiteral"
          }],
          "required": true,
          "type": {
            "name": "number"
          }
        },
        "employmentType": {
          "defaultValue": null,
          "description": "",
          "name": "employmentType",
          "declarations": [{
            "fileName": "remark-mdx-react-docgen-typescript/__fixtures__/Component.tsx",
            "name": "TypeLiteral"
          }],
          "required": true,
          "type": {
            "name": "enum",
            "raw": "\\"full-time\\" | \\"part-time\\"",
            "value": [{
              "value": "\\"full-time\\""
            }, {
              "value": "\\"part-time\\""
            }]
          }
        }
      }
    }]} filePath="${cwd}/__fixtures__/Component.tsx" additionalProp="value" />;
  }
  export default function MDXContent(props = {}) {
    const {wrapper: MDXLayout} = props.components || ({});
    return MDXLayout ? <MDXLayout {...props}><_createMdxContent {...props} /></MDXLayout> : _createMdxContent(props);
  }
  function _missingMdxReference(id, component) {
    throw new Error("Expected " + (component ? "component" : "object") + " \`" + id + "\` to be defined: you likely forgot to import, pass, or provide it.");
  }
  "
  `);
});
