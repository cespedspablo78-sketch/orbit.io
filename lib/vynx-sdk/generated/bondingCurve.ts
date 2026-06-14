import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadGetterTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function storeTupleDeploy(source: Deploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadGetterTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function storeTupleDeployOk(source: DeployOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadGetterTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function storeTupleFactoryDeploy(source: FactoryDeploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

export function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type Buy = {
    $$type: 'Buy';
    amount: bigint;
}

export function storeBuy(src: Buy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1038959673, 32);
        b_0.storeCoins(src.amount);
    };
}

export function loadBuy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1038959673) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadCoins();
    return { $$type: 'Buy' as const, amount: _amount };
}

export function loadTupleBuy(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'Buy' as const, amount: _amount };
}

export function loadGetterTupleBuy(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'Buy' as const, amount: _amount };
}

export function storeTupleBuy(source: Buy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserBuy(): DictionaryValue<Buy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBuy(src)).endCell());
        },
        parse: (src) => {
            return loadBuy(src.loadRef().beginParse());
        }
    }
}

export type Sell = {
    $$type: 'Sell';
    amount: bigint;
}

export function storeSell(src: Sell) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(3956462082, 32);
        b_0.storeCoins(src.amount);
    };
}

export function loadSell(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 3956462082) { throw Error('Invalid prefix'); }
    const _amount = sc_0.loadCoins();
    return { $$type: 'Sell' as const, amount: _amount };
}

export function loadTupleSell(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'Sell' as const, amount: _amount };
}

export function loadGetterTupleSell(source: TupleReader) {
    const _amount = source.readBigNumber();
    return { $$type: 'Sell' as const, amount: _amount };
}

export function storeTupleSell(source: Sell) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    return builder.build();
}

export function dictValueParserSell(): DictionaryValue<Sell> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSell(src)).endCell());
        },
        parse: (src) => {
            return loadSell(src.loadRef().beginParse());
        }
    }
}

export type VynxBondingCurve$Data = {
    $$type: 'VynxBondingCurve$Data';
    jettonAddress: Address;
    owner: Address;
    reserve: bigint;
    sold: bigint;
    totalSupply: bigint;
    graduationThreshold: bigint;
    graduated: boolean;
    balances: Dictionary<Address, bigint>;
    initialPrice: bigint;
    priceIncrement: bigint;
}

export function storeVynxBondingCurve$Data(src: VynxBondingCurve$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.jettonAddress);
        b_0.storeAddress(src.owner);
        b_0.storeCoins(src.reserve);
        b_0.storeCoins(src.sold);
        b_0.storeCoins(src.totalSupply);
        const b_1 = new Builder();
        b_1.storeCoins(src.graduationThreshold);
        b_1.storeBit(src.graduated);
        b_1.storeDict(src.balances, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257));
        b_1.storeCoins(src.initialPrice);
        b_1.storeCoins(src.priceIncrement);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadVynxBondingCurve$Data(slice: Slice) {
    const sc_0 = slice;
    const _jettonAddress = sc_0.loadAddress();
    const _owner = sc_0.loadAddress();
    const _reserve = sc_0.loadCoins();
    const _sold = sc_0.loadCoins();
    const _totalSupply = sc_0.loadCoins();
    const sc_1 = sc_0.loadRef().beginParse();
    const _graduationThreshold = sc_1.loadCoins();
    const _graduated = sc_1.loadBit();
    const _balances = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), sc_1);
    const _initialPrice = sc_1.loadCoins();
    const _priceIncrement = sc_1.loadCoins();
    return { $$type: 'VynxBondingCurve$Data' as const, jettonAddress: _jettonAddress, owner: _owner, reserve: _reserve, sold: _sold, totalSupply: _totalSupply, graduationThreshold: _graduationThreshold, graduated: _graduated, balances: _balances, initialPrice: _initialPrice, priceIncrement: _priceIncrement };
}

export function loadTupleVynxBondingCurve$Data(source: TupleReader) {
    const _jettonAddress = source.readAddress();
    const _owner = source.readAddress();
    const _reserve = source.readBigNumber();
    const _sold = source.readBigNumber();
    const _totalSupply = source.readBigNumber();
    const _graduationThreshold = source.readBigNumber();
    const _graduated = source.readBoolean();
    const _balances = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _initialPrice = source.readBigNumber();
    const _priceIncrement = source.readBigNumber();
    return { $$type: 'VynxBondingCurve$Data' as const, jettonAddress: _jettonAddress, owner: _owner, reserve: _reserve, sold: _sold, totalSupply: _totalSupply, graduationThreshold: _graduationThreshold, graduated: _graduated, balances: _balances, initialPrice: _initialPrice, priceIncrement: _priceIncrement };
}

export function loadGetterTupleVynxBondingCurve$Data(source: TupleReader) {
    const _jettonAddress = source.readAddress();
    const _owner = source.readAddress();
    const _reserve = source.readBigNumber();
    const _sold = source.readBigNumber();
    const _totalSupply = source.readBigNumber();
    const _graduationThreshold = source.readBigNumber();
    const _graduated = source.readBoolean();
    const _balances = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _initialPrice = source.readBigNumber();
    const _priceIncrement = source.readBigNumber();
    return { $$type: 'VynxBondingCurve$Data' as const, jettonAddress: _jettonAddress, owner: _owner, reserve: _reserve, sold: _sold, totalSupply: _totalSupply, graduationThreshold: _graduationThreshold, graduated: _graduated, balances: _balances, initialPrice: _initialPrice, priceIncrement: _priceIncrement };
}

export function storeTupleVynxBondingCurve$Data(source: VynxBondingCurve$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.jettonAddress);
    builder.writeAddress(source.owner);
    builder.writeNumber(source.reserve);
    builder.writeNumber(source.sold);
    builder.writeNumber(source.totalSupply);
    builder.writeNumber(source.graduationThreshold);
    builder.writeBoolean(source.graduated);
    builder.writeCell(source.balances.size > 0 ? beginCell().storeDictDirect(source.balances, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeNumber(source.initialPrice);
    builder.writeNumber(source.priceIncrement);
    return builder.build();
}

export function dictValueParserVynxBondingCurve$Data(): DictionaryValue<VynxBondingCurve$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVynxBondingCurve$Data(src)).endCell());
        },
        parse: (src) => {
            return loadVynxBondingCurve$Data(src.loadRef().beginParse());
        }
    }
}

 type VynxBondingCurve_init_args = {
    $$type: 'VynxBondingCurve_init_args';
    owner: Address;
    jettonAddress: Address;
    graduationThreshold: bigint;
}

function initVynxBondingCurve_init_args(src: VynxBondingCurve_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.jettonAddress);
        b_0.storeInt(src.graduationThreshold, 257);
    };
}

async function VynxBondingCurve_init(owner: Address, jettonAddress: Address, graduationThreshold: bigint) {
    const __code = Cell.fromHex('b5ee9c724102270100077f000228ff008e88f4a413f4bcf2c80bed5320e303ed43d9011b0202710216020120030e020120040601b1b592dda89a1a400031c49f481f481f401f401f401a803a1f401a401e809f401f4006020b420b220b020ae20acd8351c47f481f481020203ae00aa4007a2b0dae040208ab504601bc16d674ec80000e08606e2ebc5b678d943005000226020120070c020158080a01b4abbced44d0d200018e24fa40fa40fa00fa00fa00d401d0fa00d200f404fa00fa0030105a10591058105710566c1a8e23fa40fa40810101d700552003d1586d702010455a82300de0b6b3a76400007043037175e25509db3c6ca109010c5270a127db3c2301b4ab09ed44d0d200018e24fa40fa40fa00fa00fa00d401d0fa00d200f404fa00fa0030105a10591058105710566c1a8e23fa40fa40810101d700552003d1586d702010455a82300de0b6b3a76400007043037175e25509db3c6ca10b010e5270a05270db3c2301b1b094bb513434800063893e903e903e803e803e803500743e8034803d013e803e800c0416841644160415c4159b06a388fe903e9020404075c0154800f4561b5c08041156a08c03782dace9d900001c10c0dc5d78b6cf1b28600d010626db3c240201200f1101b1b628fda89a1a400031c49f481f481f401f401f401a803a1f401a401e809f401f4006020b420b220b020ae20acd8351c47f481f481020203ae00aa4007a2b0dae040208ab504601bc16d674ec80000e08606e2ebc5b678d94301000022402016e121401b4aa93ed44d0d200018e24fa40fa40fa00fa00fa00d401d0fa00d200f404fa00fa0030105a10591058105710566c1a8e23fa40fa40810101d700552003d1586d702010455a82300de0b6b3a76400007043037175e25509db3c6ca1130104db3c2201b0a8e5ed44d0d200018e24fa40fa40fa00fa00fa00d401d0fa00d200f404fa00fa0030105a10591058105710566c1a8e23fa40fa40810101d700552003d1586d702010455a82300de0b6b3a76400007043037175e2db3c6ca115000c26a76426a904020158171901b1b4d99da89a1a400031c49f481f481f401f401f401a803a1f401a401e809f401f4006020b420b220b020ae20acd8351c47f481f481020203ae00aa4007a2b0dae040208ab504601bc16d674ec80000e08606e2ebc5b678d94301800022701b1b52c9da89a1a400031c49f481f481f401f401f401a803a1f401a401e809f401f4006020b420b220b020ae20acd8351c47f481f481020203ae00aa4007a2b0dae040208ab504601bc16d674ec80000e08606e2ebc5b678d94301a00022301ee3001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e24fa40fa40fa00fa00fa00d401d0fa00d200f404fa00fa0030105a10591058105710566c1a8e23fa40fa40810101d700552003d1586d702010455a82300de0b6b3a76400007043037175e20b925f0be009d70d1ff2e082211c04f882103ded4439ba8ff131fa00308200b68023b3f2f48200eecf21c200f2f48200d49f5361a026bbf2f45350a02610ab109a0809106710561045034c44db3c82008a4ff8416f24135f0322bef2f45188a0517ba02381010bf842f84210ae109d108b1047106e105d104b103b4ed0db3c33502ea010394cb0810101e02123221d2002fc216e955b59f4593098c801cf004133f441e2820afaf080f8416f24135f035009a15308bc8e3df84209a118706d5a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb00923037e25325be8e911049103847154664db3c09103846745025de1e1f007c337f705459996d5a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb000300661049103847154664c87f01ca005590509ace17ce5005fa025003fa0201fa02c858fa0212ca0012f40058fa0258fa02cdc9ed5402308210ebd2d202bae302018210946a98b6bae3025f0bf2c082212603f431fa00308200b68023b3f2f48200eecf21c200f2f4f842109a10891078106710561045103443b0db3c8200a04553c1bbf2f4537ba12810bc10ac109c080706050443130cdb3c816bf65319bbf2f45188a1517ca181010bf84250dea110344cd0810101216e955b59f4593098c801cf004133f441e2f842500770222325004481010b24028101014133f40a6fa19401d70030925b6de2206e923070e0206ef2d080025255912bdb3c55902bdb3c1ba0ab0050bca11ba882103b9aca00a904107a1069105810471036454043302424001a82103b9aca00a90421a85220a000de6d5a6d6d40037fc8cf8580ca00cf8440ce01fa028069cf40025c6e016eb0935bcf819d58cf8680cf8480f400f400cf81e2f400c901fb0010791068104710461035440302c87f01ca005590509ace17ce5005fa025003fa0201fa02c858fa0212ca0012f40058fa0258fa02cdc9ed5400dcd33f30c8018210aff90f5758cb1fcb3fc9108a10791068105710461035443012f84270705003804201503304c8cf8580ca00cf8440ce01fa02806acf40f400c901fb00c87f01ca005590509ace17ce5005fa025003fa0201fa02c858fa0212ca0012f40058fa0258fa02cdc9ed545942e77a');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initVynxBondingCurve_init_args({ $$type: 'VynxBondingCurve_init_args', owner, jettonAddress, graduationThreshold })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const VynxBondingCurve_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
    27638: { message: "Not enough reserve" },
    35407: { message: "Insufficient TON" },
    41029: { message: "Not enough tokens" },
    46720: { message: "Curve already graduated" },
    54431: { message: "Not enough supply" },
    61135: { message: "Amount must be positive" },
} as const

export const VynxBondingCurve_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
    "Not enough reserve": 27638,
    "Insufficient TON": 35407,
    "Not enough tokens": 41029,
    "Curve already graduated": 46720,
    "Not enough supply": 54431,
    "Amount must be positive": 61135,
} as const

const VynxBondingCurve_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SignedBundle","header":null,"fields":[{"name":"signature","type":{"kind":"simple","type":"fixed-bytes","optional":false,"format":64}},{"name":"signedData","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Buy","header":1038959673,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"Sell","header":3956462082,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"VynxBondingCurve$Data","header":null,"fields":[{"name":"jettonAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"reserve","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"sold","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalSupply","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"graduationThreshold","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"graduated","type":{"kind":"simple","type":"bool","optional":false}},{"name":"balances","type":{"kind":"dict","key":"address","value":"int"}},{"name":"initialPrice","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"priceIncrement","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
]

const VynxBondingCurve_opcodes = {
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "Buy": 1038959673,
    "Sell": 3956462082,
}

const VynxBondingCurve_getters: ABIGetter[] = [
    {"name":"currentPrice","methodId":78418,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"buyPrice","methodId":77577,"arguments":[{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"sellPrice","methodId":76732,"arguments":[{"name":"amount","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"reserve","methodId":116428,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"sold","methodId":68758,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"graduated","methodId":125284,"arguments":[],"returnType":{"kind":"simple","type":"bool","optional":false}},
    {"name":"graduationThreshold","methodId":86343,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"balanceOf","methodId":96915,"arguments":[{"name":"account","type":{"kind":"simple","type":"address","optional":false}}],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
    {"name":"progress","methodId":97509,"arguments":[],"returnType":{"kind":"simple","type":"int","optional":false,"format":257}},
]

export const VynxBondingCurve_getterMapping: { [key: string]: string } = {
    'currentPrice': 'getCurrentPrice',
    'buyPrice': 'getBuyPrice',
    'sellPrice': 'getSellPrice',
    'reserve': 'getReserve',
    'sold': 'getSold',
    'graduated': 'getGraduated',
    'graduationThreshold': 'getGraduationThreshold',
    'balanceOf': 'getBalanceOf',
    'progress': 'getProgress',
}

const VynxBondingCurve_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"Buy"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Sell"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
]

export const ONE_TOKEN = 1000000000n;

export class VynxBondingCurve implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = VynxBondingCurve_errors_backward;
    public static readonly opcodes = VynxBondingCurve_opcodes;
    
    static async init(owner: Address, jettonAddress: Address, graduationThreshold: bigint) {
        return await VynxBondingCurve_init(owner, jettonAddress, graduationThreshold);
    }
    
    static async fromInit(owner: Address, jettonAddress: Address, graduationThreshold: bigint) {
        const __gen_init = await VynxBondingCurve_init(owner, jettonAddress, graduationThreshold);
        const address = contractAddress(0, __gen_init);
        return new VynxBondingCurve(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new VynxBondingCurve(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  VynxBondingCurve_types,
        getters: VynxBondingCurve_getters,
        receivers: VynxBondingCurve_receivers,
        errors: VynxBondingCurve_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: Buy | Sell | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Buy') {
            body = beginCell().store(storeBuy(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Sell') {
            body = beginCell().store(storeSell(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getCurrentPrice(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('currentPrice', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getBuyPrice(provider: ContractProvider, amount: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(amount);
        const source = (await provider.get('buyPrice', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getSellPrice(provider: ContractProvider, amount: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(amount);
        const source = (await provider.get('sellPrice', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getReserve(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('reserve', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getSold(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('sold', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getGraduated(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('graduated', builder.build())).stack;
        const result = source.readBoolean();
        return result;
    }
    
    async getGraduationThreshold(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('graduationThreshold', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getBalanceOf(provider: ContractProvider, account: Address) {
        const builder = new TupleBuilder();
        builder.writeAddress(account);
        const source = (await provider.get('balanceOf', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
    async getProgress(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('progress', builder.build())).stack;
        const result = source.readBigNumber();
        return result;
    }
    
}