import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { toMilliseconds } from "duration-fns";
import path from "path";
import { Client } from "pg";
import { GenericContainer, Wait } from "testcontainers";

const srcDir = path.resolve(__dirname, "../../src");

/**
 * Creates a single test database instance to be used by all tests in this {@link describe}
 */
export function withTestDatabaseForAll(): {
  getClient: () => Client;
  getDbContainer: () => StartedPostgreSqlContainer;
} {
  const testDbController = withTestDatabase();
  let client: Client;
  let dbContainer: StartedPostgreSqlContainer;
  beforeAll(
    async () => ({ client, dbContainer } = await testDbController.before()),
    toMilliseconds({ minutes: 4 })
  );
  afterAll(testDbController.after, 10_000);
  return {
    getClient() {
      return client;
    },
    getDbContainer() {
      return dbContainer;
    },
  };
}

/**
 * Creates one test database instance per test to be used in this {@link describe}
 */
export function withTestDatabaseForEach(): {
  client: Client;
  dbContainer: StartedPostgreSqlContainer;
} {
  const testDbController = withTestDatabase();
  let client: Client;
  let dbContainer: StartedPostgreSqlContainer;
  beforeEach(
    async () => ({ client, dbContainer } = await testDbController.before()),
    toMilliseconds({ minutes: 4 })
  );
  afterEach(testDbController.after, 10_000);
  return {
    get client() {
      return client;
    },
    get dbContainer() {
      return dbContainer;
    },
  };
}

function withTestDatabase(): {
  before(
    this: void
  ): Promise<{ client: Client; dbContainer: StartedPostgreSqlContainer }>;
  after(this: void): Promise<void>;
} {
  let client: Client;
  let dbContainer: StartedPostgreSqlContainer;
  return {
    async before(this: void) {
      let containerLogs = "";
      try {
        dbContainer = new StartedPostgreSqlContainer(
          /*
           * This section is adapted from
           * https://github.com/testcontainers/testcontainers-node/blob/9941583b2627df93d4e579426e236da5ff2e127f/packages/modules/postgresql/src/postgresql-container.ts#L29-L39
           */
          await (
            await GenericContainer.fromDockerfile(
              srcDir,
              "db.Dockerfile"
            ).build("dynamic-query-cursor-pagination-example-test-db", {
              deleteOnExit: false,
            })
          )
            .withExposedPorts(5432)
            .withWaitStrategy(
              Wait.forLogMessage(
                /.*database system is ready to accept connections.*/,
                2
              )
            )
            .withStartupTimeout(toMilliseconds({ minutes: 2 }))
            .withLogConsumer((logStream) => {
              logStream.on("data", (line) => (containerLogs += line));
              logStream.on("err", (line) => (containerLogs += line));
            })
            .start(),
          "postgres",
          "postgres",
          "postgres"
        );

        console.debug(
          "Testcontainer connection uri: " + dbContainer.getConnectionUri()
        );
        client = new Client(dbContainer.getConnectionUri());
        await client.connect();
        return { client, dbContainer };
      } catch (e) {
        console.debug("== Testcontainer logs ==\n\n" + containerLogs);
        await client?.end();
        await dbContainer?.stop();
        throw e;
      }
    },
    async after(this: void) {
      await client?.end();
      await dbContainer?.stop();
    },
  };
}
