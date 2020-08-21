# The Hitchhiker's Guide to Compression

[![Build Status](https://travis-ci.com/go-compression/go-compression.github.io.svg?branch=master)](https://travis-ci.com/go-compression/go-compression.github.io)

This repo contains the source Jekyll files for [The Hitchhiker's Guide to Compression](https://go-compression.github.io/) on GitHub Pages.

## Building Locally

If you decide to contribute it may be a good idea (depending on the scope of your contribution) to build the website locally so you can build and test your changes live. This project uses [Jekyll](https://jekyllrb.com/) to build the static website for GitHub Pages, along with the theme, "[just-the-docs](https://github.com/pmarsceill/just-the-docs)".

To run the site locally or build the files, you'll need to first **[install Ruby](https://www.ruby-lang.org/en/documentation/installation/)**.

Once installed, go ahead and install [Ruby Bundler](https://bundler.io/) so you can install the dependencies.

```console
$ sudo gem install bundler
```

Now you'll want to install the local dependencies, Bundler makes this simple (make sure you're in the project root):

```console
$ bundle install
```

Now you should be able to serve the site locally with `jekyll serve`.

```
$ bundle exec jekyll serve --config _config-dev.yml
Server address: http://127.0.0.1:4000
Server running... press ctrl-c to stop.
```

## Running Locally

To make development just a bit easier, you can also use the wonderful [browser-sync](https://www.npmjs.com/package/browser-sync) NPM package which allows you to make a modification to any file, and see the change quickly without refreshing. This makes the development process easier as you don't have to constantly alt-tab between windows and hit the refresh button to see your change. However, this process is completely optional as it requires a few hundred MBs in `node_modules` alone and requires an installation of Node so using `jekyll serve` is more than enough if you don't want to worry about Node.

This project uses [gulp](https://gulpjs.com/) to handle the browser reloads and proxying of jekyll for browser-sync. To get started, first [make sure you have Node installed](https://nodejs.org/en/download/). Once `node` and `npm` are installed on your path, install the dependencies with `npm install`. You'll also want to install `gulp` globally so you can use it from your PATH.

```console
$ npm install
$ sudo npm install -g gulp
```

Now, it's as simple as running `gulp`

```console
$ gulp
[Browsersync] Access URLs:
`-------------------------------------`
       Local: http://localhost:3000
    External: http://172.21.61.88:3000
`-------------------------------------`
          UI: http://localhost:3001
 UI External: http://localhost:3001
`-------------------------------------`
```

You can now navigate to [localhost:3000](http://localhost:3000) and any changes you make to the site should now be shown live!

## The Tale of Two \_config.yml's

You may wonder why you use the \_config-dev.yml to run it locally instead of just the \_config.yml, and the answer is that GitHub Pages doesn't like complicated build processes.

The \_config-dev.yml is what's used to build the site locally and by Travis CI, once built Travis will upload the compiled files to the `(gh-pages)[https://github.com/go-compression/go-compression.github.io/tree/gh-pages]` branch. Once pushed, GitHub Pages will use the \_travis.yml file to serve the compiled site from the docs/ folder. This means that you can use any Jekyll build process you want, and GitHub Pages will serve the compiled version.
