import { Address } from '@ton/core';

/**
 * Direcciones de los contratos VYNX desplegados.
 *
 * `*Str` son las cadenas crudas (útiles para mostrar/links a tonscan);
 * los `Address` ya parseados se usan con los wrappers (`fromAddress`).
 */
export const VYNX_NETWORK = 'testnet' as const;

export const VYNX_ADDRESSES_STR = {
    factory: 'EQBh_zEYOv58gfh6l4qnrxQARnoYdALZO54ha9jz7OPPlw7d',
    // Moneda de prueba creada con la factory (economía recalibrada Pump.fun)
    testJetton: 'kQCNsX2NbN8cRACkBjEKA1wOCddK7DJqCXSRBiE1OsokTtsi',
    testCurve: 'kQBZ2-LOXsrIJnq3N-Eja7fW6TEJEA-yOFJXuLET8cbmkgw_',
} as const;

export const VYNX_ADDRESSES = {
    factory: Address.parse(VYNX_ADDRESSES_STR.factory),
    testJetton: Address.parse(VYNX_ADDRESSES_STR.testJetton),
    testCurve: Address.parse(VYNX_ADDRESSES_STR.testCurve),
} as const;

/** Enlace al explorador de testnet para una dirección. */
export function tonscan(address: Address | string): string {
    const a = typeof address === 'string' ? address : address.toString({ testOnly: true, bounceable: true });
    return `https://testnet.tonscan.org/address/${a}`;
}
