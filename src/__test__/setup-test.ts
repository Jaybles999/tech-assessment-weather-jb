import '@testing-library/jest-dom/vitest';
import { vi, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// automatically clean up after each test
afterEach(() => {
    cleanup();
});

// reset mocks and clear localStorage before each test
beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
});

// mock global fetch
vi.stubGlobal('fetch', vi.fn());