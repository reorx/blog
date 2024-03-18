import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})


const DOMAIN = 'reorx.com'

const hostMetaXML = `\
<?xml version="1.0" encoding="UTF-8"?>
<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
  <Link rel="lrdd" template="https://${DOMAIN}/.well-known/webfinger?resource={uri}" type="application/xrd+xml" />
</XRD>
`

app.get('/.well-known/host-meta', (c) => {
  c.header('Content-Type', 'application/xrd+xml; charset=utf-8')
  return c.body(hostMetaXML)
})


const acct = 'reorx@reorx.com'
const resourceOptions = [
  `acct:${acct}`,
  `acct:@${acct}`,
]
const webfinger = {
  "subject": "acct:" + acct,
  "aliases": [
    "https://reorx.com",
    "https://dabr.ca/users/reorx",
  ],
  "links": [
    {
      "rel": "http://webfinger.net/rel/profile-page",
      "type": "text/html",
      "href": "https://dabr.ca/users/reorx",
    },
    {
      "rel": "self",
      "type": "application/activity+json",
      "href": "https://dabr.ca/users/reorx",
    },
    {
      "rel": "http://ostatus.org/schema/1.0/subscribe",
      "template": "https://dabr.ca/ostatus_subscribe?acct={uri}",
    },
    {
      "rel": "http://webfinger.net/rel/avatar",
      "href": "https://reorx.com/forge-v2.png",
    },
    /*
    {
      "type": "application/ld+json; profile=\"https://www.w3.org/ns/activitystreams\"",
      "href": "https://dabr.ca/users/reorx",
      "rel": "self",
    },
    */
  ],
}

app.get('/.well-known/webfinger', (c) => {
  const resource = c.req.query('resource')
  if (!resourceOptions.includes(resource)) {
    c.status(400)
    return c.body('')
  }

  c.header('Content-Type', 'application/jrd+json')
  return c.body(JSON.stringify(webfinger, null, 2))
})

export default app
