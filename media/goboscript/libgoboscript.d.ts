/* tslint:disable */
/* eslint-disable */
export function initialize(): void;
export function deinitialize(): void;
export function build(fs: any): any;
export function diagnostic_to_string(diagnostic: any, sprite: any): string;
export type DiagnosticKind = "InvalidToken" | { UnrecognizedEof: string[] } | { UnrecognizedToken: [Token, string[]] } | { ExtraToken: Token } | { IOError: SmolStr } | { UnrecognizedReporter: SmolStr } | { UnrecognizedBlock: SmolStr } | { UnrecognizedVariable: SmolStr } | { UnrecognizedList: SmolStr } | { UnrecognizedEnum: SmolStr } | { UnrecognizedStruct: SmolStr } | { UnrecognizedProcedure: SmolStr } | { UnrecognizedFunction: SmolStr } | { UnrecognizedArgument: SmolStr } | { UnrecognizedStructField: SmolStr } | { UnrecognizedEnumVariant: { enum_name: SmolStr; variant_name: SmolStr } } | "UnrecognizedStandardLibraryHeader" | "UnexpectedTextAfterInclude" | "NoCostumes" | { DuplicateCostume: SmolStr } | { DuplicateBackdrop: SmolStr } | { InvalidCostumeName: SmolStr } | { InvalidBackdropName: SmolStr } | { BlockArgsCountMismatch: { block: Block; given: number } } | { ReprArgsCountMismatch: { repr: Repr; given: number } } | { ProcArgsCountMismatch: { proc: SmolStr; given: number } } | { FuncArgsCountMismatch: { func: SmolStr; given: number } } | { MacroArgsCountMismatch: { expected: number; given: number } } | { CommandFailed: { stderr: number[] } } | { ProcedureRedefinition: SmolStr } | { FunctionRedefinition: SmolStr } | { TypeMismatch: { expected: Type; given: Type } } | "NotStruct" | { StructDoesNotHaveField: { type_name: SmolStr; field_name: SmolStr } } | { MissingField: { struct_name: SmolStr; field_name: SmolStr } } | { EmptyStruct: SmolStr } | "FollowedByUnreachableCode" | { UnrecognizedKey: SmolStr } | { UnusedVariable: SmolStr } | { UnusedList: SmolStr } | { UnusedEnum: SmolStr } | { UnusedStruct: SmolStr } | { UnusedProc: SmolStr } | { UnusedFunc: SmolStr } | { UnusedArg: SmolStr } | { UnusedStructField: SmolStr } | { UnusedEnumVariant: SmolStr };

export interface SpriteDiagnostics {
    sprite_name: string;
    translation_unit: TranslationUnit;
    diagnostics: Diagnostic[];
    debug_info: DebugInfo;
}

export interface Artifact {
    project: Project;
    stage_diagnostics: SpriteDiagnostics;
    sprites_diagnostics: FxHashMap<SmolStr, SpriteDiagnostics>;
    block_count: number;
}

export interface Diagnostic {
    kind: DiagnosticKind;
    span: Span;
}

export type Owner = "Local" | "StandardLibrary";

/**
 * A section of a source file that is included in the translation unit.
 * This may be a section of the source file, or the entire source file.
 */
export interface Include {
    /**
     * The range that the source code of the include is in the translation unit.
     */
    unit_range: Span;
    source_range: Span;
    path: string;
    owner: Owner;
}

export interface TranslationUnit {
    path: string;
    text: number[];
    defines: FxHashSet<string>;
    includes: Include[];
    included: FxHashSet<string>;
    current_include: number;
}

export interface Project {
    stage: Sprite;
    sprites: FxHashMap<SmolStr, Sprite>;
}

export interface Data {
    inner: number[];
}

export interface MemFS {
    files: FxHashMap<string, Data>;
}

export interface Build {
    file: number[];
    artifact: Artifact;
}

export interface DebugInfo {
    blocks: FxHashMap<string, Span>;
    variables: FxHashMap<string, Span>;
    lists: FxHashMap<string, Span>;
    procs: FxHashMap<string, Span>;
    funcs: FxHashMap<string, Span>;
}


export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly build: (a: number) => number;
  readonly deinitialize: () => void;
  readonly diagnostic_to_string: (a: number, b: number, c: number) => void;
  readonly initialize: () => void;
  readonly __wbindgen_export_0: (a: number) => void;
  readonly __wbindgen_export_1: (a: number, b: number, c: number) => void;
  readonly __wbindgen_export_2: (a: number, b: number) => number;
  readonly __wbindgen_export_3: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
