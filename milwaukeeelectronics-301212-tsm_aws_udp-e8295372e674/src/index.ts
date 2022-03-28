'use strict'

import { Config } from "./config";
import * as dgram from 'dgram';
import fetch from "node-fetch";
import winston from 'winston';
import WinstonCloudwatch from 'winston-cloudwatch';

enum ResponseType {
  // ACK returns the latest device configuration
  ACK="ACK",
  // NACK indicates an error
  NACK="NACK",
  // Responses are not sent for most payload types.
  NO_DEVICE_RESPONSE="NO_DEVICE_RESPONSE"
}

type Response = {
  type: ResponseType.ACK;
  data: Buffer;
} | {
  type: ResponseType.NACK;
  data: null;
} | {
  type: ResponseType.NO_DEVICE_RESPONSE;
  data: null;
}

// Log to cloudwatch
winston.add(new WinstonCloudwatch({
  name: Config.get().cloudwatchLogsStreamName,
  logGroupName: Config.get().cloudwatchLogsGroupName,
  logStreamName: Config.get().cloudwatchLogsStreamName,
  awsRegion: Config.get().cloudwatchLogsRegion
}));

console.log('config', Config.get());
console.log('Winston configured');

// Log to the console.
// This seemed to cause an issue when deployed to EC2
// ifwinston.add(new winston.transports.Console({}));

export class UDPServer {
  udpServer: dgram.Socket;
  self: UDPServer;

  constructor(){
    this.udpServer = dgram.createSocket('udp4');
    this.self = this;
  }

  async processMessage(msg: string, sender: dgram.RemoteInfo): Promise<Response>{
    const config = Config.get();

    const stringified = JSON.stringify({
      udpInfo: sender,
      datagram: msg
    });

    console.log("Received datagram");
    winston.info(JSON.stringify({ udpInfo: sender, datagram: msg}));
    
    const result = await fetch(`${config.apiUrl}udp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: stringified
    });

    const response: Response = await result.json() as Response;
    
    console.log(response);
    winston.debug(JSON.stringify(response));

    return response;
  }

  start() {
    const { port } = Config.get();
    const self = this.self;
  
    self.udpServer.on('error', (err) => {
      winston.error(`server error: ${err.stack}`);
  
      // TODO: How to handle this error more gracefully? Healthcheck? External autoscaling?
      //    reboot the error?
      self.udpServer.close();
    });
    
    self.udpServer.on('message', async (msg: any, sender: dgram.RemoteInfo) => {
      winston.info("Message received");

      // Process and reply to the message
      const response = await self.processMessage(msg, sender);

      if(ResponseType.ACK === response.type) {
        winston.info(`Sending ACK`);
        self.udpServer.send(response.data, sender.port, sender.address, error => {
          if (error) {
            winston.error(`server error: ${error}`);
          }
        });
      } else {
        // @fixme - what to do here on NACKS?
      }
    });
    
    self.udpServer.on('listening', () => {
      const address = self.udpServer.address();
      winston.info(`server listening ${address.address}:${address.port}`);
    });
    
    self.udpServer.bind(port);
  
    return self.udpServer;
  }
}

const udpServer = new UDPServer();

// Integration tests will start this server in code.
// jest sets 'NODE_ENV' to be test
if(!('test' === process.env.NODE_ENV)) {
  try {
    udpServer.start();
  } catch(err) {
    winston.info("Error");
    winston.error(err);
  }
}

export default UDPServer;