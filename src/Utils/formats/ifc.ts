import { parse } from './ifc/parse';

self.onmessage = (e) => {
    process(e.data);
};

async function process(data: any) {
    const model = await parse(data);
    (self as any).postMessage(model, [
        model.geometry.position.buffer,
        model.geometry.submodel.buffer,
        model.metadata.file,
    ]);
}