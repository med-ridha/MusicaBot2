const country = process.env.COUNTRY;
module.exports = {
  branches: ["master" ],
  tagFormat: country + "-v${version}",
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
        releaseNameTemplate: `Release(${country.toUpperCase()}):` + ` - ${new Date().toLocaleDateString("en-GB")}\n\n`,
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
        message: `Release(${country}):` + " ${nextRelease.version}" + ` - ${new Date().toLocaleDateString("en-GB")}\n\n` + "${nextRelease.notes}"
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

