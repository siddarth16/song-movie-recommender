import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  test('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-brutal');
  });

  test('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-brutal-primary');

    rerender(<Button variant="accent">Accent</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-brutal-accent');

    rerender(<Button variant="default">Default</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-brutal');
  });

  test('applies size classes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-sm');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-8', 'py-4', 'text-body');

    rerender(<Button size="xl">Extra Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-12', 'py-6', 'text-heading');
  });

  test('shows loading state correctly', () => {
    render(<Button loading>Loading Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-75', 'cursor-not-allowed');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('handles disabled state correctly', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('does not call onClick when loading', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} loading>Loading</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('btn-brutal', 'custom-class');
  });

  test('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Button ref={ref}>Ref Button</Button>);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  test('spreads additional props', () => {
    render(<Button data-testid="test-button" aria-label="Test button">Props</Button>);
    const button = screen.getByTestId('test-button');
    
    expect(button).toHaveAttribute('aria-label', 'Test button');
  });
});