
import { Partytown } from '@builder.io/partytown/react'
const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');`

export const config = {
	unstable_runtimeJS: false,
};

export default function Home() {
  return (
    <>
      <Partytown
        debug={true}
        forward={['dataLayer.push']}
        resolveUrl={(url, location) => {

          // CORS 対策でrequestをreverse proxyする
          if (url.href.startsWith('https://')) {
            const host = url.host
            const path = url.pathname === '/' ? '' : url.pathname
            const search = url.search === '?' ? '' : url.search
            const proxyUrl = new URL(location.origin + '/proxy' + path + search)
            proxyUrl.searchParams.append(
              'target_party_host',
              host
            )
            return proxyUrl
          }
          return url
        }}
      />      {/** Google Tag Manager */}
      <script type="text/partytown" defer dangerouslySetInnerHTML={{__html: gtmScript}}></script>
      <div>test partytown</div>      
    </>
  )
}
