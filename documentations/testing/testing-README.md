# Application Testing

## Backend Testing

To programmatically test this application, use the typescript tests in `tests/`. They use native bun tests. Each set of tests is bundled in its "describe" block, and `bun run test` runs all tests. You can run tests for a particular file by supplying the filename `bun run test path/to/file`.

Note: The tests will currently throw NETWORK ERRORS if you attempt to run `Integration.test.ts` and `Portal.test.ts` in the same session. Please test these two files separately.

No additional setup is required. All tests use an ephemeral empty test database, and the temporary database is cleared between each test.

### Writing new tests

All concept tests go in their respective files. Portal endpoint tests go in `Portal.test.ts`. Collect and Edit endpoints are tested in integration in `Integration.test.ts`.

All concept operations and queries should be tested. All endpoints should be tested. In the future, we may incorporate frontend testing via React's testing environment.

## Frontend Testing

With React frontend testing environments yet to be set up, frontend testing is, for now, limited to manual testing. Here we document several focused frontend tests.

### JSON upload tests

Now that we support JSON uploads, testing frontend functionality is somewhat easier. We have included a few JSON files in [`test-jons/`](./test-jsons/) for various testing purposes.

- `template.json` is the template downloaded from the website. You can upload it back to the website to test that the uploader is functional.
- `moonrise.json` includes a selection of (slightly paraphrased) abilities from a real Guild game. It includes greek characters (as UTF literals for now) and linebreak characters. You can test how the website handles text formatting with this file.
- `testBatchDelete.json` uploads 4 abilities named "Delete Me!" to the website for deletion tests.
- We used to have an `unparsable.json` to test an error upload, but we took that file out. It is easy to make a JSON unparsable, though. Our file had 2 extra commas to the end of `template.json`.

### UI focus tests

Features that should undergo manual testing:

- **UI Responsiveness**. We try to test our app on as many phone screen ratios and as many operating systems as possible. We used the emulator in Google Chrome's dev mode to test various screen ratios, and we practiced tested the app on iOS (thank you Raleigh and Kat) and on Android (thank you Eagon). Particular features that require attention:
  - Nested scroll windows
  - Button "on hover" vs "on active" effects
  - Safari interacting unexpectedly with dvh
