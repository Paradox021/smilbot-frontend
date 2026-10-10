/**
 * Descarga una imagen para que ya esté en caché al mostrarla. Nunca falla: se resuelve al cargar,
 * al dar error o al pasar `timeoutMs`, para no bloquear a quien la espera.
 */
export function preloadImage(url: string | undefined, timeoutMs = 3000): Promise<void> {
  if (!url) return Promise.resolve()
  return new Promise((resolve) => {
    const image = new Image()
    const done = () => {
      window.clearTimeout(timer)
      image.onload = null
      image.onerror = null
      resolve()
    }
    const timer = window.setTimeout(done, timeoutMs)
    image.onload = done
    image.onerror = done
    image.src = url
  })
}
