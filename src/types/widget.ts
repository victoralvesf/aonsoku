// Single source of truth lives next to the main process code, so the HTTP
// server and the renderer can never drift apart. Re-exported here to give the
// renderer and the widget bundle a `@/` import path.
export * from '../../electron/main/core/widgetTypes'
