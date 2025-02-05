import express from 'express'
import carController from '../controllers/car.controller.js';

const carRouter = express.Router()

carRouter.get('/car-list', carController.carList)

export default carRouter