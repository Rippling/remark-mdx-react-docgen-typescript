/// <reference types="mdast-util-directive" />

import type { Root } from 'mdast';
import path from 'node:path';
import { parse, type ParserOptions } from 'react-docgen-typescript';

export type PluginOptions = {
  directiveName?: string;
  fileAttributeName?: string;
  componentName?: string;
  reactDocGenOptions?: ParserOptions;
  rootDir?: string;
};

const defaultReactDocGenOptions: ParserOptions = {
  shouldExtractLiteralValuesFromEnum: true,
  savePropValueAsString: true,
  propFilter: prop => {
    if (prop.parent) {
      return !prop.parent.fileName.includes('node_modules');
    }
    return true;
  },
};

function getHelpersText(params: { directiveName: string }) {
  const { directiveName } = params;
  return `
    Correct usage:
    ::${directiveName}{file="./src/components/MyComponent.tsx#MyComponent"}

    MyComponent is the display name of the component. If the file contains only one component, you can omit the component name.
    ::${directiveName}{file="./src/components/MyComponent.tsx"}
  `;
}

const plugin = ({
  directiveName = 'component-docs',
  fileAttributeName = 'file',
  componentName = 'ComponentDocs',
  reactDocGenOptions,
  rootDir = process.cwd(),
}: PluginOptions = {}) => {
  return async (tree: Root, vfile: any) => {
    const { fromJs } = await import('esast-util-from-js');
    const { visit } = await import('unist-util-visit');
    const { path: mdxFilePath } = vfile;

    visit(tree, node => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (node.name !== directiveName) return;
        if (node.type === 'textDirective') {
          vfile.fail(
            `
            Unexpected \':${directiveName}\` text directive, use two colons for a leaf directive
            
            ${getHelpersText({ directiveName })}
            `,
            node
          );
          return;
        }
        if (node.type !== 'leafDirective') {
          vfile.fail(
            `
            ${directiveName} directive must be a leaf directive.
            
            ${getHelpersText({ directiveName })}
            `,
            node
          );
          return;
        }

        const attributes = node.attributes || {};
        const { [fileAttributeName]: filePath, ...restAttrs } = attributes;

        if (!filePath) {
          vfile.fail(
            `
            ${directiveName} directive must have ${fileAttributeName} attribute.
            
            ${getHelpersText({ directiveName })}
            `,
            node
          );
          return;
        }

        const resolvedRootDirFilePath = /^<rootDir>/.test(filePath)
          ? path.resolve(rootDir, filePath.replace(/^<rootDir>/, '.'))
          : filePath;

        const absoluteFilePath = require.resolve(
          resolvedRootDirFilePath.startsWith('.')
            ? path.resolve(path.dirname(mdxFilePath), resolvedRootDirFilePath)
            : resolvedRootDirFilePath
        );

        const parsedData = parse(absoluteFilePath, {
          ...defaultReactDocGenOptions,
          ...reactDocGenOptions,
        });

        Object.assign(node, {
          type: 'mdxJsxFlowElement',
          name: componentName,
          children: [],
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'propsData',
              value: {
                type: 'mdxJsxAttributeValueExpression',
                value: `(${JSON.stringify(parsedData)})`,
                data: {
                  estree: fromJs(`(${JSON.stringify(parsedData)})`, {
                    module: true,
                  }),
                },
              },
            },
            {
              type: 'mdxJsxAttribute',
              name: fileAttributeName,
              value: absoluteFilePath,
            },
            ...Object.entries(restAttrs).map(([name, value]) => ({
              type: 'mdxJsxAttribute',
              name,
              value,
            })),
          ],
        });
      }
    });
  };
};

export default plugin;
