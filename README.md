# WA Enquiry

A zero-dependency WhatsApp enquiry widget that helps visitors send useful, pre-qualified messages without a backend.

## Install

Copy `dist/wa-enquiry.js` into your site and configure it:

```html
<script src="https://cdn.jsdelivr.net/gh/oluwafey1kem1/wa-enquiry@main/dist/wa-enquiry.js"
  data-phone="2347038123516"
  data-name="Ikey Studio"
  data-message="Hi! I'd like to enquire about a project."
  defer></script>
```

Or use the source in `src/wa-enquiry.js`. Works on static sites and can be embedded in Framer, Webflow, WordPress and custom sites.

## Configuration

| Attribute | Purpose |
|---|---|
| `data-phone` | WhatsApp number in international format, digits only |
| `data-name` | Business name shown in the panel |
| `data-message` | Introductory message |
| `data-services` | Optional comma-separated service choices |
| `data-position` | `right` (default) or `left` |

The widget uses Shadow DOM to isolate styles, supports keyboard navigation and reduced-motion preferences, and emits `wa-enquiry:open` and `wa-enquiry:send` custom events for analytics.

## License
MIT
