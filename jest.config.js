module.exports = {
    preset: '@vue/cli-plugin-unit-jest/presets/no-babel',
    moduleFileExtensions: ["js", "json", "vue"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
      "\\.(css|jpg|png|svg)$": "<rootDir>/__mocks__/mock.js",
    },
    transform: {
      "^.+\\.js$": "babel-jest",
    },
    transformIgnorePatterns: ["/node_modules/"],
  }