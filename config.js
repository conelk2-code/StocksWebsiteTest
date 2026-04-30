/**
 * Stock Viewer - Configuration
 * API settings and rate limiter
 */

const API_CONFIG = {
    // Replace with your Massive.com API key
    apiKey: 'AuRtHMf5by1oSchOdbnLmiU5zamtHMC8',
    baseUrl: 'https://data.polygon.io/v1',
    requestsPerMinute: 5
};

/**
 * Rate Limiter Class
 * Enforces request limits and tracks usage
 */
class RateLimiter {
    constructor(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }

    /**
     * Check if a request is allowed
     * @returns {Object} { allowed: boolean, remainingRequests: number, resetTime: number }
     */
    checkLimit() {
        const now = Date.now();
        
        // Remove old requests outside the window
        this.requests = this.requests.filter(time => now - time < this.windowMs);

        const allowed = this.requests.length < this.maxRequests;
        const remaining = Math.max(0, this.maxRequests - this.requests.length);
        const oldestRequest = this.requests.length > 0 ? this.requests[0] : now;
        const resetTime = Math.ceil((oldestRequest + this.windowMs - now) / 1000);

        return {
            allowed,
            remaining,
            resetTime: Math.max(0, resetTime)
        };
    }

    /**
     * Record a new request
     */
    recordRequest() {
        this.requests.push(Date.now());
    }

    /**
     * Get current status
     * @returns {Object} Current rate limit status
     */
    getStatus() {
        return this.checkLimit();
    }
}

// Initialize rate limiter (5 requests per minute)
const rateLimiter = new RateLimiter(API_CONFIG.requestsPerMinute, 60000);