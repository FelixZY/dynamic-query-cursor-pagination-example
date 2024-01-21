# dynamic-query-cursor-pagination-example

**Note: the repository currently represents an initial point from which the
problem can be explored - it does not yet contain any solutions.**

This repository serves as an example of how to do cursor/keyset based pagination
with ordering on dynamically generated columns (such as word similarity and
distance to user).

I created this repository in response to a
[question I asked on Stack Overflow](https://stackoverflow.com/questions/77849239)
as a way to understand things better.

For information on how to configure your table for cursor based pagination,
please see
[`./src/init/zzz/000_create_table.sql`](./src/init/zzz/000_create_table.sql).

To experiment with different queries and convince yourself of a specific query's
performance, add or modify `*.test.ts` files in `./test` and run `npm test`.

## Getting Started

_The project makes use of VSCode's
[devcontainer feature](https://code.visualstudio.com/docs/devcontainers/containers)
to create a basic, common development environment. The following instructions
assume you are using this environment. If you do not want to use a devcontainer,
necessary steps to configure your local environment can be deduced from files in
the [`.devcontainer`](./.devcontainer) directory._

To run tests:

```
npm test
```

## License

[MIT](./LICENSE)
