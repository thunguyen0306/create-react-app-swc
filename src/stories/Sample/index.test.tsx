/** @jest-environment jsdom */
import { render } from '@testing-library/react';

import { Default } from './index.stories';

describe('Text tests', () => {
  it('smoke test', () => {
    render(Default.render());
  });
});
