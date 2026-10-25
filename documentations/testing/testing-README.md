# Application Testing

## Running the tests

To programmatically test this application, use the typescript tests in `tests/`. They use native bun tests. Each set of tests is bundled in its "describe" block, and `bun run test` runs all tests. You can run tests for a particular file by supplying the filename `bun run test path/to/file`.

Note: The tests will currently throw NETWORK ERRORS if you attempt to run `Integration.test.ts` and `Portal.test.ts` in the same session. Please test these two files separately.

No additional setup is required. All tests use an ephemeral empty test database, and the temporary database is cleared between each test.

## Writing new tests

All concept tests go in their respective files. Portal endpoint tests go in `Portal.test.ts`. Collect and Edit endpoints are tested in integration in `Integration.test.ts`.

All concept operations and queries should be tested. All endpoints should be tested. In the future, we may incorporate frontend testing via React's testing environment.
