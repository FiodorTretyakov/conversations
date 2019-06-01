# conversations

Find paths in conversations.

## Features

* get all the routes from starting point to end point, if the next route were already added to path, will not go this way. Example, route 1 links to 2 and 3, route 2 links to 1 only. It will add 2 paths: `1->2->1->3` and `1->3`;
* based on route id determine if the was endpoint-route in path. Example, route 2 is endpoint and it links to 3. For the route 3, the output will be true, because of 2 was before. And for the route 2 it will be true too, because of it was already reached;

## Configuration and Usage

Solution wrote on NodeJs 12.3.1 (Current). To run and debug it locally you need:

* download and install NodeJs: <https://nodejs.org/en/>, it is cross-platform;
* run:
  * place your files in the directory of the software;
  * execute `node runner.js` from command line;
  * to check is endpoint reached, you can change the second parameter in `runner.js`, just put here any route id;
  * **output** will be in console;
* test:
  * execute `npm test` from command line, it also will show the code coverage

## Instrumental, Technical and Design decisions

I used:

* git, because of it is easy work with versions, approaches, allow trace history;
* unit tests with code coverage to be sure that the solution works and regression tests;
* ES6 as much as possible due to clean code easy to read and maintain;
* eslint `Standard` mode to have automatically the same style and decrease possibility of code problems;
* functions, not procedures as much as possible, because it is much easier to test it and don't need to trace variable states;
* vscode, because of it is cross-platform, lightweight IDE, very useable, powerful and has extensions for all what I need;

## Implementation

The code has 3 modules:

* `conversations.js` contain:
  * class `Conversation` contains current path and current route id, it allows create more SOLID OOP code;
  * a lot of arrow functions, allow to easy test them and well encapsulation;
  * `getAllRoutes` and `isEndpointPassed` are wrappers for all the functions here, user should call them;
* `runner.js` just run the functions in `conversations.js`
* `test.js` run unit tests write in `mocha` with code coverage in `nyc`
