export class SearchParamsHandler {
  private searchParams: URLSearchParams

  constructor(searchParams: URLSearchParams) {
    this.searchParams = searchParams
  }

  /**
   * Retrieves a search parameter from the URL and returns its value.
   * If the parameter is not found returns the fallback instead.
   *
   * @template T - The expected type of the search parameter value.
   * @param {string} param - The name of the search parameter to retrieve.
   * @param {T} [fallback] - A fallback value to return if the parameter is not found.
   * @returns {T} - The value of the search parameter if found, or the fallback.
   */
  getSearchParam = <T>(param: string, fallback: T): T => {
    const value = this.searchParams.get(param) as T

    if (typeof value !== 'undefined' && value !== null) return value
    if (typeof fallback !== 'undefined') return fallback

    throw new Error(`Parameter '${param}' not found and no fallback provided.`)
  }
}
