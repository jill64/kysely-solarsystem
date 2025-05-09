import { attempt } from '@jill64/attempt'
import {
  CompiledQuery,
  DatabaseConnection,
  DatabaseIntrospector,
  Dialect,
  Driver,
  Kysely,
  QueryCompiler,
  QueryResult,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler
} from 'kysely'

export interface SolarSystemDialectConfig {
  teamName: string
  clusterName: string
  branchName: string
  apiKey: string
}

export class SolarSystemDialect implements Dialect {
  private config

  constructor(config: SolarSystemDialectConfig) {
    this.config = config
  }

  createAdapter() {
    return new SqliteAdapter()
  }

  createDriver(): Driver {
    return new SolarSystemDriver(this.config)
  }

  createQueryCompiler(): QueryCompiler {
    return new SqliteQueryCompiler()
  }

  createIntrospector<T>(db: Kysely<T>): DatabaseIntrospector {
    return new SqliteIntrospector(db)
  }
}

class SolarSystemDriver implements Driver {
  private config

  constructor(config: SolarSystemDialectConfig) {
    this.config = config
  }

  async init(): Promise<void> {}

  async acquireConnection(): Promise<DatabaseConnection> {
    return new SolarSystemConnection(this.config)
  }

  async beginTransaction(conn: SolarSystemConnection): Promise<void> {
    return await conn.beginTransaction()
  }

  async commitTransaction(conn: SolarSystemConnection): Promise<void> {
    return await conn.commitTransaction()
  }

  async rollbackTransaction(conn: SolarSystemConnection): Promise<void> {
    return await conn.rollbackTransaction()
  }

  async releaseConnection(): Promise<void> {}

  async destroy(): Promise<void> {}
}

class SolarSystemConnection implements DatabaseConnection {
  private config

  constructor(config: SolarSystemDialectConfig) {
    this.config = config
  }

  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    const res = await fetch('https://api.solarsystemdb.com/query', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`
      },
      body: JSON.stringify({
        team_name: this.config.teamName,
        cluster_name: this.config.clusterName,
        branch_name: this.config.branchName,
        sql: compiledQuery.sql,
        params: compiledQuery.parameters
      })
    })

    const text = await res.text()

    const results = attempt(
      () => JSON.parse(text),
      (e, o) => {
        throw new Error(
          `[SolarSystemDialect]: Failed to parse JSON response. 
${res.status} | ${res.statusText}
${e?.message ?? JSON.stringify(o, null, 2)}
${text}
`
        )
      }
    )

    const firstResult = results.result?.length ? results.result[0] : null

    const numAffectedRows =
      firstResult && firstResult.meta.changes > 0
        ? BigInt(firstResult.meta.changes)
        : undefined

    return {
      insertId:
        firstResult?.meta.last_row_id === undefined ||
        firstResult.meta.last_row_id === null
          ? undefined
          : BigInt(firstResult.meta.last_row_id),
      rows: (firstResult?.results ?? []) as O[],
      numAffectedRows,
      numUpdatedOrDeletedRows: numAffectedRows
    }
  }

  async beginTransaction() {
    throw new Error('[SolarSystemDialect]: beginTransaction are not supported.')
  }

  async commitTransaction() {
    throw new Error(
      '[SolarSystemDialect]: commitTransaction are not supported.'
    )
  }

  async rollbackTransaction() {
    throw new Error(
      '[SolarSystemDialect]: rollbackTransaction are not supported.'
    )
  }

  async *streamQuery<O>(): AsyncIterableIterator<QueryResult<O>> {
    throw new Error('[SolarSystemDialect]: streamQuery is not supported.')
  }
}
