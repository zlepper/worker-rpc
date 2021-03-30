import { WorkerWorkerServerConnection } from '../src/web-worker/worker-worker-server-connection.js';
import {MyClass} from "./my-class.js";
import {startWorkerProvider} from "../src/worker/worker-provider.js";

const connection = new WorkerWorkerServerConnection();
startWorkerProvider(new MyClass(), connection);
