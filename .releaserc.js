module.exports = {
  branches: ["master" ],
  tagFormat: process.env.COUNTRY + "-v${version}",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits"
      }
    ],
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/github",
      {
        successComment: false,
        failComment: false,
        assets: [],
      }
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/git",
      {
        message: `Release(${countryCode}):` + " ${nextRelease.version}" + ` - ${new Date().toLocaleDateString("en-GB")}\n\n${nextRelease.notes}`
      }
    ],
    [
      "@saithodev/semantic-release-backmerge",
      {
        branches: ["master"]
      }
    ]
  ]
};

