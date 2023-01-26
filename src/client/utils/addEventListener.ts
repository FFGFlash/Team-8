export default function addEventListener(
  event: string,
  callback: () => void,
  options: any = undefined,
  element: any = document
) {
  element.addEventListener(event, callback, options)
  return () => element.removeEventListener(event, callback, options)
}
