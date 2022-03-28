'use strict'

// import TestClient from "../../test-client";
// import startServer from '../../index';
// import Config from "../../config";

describe('[INTEGRATION] Should start server, connect from client, and send payload', () => {
  // avoid using the default 8080 port which might be locked by a dev server
  // const port = 8081;
  // test('Should  connect successfully', async () => {
  //   const mockConfigGet = jest.fn();
  //   mockConfigGet.mockReturnValue({
  //     port,
  //     host: '0.0.0.0'
  //   })

  //   Config.get = mockConfigGet;

  //   const mockClientOn = jest.fn();

  //   console.log('Starting server');
  //   // const server = startServer();
  //   console.log('After server started');

  //   // TODO: Spy on jest backend function.

  //   const testClient = new TestClient({
  //     serverPort: port,
  //     serverHost: '0.0.0.0'
  //   });

  //   testClient.client.on = mockClientOn;

  //   await testClient.connect();

  //   const testPayload = 'Hello Server';
  //   const numBytes = testPayload.length * 1;
  //   const result = await testClient.send('Hello Server');
  //   // console.log('wait 3 seconds')
  //   // await new Promise( resolve => setTimeout(resolve, 3000) );
  
  //   expect(testClient.client.on).toHaveBeenCalledWith('message');
  //   expect(result).toEqual(numBytes);
  // });
});