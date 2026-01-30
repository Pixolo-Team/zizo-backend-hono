import { Hono } from 'hono';
export const app = new Hono()
app.get('/', (c: any) => c.text('Hello World!'));