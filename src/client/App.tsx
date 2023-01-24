import { Helmet } from 'react-helmet'
import LazyOutlet from './components/LazyOutlet'

import Icon16x16 from 'client/assets/image/favicon-16x16.png'
import Icon32x32 from 'client/assets/image/favicon-32x32.png'
import Icon48x48 from 'client/assets/image/favicon.png'
import Icon180x180 from 'client/assets/image/apple-touch-icon.png'
import Icon192x192 from 'client/assets/image/192x192.png'
import Icon512x512 from 'client/assets/image/512x512.png'

export default function App() {
  return (
    <>
      <Helmet>
        <meta charSet='UTF-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='msapplication-TileColor' content='#D83434' />
        <meta name='msapplication-TileImage' content={Icon192x192} />
        <link rel='apple-touch-icon-precomposed' href={Icon180x180} />
        <link rel='icon' sizes='16x16' href={Icon16x16} />
        <link rel='icon' sizes='32x32' href={Icon32x32} />
        <link rel='icon' sizes='48x48' href={Icon48x48} />
        <link rel='icon' sizes='180x180' href={Icon180x180} />
        <link rel='icon' sizes='192x192' href={Icon192x192} />
        <link rel='icon' sizes='512x512' href={Icon512x512} />
        <title>Team 8</title>
      </Helmet>
      <LazyOutlet />
    </>
  )
}
