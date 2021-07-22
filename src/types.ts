export interface AdditionalOptions {
  /**
   * If this option is `true`,then HTML will be generated and
   * inserted into template. Otherwise info about image will
   * be returned. For now is used for SVG.
   * By default, is `true`.
   */
  readonly toHTML?: boolean;
}
