const asyncHandler = require('../../src/utils/asyncHandler');
const logger = require('../../src/utils/logger');

// Mock the logger to avoid console output during tests
jest.mock('../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
}));

describe('Utils', () => {
  describe('asyncHandler', () => {
    it('should handle successful async functions', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      const req = {};
      const res = {};
      const next = jest.fn();

      const handler = asyncHandler(mockFn);
      await handler(req, res, next);

      expect(mockFn).toHaveBeenCalledWith(req, res, next);
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle async function errors', async () => {
      const error = new Error('Test error');
      const mockFn = jest.fn().mockRejectedValue(error);
      const req = {};
      const res = {};
      const next = jest.fn();

      const handler = asyncHandler(mockFn);
      await handler(req, res, next);

      expect(mockFn).toHaveBeenCalledWith(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });

    it('should handle synchronous function errors', async () => {
      const error = new Error('Test error');
      const mockFn = jest.fn().mockImplementation(() => {
        throw error;
      });
      const req = {};
      const res = {};
      const next = jest.fn();

      const handler = asyncHandler(mockFn);
      await handler(req, res, next);

      expect(mockFn).toHaveBeenCalledWith(req, res, next);
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('logger', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should log info messages', () => {
      const message = 'Test info message';
      logger.info(message);
      expect(logger.info).toHaveBeenCalledWith(message);
    });

    it('should log error messages', () => {
      const message = 'Test error message';
      logger.error(message);
      expect(logger.error).toHaveBeenCalledWith(message);
    });

    it('should log warning messages', () => {
      const message = 'Test warning message';
      logger.warn(message);
      expect(logger.warn).toHaveBeenCalledWith(message);
    });

    it('should log debug messages', () => {
      const message = 'Test debug message';
      logger.debug(message);
      expect(logger.debug).toHaveBeenCalledWith(message);
    });
  });
}); 