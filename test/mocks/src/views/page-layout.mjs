export default {
  top: function ({ head = '' } = {}) {
    return /* html*/ `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/components/styles.css"/>
        ${head}
      </head>
      <body>
  `
  },
  bottom: '</body></html>',
  document: function ({ head = '', body = '', scripts = '' }) {
    return /* html*/ `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/components/styles.css"/>
        ${head}
      </head>
      <body>
      ${body}
      ${scripts}
      </body>
    </html>`
  }
}
