import express from 'express';
import  UserController  from '../controllers/root/UserController';

const root = express.Router()

root.get('/user/view', UserController.viewUserRecord)


root.get('/user/encrypted/view', UserController.viewEncryptedUserRecord)

export default root