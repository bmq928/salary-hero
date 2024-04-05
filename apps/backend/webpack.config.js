const { NxWebpackPlugin } = require('@nx/webpack')
const { join } = require('path')
const isProd = process.env['NX_OPTS_GENERATE_PACKAGE_JSON'] === 'true'
const isBuildOrmDs = process.env['NX_OPTS_TYPEORM_DATASOURCE_BUILD'] === 'true'

const outputDir = isBuildOrmDs ? 'typeorm-datasource' : 'apps'
const entryFile = isBuildOrmDs ? 'ormconfig.ts' : 'main.ts'

module.exports = {
  output: {
    path: join(__dirname, `../../dist/${outputDir}/backend`),
    libraryTarget: 'commonjs', // this allow built file container export default (to run typeorm datasource)
  },
  plugins: [
    new NxWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: `./src/${entryFile}`,
      tsConfig: './tsconfig.app.json',
      optimization: false,
      outputHashing: 'none',
      ...(isProd ? { generatePackageJson: true } : {}),
      transformers: [
        {
          name: '@nestjs/swagger/plugin',
          options: {
            dtoFileNameSuffix: [
              '.dto.ts',
              // '.entity.ts',
              '.response.ts',
              // '.type.ts',
              // 'type.ts',
            ],
          },
        },
      ],
    }),
  ],
}
