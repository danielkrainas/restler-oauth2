# Restler-OAuth2 [![Quality](https://codeclimate.com/github/danielkrainas/restler-oauth2/badges/gpa.svg)](https://codeclimate.com/github/danielkrainas/restler-oauth2) [![Build](https://img.shields.io/codeship/5a55d090-e3b6-0132-7527-5e88bc3b0df8/master.svg)](https://codeship.com/projects/81746) [![Test Coverage](https://codeclimate.com/github/danielkrainas/restler-oauth2/badges/coverage.svg)](https://codeclimate.com/github/danielkrainas/restler-oauth2/coverage)

Adds automatic OAuth2 authentication support and token to Restler services.

## Installation

Restler-OAuth2 can be installed via [npm](https://npmjs.org):

    $ npm install restler-oauth2

## Example

```js
var restler = require('restler');
var oauth2 = require('restler-oauth2');

oauth2.install(restler, {
    reauthStatusCode: '401'
});
```

## API 

## Bugs and Feedback

If you see a bug or have a suggestion, feel free to open an issue [here](https://github.com/danielkrainas/restler-oauth2/issues).

## Contributions

PR's welcome! There are no strict style guidelines, just follow best practices and try to keep with the general look & feel of the code present. All submissions must pass jshint and have a test to verify *(if applicable)*.

## License

[Unlicense](http://unlicense.org/UNLICENSE). This is a Public Domain work. 

[![Public Domain](https://licensebuttons.net/p/mark/1.0/88x31.png)](http://questioncopyright.org/promise)

> ["Make art not law"](http://questioncopyright.org/make_art_not_law_interview) -Nina Paley

