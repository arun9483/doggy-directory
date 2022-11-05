import { render, screen } from '@testing-library/react';
import App from './App';
import mockFetch from './mocks/mockFetch';

describe('landing page', () => {
  beforeEach(() => {
    jest.spyOn(window, 'fetch').mockImplementation(mockFetch);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('verify landing page elements', async () => {
    render(<App />);

    expect(screen.getByRole('heading')).toHaveTextContent(/Doggy Directory/);
    expect(screen.getByRole('combobox')).toHaveDisplayValue(/Select a breed/);

    const optionHusky = await screen.findByRole('option', {
      name: 'husky', // note option husky is available in our mock response
    });

    expect(optionHusky).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
