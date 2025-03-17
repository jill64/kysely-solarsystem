<!----- BEGIN GHOST DOCS HEADER ----->

# kysely-solarsystem

<!----- BEGIN GHOST DOCS BADGES ----->

<a href="https://npmjs.com/package/kysely-solarsystem"><img src="https://img.shields.io/npm/v/kysely-solarsystem" alt="npm-version" /></a> <a href="https://npmjs.com/package/kysely-solarsystem"><img src="https://img.shields.io/npm/l/kysely-solarsystem" alt="npm-license" /></a> <a href="https://npmjs.com/package/kysely-solarsystem"><img src="https://img.shields.io/npm/dm/kysely-solarsystem" alt="npm-download-month" /></a> <a href="https://npmjs.com/package/kysely-solarsystem"><img src="https://img.shields.io/bundlephobia/min/kysely-solarsystem" alt="npm-min-size" /></a>

<!----- END GHOST DOCS BADGES ----->

💫 Kysely dialect for SolarSystemDB

<!----- END GHOST DOCS HEADER ----->

This library is a dialect for using [SolarSystemDB](https://solarsystemdb.com) with [Kysely](https://kysely.dev).

## Installation

```bash
npm i kysely-solarsystem
```

## Usage

```js
import { Kysely } from 'kysely'
import { SolarSystemDialect } from 'kysely-solarsystem'

const db = new Kysely({
  dialect: new SolarSystemDialect({
    teamName: 'team-name',
    clusterName: 'cluster-name',
    branchName: 'branch-name',
    apiKey: '<SOLARSYSTEMDB-API-KEY>'
  })
})
```

<!----- BEGIN GHOST DOCS FOOTER ----->

## License

[MIT](LICENSE)

<!----- END GHOST DOCS FOOTER ----->
