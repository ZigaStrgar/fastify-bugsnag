import {FastifyPluginCallback} from 'fastify';
import {Client, Config} from '@bugsnag/js';
import {Event, Logger} from "@bugsnag/core";

declare module 'fastify' {
    interface FastifyInstance {
        bugsnag: Client;
    }

    interface FastifyRequest {
        bugsnag: Client;
    }
}

type AfterErrorCb = (err: any, event: Event, logger: Logger) => void;

interface BugsnagNodeConfig extends Config {
    hostname?: string
    onUncaughtException?: AfterErrorCb
    onUnhandledRejection?: AfterErrorCb
    agent?: any
    projectRoot?: string
    sendCode?: boolean
}

interface PluginOptions extends BugsnagNodeConfig {
    enableReporting?: boolean;
}

declare const fastifyBugsnag: FastifyPluginCallback<PluginOptions>;
export default fastifyBugsnag;
