import {Client} from "@bugsnag/js";
import fastify from 'fastify';
import {expectType} from "tsd";

import plugin from '../../src/index';

const app = fastify();

app.register(plugin).ready();

expectType<Client>(app.bugsnag)

app.get('/', request => {
    expectType<Client>(request.bugsnag)
})
