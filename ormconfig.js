module.exports = {
  type: 'sqlite',
  database: 'data/library.db',
  entities: ['dist/**/*.entity{.ts,.js}'],
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
  synchronize: true,
}
