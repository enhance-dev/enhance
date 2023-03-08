
![enhance-type](https://user-images.githubusercontent.com/76308/223791539-c5d96545-ed00-4cc7-b8f4-3f51900189f8.svg)

# Enhance<sup>beta</sup>

#### Enhance is an HTML-first full-stack web framework that gives you everything you need to build standards-based multi-page web apps that perform and scale.

[Enhance documentation](https://enhance.dev) | [Why Enhance?](https://enhance.dev/docs/learn/why-enhance) | [Enhance discord →](https://enhance.dev/discord)

## Quick start
`npx "@enhance/create@latest" ./myproject -y`
or use the [Begin CLI](https://begin.com)

## Deployment
[Begin is the best way to deploy Enhance apps](https://begin.com/)

## Modules that make up Enhance<sup>beta</sup>

- [Starter project](https://github.com/enhance-dev/enhance-starter-project) is what is installed by [`@enhance/create`](https://github.com/enhance-dev/create) and the [Begin CLI](begin.com/docs/)

- [arc-plugin-enhance](https://github.com/enhance-dev/arc-plugin-enhance) is an [Architect](https://arc.codes) plugin that customizes a default Architect project into an Enhance project.
Features it adds to a default Architect project are:
  - File based routing → [Documented here](https://enhance.dev/docs/learn/starter-project/structure)
  - API route mapping to REST methods → [Documented here](https://enhance.dev/docs/learn/starter-project/api)
  - [SSR of Custom Elements with `@enhance/enhance-ssr` ](https://github.com/enhance-dev/enhance-ssr) → [Documented here](https://enhance.dev/docs/learn/starter-project/elements)
  - [Style transforms for using Web Component styling syntax with `@enhance/enhance-style-transform`](https://github.com/enhance-dev/enhance-style-transform) → [Documented here](https://enhance.dev/docs/learn/concepts/styling/element-styles)
  - [Customization and styleguide generation to `/_styleguide` route with `@enhance/arc-plugin-styles`](https://github.com/enhance-dev/arc-plugin-styles) → [Documented here](https://enhance.dev/docs/learn/concepts/styling/utility-classes)
  - [CSS utility classes with `@enhance/enhance-styles`](https://github.com/enhance-dev/enhance-styles) → [Documented here](https://enhance.dev/docs/learn/concepts/styling/utility-classes)
  - [Dynamic lookup of fingerprinted static assets to `/_public` route with `@architect/asap`](https://github.com/architect/asap/) → [Documented here](https://enhance.dev/docs/learn/starter-project/public)
  - [Exposing files and `npm` modules to the browser `/browser` => `/_public/browser` with `@enhance/arc-plugin-rollup`](https://github.com/enhance-dev/arc-plugin-rollup) → [Documented here](https://enhance.dev/docs/learn/starter-project/browser)

