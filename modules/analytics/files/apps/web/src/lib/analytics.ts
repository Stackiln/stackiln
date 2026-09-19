export type ProductEvents = { "page.viewed": { path: string } };
export type Analytics = { track<K extends keyof ProductEvents>(name: K, properties: ProductEvents[K]): void; identify(id: string): void; group(id: string): void; reset(): void };

const local: Analytics = {
  track(name, properties) { if (process.env.NODE_ENV === "development") console.info("analytics", name, properties); },
  identify() {}, group() {}, reset() {}
};
export const analytics: Analytics = local;
