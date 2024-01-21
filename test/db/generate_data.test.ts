import { PeopleEntry } from "@/db/people";
import { faker } from "@faker-js/faker";
import { toMilliseconds } from "duration-fns";
import fs from "fs";
import path from "path";

describe.skip("Data generation", () => {
  it(
    "Generate 001_insert_data.sql",
    () => {
      const lines: string[] = Array.from({ length: 1_000_000 }, () => {
        const entry: PeopleEntry = {
          id: faker.string.nanoid(),
          name: faker.person.fullName(),
          age: faker.number.int({ min: 0, max: 100 }),
          longitude: faker.location.longitude(),
          latitude: faker.location.latitude(),
        };
        return `('${entry.id}', '${entry.name.replaceAll("'", "''")}', ${entry.age}, ST_SetSRID(ST_MakePoint(${entry.longitude}, ${entry.latitude}), 4326))`;
      });
      fs.writeFileSync(
        path.resolve(__dirname, "../../src/001_insert_data.sql"),
        `INSERT INTO people(id, name, age, position) VALUES \n  ${lines.join(",\n  ")};\n`
      );
    },
    toMilliseconds({ minutes: 5 })
  );
});
