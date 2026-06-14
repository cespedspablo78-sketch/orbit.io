# VYNX SDK

SDK tipado y autocontenido para interactuar con los contratos VYNX en TON.
Copia toda la carpeta `sdk/` dentro de tu app Next.js (p.ej. `src/sdk/`).

## Dependencias

```bash
npm i @ton/core @ton/crypto @ton/ton @tonconnect/ui-react
```

## Contenido

- `addresses.ts` — direcciones desplegadas (testnet) + helper `tonscan()`.
- `VynxFactory.ts` — wrapper + `createCoin`, `predictCoinAddresses`, `setThreshold`.
- `VynxBondingCurve.ts` — wrapper + `buy`, `sell`, `getState`, `balanceOf`, `estimateTokensForBudget`.
- `VynxJetton.ts` — wrapper (minter + wallet) + `getMetadata`, `getTotalSupply`.
- `generated/` — wrappers generados por Tact (no editar a mano).

## Lectura (sin wallet) — TonClient

```ts
import { TonClient } from '@ton/ton';
import {
  VYNX_ADDRESSES, VynxBondingCurve, VynxJetton, getState, getMetadata,
} from '@/sdk';

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  // apiKey: process.env.NEXT_PUBLIC_TONCENTER_KEY, // recomendado para evitar 429
});

const curve = client.open(VynxBondingCurve.fromAddress(VYNX_ADDRESSES.testCurve));
const state = await getState(curve);
// { price, sold, soldTokens, reserve, graduationThreshold, graduated, progress }

const jetton = client.open(VynxJetton.fromAddress(VYNX_ADDRESSES.testJetton));
const meta = await getMetadata(jetton); // { name, ticker, description, imageUrl }
```

## Escritura (con wallet) — TON Connect

`useTonConnectUI()` da un `sender` compatible. Pásalo a los helpers:

```ts
import { TonClient } from '@ton/ton';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano } from '@ton/core';
import {
  VYNX_ADDRESSES, VynxFactory, VynxBondingCurve, createCoin, buy, sell,
} from '@/sdk';

const [tonConnectUI] = useTonConnectUI();
const sender = tonConnectUI.connector; // o un Sender adaptado de tonConnectUI

const client = new TonClient({ endpoint: '...' });

// Crear moneda (despliega Jetton + Curve)
const factory = client.open(VynxFactory.fromAddress(VYNX_ADDRESSES.factory));
await createCoin(factory, sender, {
  name: 'My Coin', ticker: 'MYC',
  description: 'Lanzada en VYNX', imageUrl: 'https://.../img.png',
});

// Comprar ~1 TON
const curve = client.open(VynxBondingCurve.fromAddress(VYNX_ADDRESSES.testCurve));
await buy(curve, sender, toNano('1'));

// Vender 100 tokens
await sell(curve, sender, 100n);
```

> Nota: las unidades de tokens usan 9 decimales (1 token = 10^9). `sell(curve, sender, 100n)`
> vende 100 tokens enteros. `getState().soldTokens` ya viene en tokens enteros.

## Direcciones (testnet)

| Contrato | Dirección |
|---|---|
| VynxFactory | `EQBh_zEYOv58gfh6l4qnrxQARnoYdALZO54ha9jz7OPPlw7d` |
| Test Jetton (VTEST) | `kQCNsX2NbN8cRACkBjEKA1wOCddK7DJqCXSRBiE1OsokTtsi` |
| Test Curve | `kQBZ2-LOXsrIJnq3N-Eja7fW6TEJEA-yOFJXuLET8cbmkgw_` |
