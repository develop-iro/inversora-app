/** API hostnames allowed for strict native transport security in production builds. */
export const TRANSPORT_SECURITY_HOSTS = [
  'inversora-api-production.up.railway.app',
  'inversora-api-staging.up.railway.app',
] as const;

/** @deprecated Use TRANSPORT_SECURITY_HOSTS. This is not SPKI certificate pinning. */
export const SSL_PINNED_HOSTS = TRANSPORT_SECURITY_HOSTS;

export function isTransportSecurityHost(hostname: string): boolean {
  return TRANSPORT_SECURITY_HOSTS.includes(
    hostname.toLowerCase() as (typeof TRANSPORT_SECURITY_HOSTS)[number],
  );
}
