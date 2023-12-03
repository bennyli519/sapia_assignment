import React from 'react';
import { render,screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login';

jest.mock('axios', () => {

})

// Mock axios module
jest.mock('../api/client', () => ({
  post: jest.fn(() => Promise.resolve({ data: 'mocked response' })),
}));

describe('Login Component', () => {
  it('renders login form', () => {
    const { getByLabelText, getByText } = render(<Login />);
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

});
