const ts = require(`typescript`);
const transformer = require(`./transformer`).default;
const fs = require(`fs`);

const TEST_DIR = `test`

/**
 * @param {string[]} files - file paths to source files
 */
const compile = files => {
  /** @type {ts.CompilerOptions} */
  const opts = {
    allowJs: true,
    module: ts.ModuleKind.CommonJS,
    jsx: ts.JsxEmit.React,
    lib: [`es6`, `es2016`],
    outDir: `${TEST_DIR}/build`,
    target: ts.ScriptTarget.ES2015,
    allowSyntheticDefaultImports: true,
    noEmit: false
  };

  const host = ts.createCompilerHost(opts);
  const prg = ts.createProgram(files, opts, host);
  console.log(`compiler options: `, prg.getCompilerOptions());

  const { emitSkipped, diagnostics } = prg.emit(undefined, undefined, undefined, false, {
    before: [transformer(prg)],
    after: []
  });

  if (emitSkipped) {
    throw new Error(diagnostics.map(d => d.messageText).join(`\n`));
  }
};

compile(fs.readdirSync(`${TEST_DIR}/src`).map(f => `${TEST_DIR}/src/${f}`));
