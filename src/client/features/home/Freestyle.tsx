import tw from 'twin.macro'

export default function Freestyle() {
  return (
    <IFrame
      width='100%'
      height='300'
      scrolling='no'
      allow='autoplay'
      src='https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1386051928&color=%23ff0000&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true'
    ></IFrame>
  )
}

const IFrame = tw.iframe`border border-4 border-red-500`
