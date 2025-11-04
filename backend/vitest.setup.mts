import path from 'node:path';

import dotenv from 'dotenv';

// Use exclusively the test environment variables for the tests
dotenv.config({ path: path.resolve(__dirname, '.env.test') });
