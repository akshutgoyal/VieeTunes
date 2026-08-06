export async function openMiniPlayer() {
  const url = `${window.location.origin}${window.location.pathname}?mini=1`
  if (window.documentPictureInPicture?.requestWindow) {
    try {
      const pip = await window.documentPictureInPicture.requestWindow({ width: 300, height: 300 })
      pip.document.documentElement.style.cssText = 'width:100%;height:100%;margin:0;overflow:hidden;background:#151515;'
      pip.document.body.style.cssText = 'width:100%;height:100%;margin:0;overflow:hidden;background:#151515;'
      const frame = pip.document.createElement('iframe')
      frame.src = url
      frame.title = 'VieeTunes mini player'
      frame.style.cssText = 'position:absolute;inset:0;border:0;width:100%;height:100%;min-width:100%;min-height:100%;display:block;background:#151515;'
      pip.document.body.appendChild(frame)
      return pip
    } catch (error) { console.warn('Picture-in-Picture unavailable; using popup fallback.', error) }
  }
  const popup = window.open(url, 'vieetunes-mini-player', 'popup=yes,width=300,height=300,resizable=yes,scrollbars=no,top=80,left=80')
  popup?.focus()
  return popup
}
