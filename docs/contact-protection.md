# Contact protection

The handler restricts origins and methods, accepts JSON only, checks declared and
actual parsed body size (16 KiB), validates field types and lengths, uses a honeypot,
and limits email attempts to five per 15 minutes per client within one instance.
The actual-size check runs after platform parsing; it does not cap ingress memory.
The local adapter simulates delivery and never sends email.

## Shared protection — pending activation

The existing Vercel Hobby project `my-website` had no custom firewall rules when
inspected on 2026-09-10. An unpublished draft has been created:

- Name: Contact — observation des envois
- ID: `rule_contact_observation_des_envois_4l7GqJ`
- Conditions: Request Path equals `/api/contact` AND Method equals `POST`.
- Action: Log.

This draft neither blocks requests nor creates a shared counter. Publish the
observation phase from the Firewall review screen, review actual traffic, then
configure rate limiting for this same narrow scope. A starting proposal is 10
requests per 60 seconds per IP with HTTP 429 after validation in Preview. The
application's five-email limit remains complementary. Confirm the available plan
allowance and pricing in the dashboard before activating rate limiting.

The final rule must be tested against normal submissions, OPTIONS requests and
repeated POST requests. A shared IP may represent several visitors. No CAPTCHA,
global site block, external datastore or paid subscription was added.

- [Project rules](https://vercel.com/julien-esterbets-projects/my-website/firewall/rules)
- [Vercel rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)

## Rechecked on 2026-09-12

The authenticated Vercel dashboard still shows one staged change. Review Change
explicitly says it is not live and offers Publish for the observation rule above.
No publication or rule change was performed. Julien must publish the observation
step before traffic review and shared rate limiting can be completed.
