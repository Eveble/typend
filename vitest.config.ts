import { defineConfig } from 'vitest/config';
import ts from 'typescript';
import path from 'path';

let tsProgram: ts.Program | null = null;
let tsSourceFiles: Map<string, ts.SourceFile> | null = null;

function getTsProgram(): ts.Program {
  if (tsProgram) return tsProgram;

  const configPath = ts.findConfigFile(
    __dirname,
    ts.sys.fileExists,
    'tsconfig.json'
  );
  if (!configPath) throw new Error('tsconfig.json not found');

  const configFile = ts.readConfigFile(configPath!, ts.sys.readFile);
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath),
    {
      noEmit: false,
      declaration: false,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2018,
      sourceMap: false,
    },
    configPath
  );

  tsProgram = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);

  tsSourceFiles = new Map();
  for (const sf of tsProgram.getSourceFiles()) {
    if (!sf.isDeclarationFile) {
      tsSourceFiles.set(sf.fileName, sf);
    }
  }

  return tsProgram;
}

const transformerPath = require.resolve(
  'tsruntime/dist/transform/transformer.js'
);
const transformerFactory = require(transformerPath).default;

export default defineConfig({
  plugins: [
    {
      name: 'tsruntime',
      enforce: 'pre',
      transform(code: string, id: string) {
        if (
          !id.endsWith('.ts') ||
          id.includes('node_modules') ||
          id.endsWith('.d.ts')
        ) {
          return null;
        }

        const prog = getTsProgram();
        const sourceFile = tsSourceFiles!.get(id);
        if (!sourceFile) return null;

        let outputCode = '';

        prog.emit(
          sourceFile,
          (fileName: string, text: string) => {
            if (fileName.endsWith('.js')) {
              outputCode = text;
            }
          },
          undefined,
          false,
          {
            before: [transformerFactory(prog)],
          }
        );

        if (!outputCode) return null;

        return {
          code: outputCode,
          map: { mappings: '' },
        };
      },
    },
  ],
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts', 'test/**/*.test.converter.ts'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 6000,
    globals: false,
  },
});
