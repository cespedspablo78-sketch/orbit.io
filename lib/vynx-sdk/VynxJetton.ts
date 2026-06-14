import { Cell, Dictionary, OpenedContract } from '@ton/core';
import { sha256_sync } from '@ton/crypto';
import { VynxJetton } from './generated/jetton';

// Re-export de los wrappers generados (minter y wallet)
export { VynxJetton } from './generated/jetton';
export { JettonWallet } from './generated/jettonWallet';

/** Metadatos legibles del jetton (TEP-64 on-chain). */
export interface JettonMetadata {
    name: string;
    ticker: string;
    description: string;
    imageUrl: string;
}

/** Clave del diccionario on-chain = sha256(atributo) como uint256. */
function metadataKey(name: string): bigint {
    return BigInt('0x' + sha256_sync(name).toString('hex'));
}

/** Lee una celda "snake" (prefijo 0x00 + string, encadenado por refs). */
function readSnake(cell: Cell): string {
    const slice = cell.beginParse();
    slice.loadUint(8); // prefijo snake 0x00
    return slice.loadStringTail();
}

/**
 * Lee y decodifica la metadata on-chain del jetton.
 *
 * @example
 *   const jetton = client.open(VynxJetton.fromAddress(VYNX_ADDRESSES.testJetton));
 *   const meta = await getMetadata(jetton); // { name, ticker, description, imageUrl }
 */
export async function getMetadata(jetton: OpenedContract<VynxJetton>): Promise<JettonMetadata> {
    const data = await jetton.getGetJettonData();
    const cs = data.content.beginParse();
    cs.loadUint(8); // prefijo on-chain 0x00
    const dict = cs.loadDict(Dictionary.Keys.BigUint(256), Dictionary.Values.Cell());

    const read = (attr: string): string => {
        const cell = dict.get(metadataKey(attr));
        return cell ? readSnake(cell) : '';
    };

    return {
        name: read('name'),
        ticker: read('symbol'),
        description: read('description'),
        imageUrl: read('image'),
    };
}

/** Total supply acuñado del jetton (nano-tokens). */
export async function getTotalSupply(jetton: OpenedContract<VynxJetton>): Promise<bigint> {
    const data = await jetton.getGetJettonData();
    return data.totalSupply;
}
