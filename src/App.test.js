import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

  test('should be able to search and display dog image results', async () => {
    render(<App />);

    // Simulate selecting an option and verifying its value
    const selectElement = screen.getByRole('combobox');
    const optionCattledog = await screen.findByRole('option', {
      name: 'cattledog', // note: option cattledog is also available in our mock response
    });

    expect(optionCattledog).toBeInTheDocument();
    userEvent.selectOptions(selectElement, 'cattledog');
    expect(selectElement).toHaveValue('cattledog');

    // Simulate initiating the search request
    const searchButton = screen.getByRole('button', { name: 'Search' });
    expect(searchButton).toBeEnabled();
    userEvent.click(searchButton);

    // Loading state displays and gets removed once results are displayed
    await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

    // Verify image display and results count
    const dogImages = screen.getAllByRole('img');
    expect(dogImages).toHaveLength(2); //note: In our mock we are returning only 2 images so length should be 2.
    expect(screen.getByText(/2 Results/i)).toBeInTheDocument();
    expect(dogImages[0]).toHaveAccessibleName('cattledog 1 of 2'); // note: here AccessibleName is value of alt in img tag
    expect(dogImages[1]).toHaveAccessibleName('cattledog 2 of 2');
  });
});
