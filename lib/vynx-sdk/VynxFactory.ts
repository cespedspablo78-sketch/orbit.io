import { Address, OpenedContract, Sender, toNano } from '@ton/core';
import { VynxFactory } from './generated/factory';

// Re-export del wrapper generado y de los tipos de mensaje
export { VynxFactory } from './generated/factory';
export type { CreateCoin, CoinCreated, SetThreshold } from './generated/factory';

/** Metadatos de una moneda a crear. */
export interface CoinMeta {
    name: string;
    ticker: string;
    description: string;
    imageUrl: string;
}

/**
 * Valor por defecto a enviar al crear una moneda.
 * createCost del contrato = fee (0.5) + despliegues (0.25) + gas (0.1) = 0.85 TON.
 * Enviamos 1 TON para tener margen; el excedente se devuelve al creador.
 */
export const DEFAULT_CREATE_VALUE = toNano('1');

/**
 * Crea una moneda nueva (despliega Jetton + BondingCurve enlazada).
 *
 * @example
 *   const factory = client.open(VynxFactory.fromAddress(VYNX_ADDRESSES.factory));
 *   await createCoin(factory, sender, { name, ticker, description, imageUrl });
 */
export async function createCoin(
    factory: OpenedContract<VynxFactory>,
    via: Sender,
    meta: CoinMeta,
    value: bigint = DEFAULT_CREATE_VALUE,
): Promise<void> {
    await factory.send(
        via,
        { value },
        {
            $$type: 'CreateCoin',
            name: meta.name,
            ticker: meta.ticker,
            description: meta.description,
            imageUrl: meta.imageUrl,
        },
    );
}

/**
 * Predice las direcciones del Jetton y la Curve que tendría una moneda,
 * sin crearla (útil para empezar a "observar" los contratos en el frontend).
 */
export async function predictCoinAddresses(
    factory: OpenedContract<VynxFactory>,
    creator: Address,
    meta: CoinMeta,
): Promise<{ jetton: Address; curve: Address }> {
    const jetton = await factory.getJettonAddress(
        creator,
        meta.name,
        meta.ticker,
        meta.description,
        meta.imageUrl,
    );
    const curve = await factory.getCurveAddress(jetton);
    return { jetton, curve };
}

/** Ajusta el umbral de graduación (en TON) para futuras monedas (sólo owner). */
export async function setThreshold(
    factory: OpenedContract<VynxFactory>,
    via: Sender,
    newThresholdTon: bigint,
    value: bigint = toNano('0.05'),
): Promise<void> {
    await factory.send(via, { value }, { $$type: 'SetThreshold', newThreshold: newThresholdTon });
}
