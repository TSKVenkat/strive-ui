/**
 * Type definitions for minimist 1.2.8
 * Project: https://github.com/minimistjs/minimist
 */
declare module 'minimist' {
  /**
   * Parse argument options
   */
  function minimist(args: string[], opts?: minimist.Opts): minimist.ParsedArgs;
  
  namespace minimist {
    interface Opts {
      /**
       * A string or array of strings argument names to always treat as strings
       */
      string?: string | string[];
      
      /**
       * A boolean, string or array of strings to always treat as booleans.
       * If true, all double hyphenated arguments will be treated as booleans.
       */
      boolean?: boolean | string | string[];
      
      /**
       * An object mapping string names to strings or arrays of string argument names to use as aliases
       */
      alias?: { [key: string]: string | string[] };
      
      /**
       * An object mapping string argument names to default values
       */
      default?: { [key: string]: any };
      
      /**
       * When true, populate argv._ with everything after the first non-option
       */
      stopEarly?: boolean;
      
      /**
       * When true, populate argv._ with everything before the -- and argv['--'] with everything after the --
       */
      '--'?: boolean;
      
      /**
       * A function which is invoked with a command line parameter not defined in the opts configuration object.
       * If the function returns false, the unknown option is not added to argv
       */
      unknown?: (arg: string) => boolean;
    }

    interface ParsedArgs {
      /**
       * Contains all the arguments that didn't have an option associated with them
       */
      _: string[];
      
      /**
       * Contains all the arguments after -- if enabled with the -- option
       */
      ['--']?: string[];
      
      /**
       * Other keys will be the parsed options
       */
      [key: string]: any;
    }
  }
  
  export = minimist;
}
