# objeasy

A lightweight utility toolkit to control and manage plain JavaScript objects with precision.

## Features

- Pick specific keys from an object (`pickit`)
- Modify object entries with optional key erasure (`modifyit`)
- Strict input validation
- No dependencies

## Installation

```bash
npm install objeasy
```

## Usage

```js

const { pickit, modifyit } = require('objeasy');

const user = { name: 'Mohammed', age: 30, role: 'dev' };

const result = pickit(user, ['name', 'role']);
console.log(result);
// { name: 'Mohammed', role: 'dev' }

modifyit(user, { role: 'admin' });
console.log(user);
// { name: 'Mohammed', age: 30, role: 'admin' }
```
