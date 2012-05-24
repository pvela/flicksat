// Set the require.js configuration for your application.
require.config({
  // Initialize the application with the main application file
  deps: ["main"],

  paths: {
    // JavaScript folders
    libs: "../js",
    plugins: "../js/plugins",

    // Libraries
    jquery: "../js/jquery",
    underscore: "../js/underscore",
    backbone: "../js/backbone",

    // Shim Plugin
    use: "../js/plugins/use"
  },

  use: {
    backbone: {
      deps: ["use!underscore", "jquery"],
      attach: "Backbone"
    },

    underscore: {
      attach: "_"
    }
  }
});
