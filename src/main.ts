// OTHERS //
import 'dotenv/config';
import { serve } from '@hono/node-server';

// Hono Instance File //
import { app } from '@/app.js';

// STARTING THE SERVER AT PORT 3000 //
serve({
    fetch: app.fetch,
    port: 3000,
}, () => {
    console.log('Server is running on http://localhost:3000')
})