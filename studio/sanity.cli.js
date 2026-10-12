import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'u4p2oauj',
    dataset: 'production',
  },
  deployment: {
    appId: 'eab0ljh89rba18ytja6qskv0',
    // Enable auto-updates for studios.
    // Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
    autoUpdates: true,
  },
})
