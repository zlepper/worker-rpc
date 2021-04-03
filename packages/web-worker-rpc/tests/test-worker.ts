import { startWorkerProvider } from '@zlepper/rpc';
import { WebWorkerServerConnection } from '../web-worker-server-connection.js';
import { Calculator } from '@zlepper/testing';

const connection = new WebWorkerServerConnection();
startWorkerProvider(new Calculator(), connection);
