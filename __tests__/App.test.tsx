/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { queryClient } from '@app/query-client';
import App from '../App';

function textOf(node: ReactTestRenderer.ReactTestRendererNode | null): string {
  if (node === null) {
    return '';
  }
  if (typeof node === 'string') {
    return node;
  }
  return (node.children ?? []).map(textOf).join('');
}

afterAll(() => {
  queryClient.clear();
});

test('renders the starter screen with query data', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  // Let the greeting query resolve.
  await ReactTestRenderer.act(async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  });

  const text = textOf(renderer.toJSON() as ReactTestRenderer.ReactTestRendererNode);
  expect(text).toContain('Starter Template');
  expect(text).toContain('the boring setup already done');
  expect(text).toContain('☆Star on GitHub');
});
