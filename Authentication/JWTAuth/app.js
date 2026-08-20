import express from 'express';
const app = express(); //whya re we doing app here?


app.use(express.json());


export default app;