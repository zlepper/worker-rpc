import { startWorkerProvider } from '@zlepper/rpc';
import { Calculator } from '@zlepper/testing';
import { WebWorkerServerConnection } from '../web-worker-server-connection';

const connection = new WebWorkerServerConnection();
startWorkerProvider(new Calculator(), connection);
