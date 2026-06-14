// ============================================================================
//  VYNX SDK — punto de entrada único.
//  Copia esta carpeta `sdk/` dentro de tu app Next.js e importa desde aquí.
//
//  Requiere las dependencias: @ton/core, @ton/crypto
//  (y @ton/ton o @ton/sandbox para abrir contratos con un cliente/provider).
//
//  Uso típico:
//    import {
//      VYNX_ADDRESSES, VynxFactory, VynxBondingCurve, VynxJetton,
//      createCoin, buy, sell, getState, getMetadata,
//    } from '@/sdk';
// ============================================================================

export * from './addresses';
export * from './VynxFactory';
export * from './VynxBondingCurve';
export * from './VynxJetton';
