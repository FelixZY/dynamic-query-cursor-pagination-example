import { withTestDatabaseForAll } from "@/db";
import { PeopleEntry, PeopleSchema } from "@/db/people";

const peopleColumns =
  "id, name, age, ST_X(position::GEOMETRY) AS longitude, ST_Y(position::GEOMETRY) AS latitude";

interface Id {
  id: PeopleEntry["id"];
}
interface Count {
  count: string;
}
interface Analysis {
  "QUERY PLAN": string;
}

describe("test", () => {
  const { getClient } = withTestDatabaseForAll();

  it("can query database and parse response", async () => {
    const res = await getClient().query<PeopleEntry>(
      `SELECT ${peopleColumns} FROM people LIMIT 1`
    );
    expect(res.rowCount).toEqual(1);
    expect(res.rows).toHaveLength(1);
    expect(() => PeopleSchema.parse(res.rows[0])).not.toThrow();
  });

  it("has enough entries that indices should be useful", async () => {
    const count = await getClient()
      .query<Count>(`SELECT COUNT(*) FROM people`)
      .then((res) => parseInt(res.rows[0].count));
    expect(count).toBeGreaterThan(10_000);
  });

  it("is able to interpret EXPLAIN ANALYZE responses", async () => {
    const id = await getClient()
      .query<Id>(`SELECT id FROM people LIMIT 1`)
      .then((res) => res.rows[0].id);
    const plan = await getClient()
      .query<Analysis>(
        `EXPLAIN ANALYZE SELECT * FROM people WHERE id = '${id}'`
      )
      .then((res) => res.rows[0]["QUERY PLAN"]);
    expect(plan).toMatch(/^Index Scan/i);
  });
});
