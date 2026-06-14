import { Address, OpenedContract, Sender, toNano } from '@ton/core';
import { VynxBondingCurve } from './generated/bondingCurve';

// Re-export del wrapper generado y de los tipos de mensaje
export { VynxBondingCurve } from './generated/bondingCurve';
export type { Buy, Sell } from './generated/bondingCurve';

/** 1 token = 10^9 (denominación nano, igual que el TON). */
export const ONE_TOKEN = 1_000_000_000n;

// Constantes de la curva recalibrada (deben coincidir con el contrato desplegado).
const INITIAL_PRICE = 1; // nanoTON por token (0.000000001 TON)
const PRICE_INCREMENT = 5; // nanoTON por token entero vendido (0.000000005 TON)

/**
 * Estima cuántos nano-tokens se compran gastando `budget` nanoTON desde `sold`.
 * Resuelve cost(T) = p0*T + (k/2)*T^2 = budget.
 * Es sólo una estimación local; el contrato verifica el coste real on-chain.
 */
export function estimateTokensForBudget(sold: bigint, budget: bigint): bigint {
    const soldTokens = Number(sold / ONE_TOKEN);
    const p0 = INITIAL_PRICE + soldTokens * PRICE_INCREMENT;
    const B = Number(budget);
    const k = PRICE_INCREMENT;
    const T = (-p0 + Math.sqrt(p0 * p0 + 2 * k * B)) / k;
    return BigInt(Math.max(0, Math.floor(T))) * ONE_TOKEN;
}

/**
 * Compra tokens gastando ~`tonAmount` TON. Se envía `tonAmount + gas`; el
 * excedente lo devuelve la curva. Devuelve la cantidad de nano-tokens comprada.
 *
 * @example
 *   const curve = client.open(VynxBondingCurve.fromAddress(VYNX_ADDRESSES.testCurve));
 *   await buy(curve, sender, toNano('1')); // gasta ~1 TON
 */
export async function buy(
    curve: OpenedContract<VynxBondingCurve>,
    via: Sender,
    tonAmount: bigint,
    gas: bigint = toNano('0.15'),
): Promise<bigint> {
    const sold = await curve.getSold();
    const amount = estimateTokensForBudget(sold, tonAmount);
    await curve.send(via, { value: tonAmount + gas }, { $$type: 'Buy', amount });
    return amount;
}

/**
 * Vende `tokenAmount` tokens enteros de vuelta a la curva (recupera TON).
 * Devuelve la cantidad de nano-tokens vendida.
 */
export async function sell(
    curve: OpenedContract<VynxBondingCurve>,
    via: Sender,
    tokenAmount: bigint,
    gas: bigint = toNano('0.1'),
): Promise<bigint> {
    const amount = tokenAmount * ONE_TOKEN;
    await curve.send(via, { value: gas }, { $$type: 'Sell', amount });
    return amount;
}

/** Estado legible de una bonding curve. */
export interface CurveState {
    /** Precio marginal actual por token, en nanoTON. */
    price: bigint;
    /** Tokens vendidos, en nano-tokens. */
    sold: bigint;
    /** Tokens vendidos, en tokens enteros. */
    soldTokens: bigint;
    /** Reserva acumulada, en nanoTON. */
    reserve: bigint;
    /** Umbral de graduación (reserva objetivo), en nanoTON. */
    graduationThreshold: bigint;
    /** Si ya se graduó. */
    graduated: boolean;
    /** Progreso a la graduación en % (reserva / umbral). */
    progress: number;
}

/** Lee el estado actual de la curva: precio, vendido, reserva y progreso. */
export async function getState(curve: OpenedContract<VynxBondingCurve>): Promise<CurveState> {
    const price = await curve.getCurrentPrice();
    const sold = await curve.getSold();
    const reserve = await curve.getReserve();
    const graduationThreshold = await curve.getGraduationThreshold();
    const graduated = await curve.getGraduated();
    const progress =
        graduationThreshold > 0n ? Number((reserve * 10000n) / graduationThreshold) / 100 : 0;
    return { price, sold, soldTokens: sold / ONE_TOKEN, reserve, graduationThreshold, graduated, progress };
}

/** Balance de un comprador en el libro de la curva (nano-tokens). */
export async function balanceOf(
    curve: OpenedContract<VynxBondingCurve>,
    account: Address,
): Promise<bigint> {
    return curve.getBalanceOf(account);
}
