import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import  aedes  from 'aedes';
import prisma from "./src/lib/prisma.lib";
import { router } from './src/routes/routes';
import { authenticate,authorizePublish,authorizeSubscribe } from './src/middleware/aedesAuth.middleware';
import { onConnect , clientDisconnect } from './src/middleware/events.middleware';
import morgan from 'morgan'
import helmet from 'helmet';
import { main } from './prisma/seed';
import { errorLogger, errorMiddleware } from './src/middleware/error.middleware';
import { createWebSocketStream, Server } from 'ws'
import {createServer} from 'http'


main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  

prisma.client.deleteMany({}).catch((err) => {
  console.log(err)
})
dotenv.config();


const app: Express = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('common'));

app.use('/',router)

app.get('/', async (req: Request, res: Response) => {
  res.status(200).json({status:'ok'});
});

app.use(errorLogger)
app.use(errorMiddleware)

export const broker = aedes()


broker.authenticate = authenticate;
broker.authorizePublish = authorizePublish,
broker.authorizeSubscribe = authorizeSubscribe 

broker.on('client',onConnect)
broker.on('clientDisconnect', clientDisconnect)



const httpServer = createServer(app)
const wsServer = new Server({server: httpServer})
wsServer.on('connection',(conn , req) => {
  var stream = createWebSocketStream(conn)
  broker.handle(stream)
})


httpServer.listen(port, function () {
  console.log(`⚡️[server]: Server is running at ${port}`)
});




