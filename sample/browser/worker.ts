import { WebWorkerServerConnection } from '../../src/web-worker/web-worker-server-connection.js';
import {MyClass} from "../shared/my-class.js";
import {startWorkerProvider} from "../../src/worker/worker-provider.js";

const connection = new WebWorkerServerConnection();
startWorkerProvider(new MyClass(), connection);
