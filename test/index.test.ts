import 'dotenv/config'
import { Kysely } from 'kysely'
import { env } from 'node:process'
import { expect, test } from 'bun:test'
import { SolarSystemDialect } from '../src'
import type { Database } from './schema'

test('E2E', async () => {
  const db = new Kysely<Database>({
    dialect: new SolarSystemDialect({
      teamName: env.SOLARSYSTEM_TEAM_NAME!,
      clusterName: env.SOLARSYSTEM_CLUSTER_NAME!,
      branchName: env.SOLARSYSTEM_BRANCH_NAME!,
      apiKey: env.SOLARSYSTEM_API_KEY!
    })
  })

  await db.schema
    .createTable('user')
    .addColumn('id', 'integer', (col) => col.primaryKey().autoIncrement())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .execute()

  try {
    const create_result = await db
      .insertInto('user')
      .values({
        name: 'Alice'
      })
      .executeTakeFirstOrThrow()

    console.log('create_result', create_result)

    const query_result = await db
      .selectFrom('user')
      .selectAll()
      .executeTakeFirstOrThrow()

    console.log('query_result', query_result)

    expect(query_result.id).toBe(1)
    expect(query_result.name).toBe('Alice')
  } catch (e) {
    await db.schema.dropTable('user').execute()
    throw e
  }

  await db.schema.dropTable('user').execute()
})
