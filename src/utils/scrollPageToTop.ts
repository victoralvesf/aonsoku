export function scrollPageToTop() {
  const el = document.querySelector('#main-scroll-area #scroll-viewport')

  if (el) {
    el.scrollTo({ top: 0 })
  }
}
