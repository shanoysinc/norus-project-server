/* eslint-disable no-undef */
import { startServer } from "../app.js";

import { serverConfig } from "../test/setup.js";
import { baseApiClient } from "../test/util/baseApiClient.js";
import * as dbSetup from "../test/util/dbUtils.js";

let server;

beforeAll(async () => {
  server = await startServer(serverConfig);
});

afterAll(async () => {
  await dbSetup.dbCloseConnection();

  server.close();
});

test("test Health check route is running", async () => {
  const result = await baseApiClient.get("health-check");
  expect(result.data).toMatchInlineSnapshot(`"server online"`);
});
