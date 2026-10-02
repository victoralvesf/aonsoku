/** @type {import('tailwindcss').Config} */
// Scoped to the OBS widget bundle only. Pulling in the app's config would ship
// every utility used across Aonsoku into a page that renders one small card.
module.exports = {
  content: ['./widget.html', './src/widget/**/*.{ts,tsx}'],
  prefix: '',
  theme: {},
  plugins: [],
}
