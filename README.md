# tokenly

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Headed Component Tests with [Cypress Component Testing](https://on.cypress.io/component)

```sh
npm run test:unit:dev # or `npm run test:unit` for headless testing
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# Component descriptions

## Message

This component is used to display a message from a chat. It has a `message` prop that is an object with the following properties:

  * `message': The message to display
  * 'time': The time the message was sent
  * 'isMe': Whether the message was sent by the current user
  * 'seen': Whether the message has been seen by the recipient

### Message-format

Messages can be formated to display different types of content. For example a message can be a bid, a text message or a message indicating that someone has purchased your item. The message format is defined by what the message-string starts with. The following formats are supported:

  * 'bid': A bid message
  * 'acceptance/decline': A message indicating that someone has accepted or declined your bid
  * 'text': A text message
  * 'purchase': A purchase message

For example, a bid message would look like this:

```json
{
  "message": "{'type':'bid','amount':0.02,'bidId':'1234','itemId':'123'}",
  "time": "2021-05-01T12:00:00.000Z",
  "isMe": false,
  "seen": false
}
```

Accepted bid messages would look like this:

```json
{
  "message": "{'type':'acceptance','amount':0.02,'bidId':'1234','itemId':'123'}",
  "time": "2021-05-01T12:00:00.000Z",
  "isMe": true,
  "seen": true
}
```

Purchase messages would look like this:

```json
{
  "message": "{'type':'purchase','amount':0.02,'itemId':'123'}",
  "time": "2021-05-01T12:00:00.000Z",
  "isMe": false,
  "seen": true
}
```

Text messages would look like this:

```json
{
  "message": "This is a text message",
  "time": "2021-05-01T12:00:00.000Z",
  "isMe": false,
  "seen": true
}
```
