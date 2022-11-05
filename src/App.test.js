import { render, screen } from '@testing-library/react';
import App from './App';

describe('landing page', () => {
  test('verify landing page elements', () => {
    render(<App />);

    expect(screen.getByRole('heading')).toHaveTextContent(/Doggy Directory/);
    expect(screen.getByRole('combobox')).toHaveDisplayValue(/Select a breed/);
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
