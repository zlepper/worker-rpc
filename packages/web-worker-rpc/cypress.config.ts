import { defineConfig } from 'cypress'

export default defineConfig({
  fixturesFolder: false,
  screenshotOnRunFailure: false,
  video: false,
  fileServerFolder: 'tests',
  e2e: {
    supportFile: false,
    specPattern: 'tests/build/spec.js',
  },
})
