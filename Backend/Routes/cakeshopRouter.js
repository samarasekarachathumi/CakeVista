import express from 'express';
import { getcakeshops, savecakeshops } from '../Controllers/cakeController.js';

const cakeshopRouter = express.Router()

cakeshopRouter.get("/",getcakeshops);
cakeshopRouter.post("/",savecakeshops);


export default cakeshopRouter;
