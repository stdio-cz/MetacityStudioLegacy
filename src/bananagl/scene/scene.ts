import { Buffer } from '@bananagl/models/buffer';
import { Pickable } from '@bananagl/models/pickable';
import { Renderable } from '@bananagl/models/renderable';
import { TriangleBVH } from '@bananagl/picking/bvh.triangle';
import { PickerBVH } from '@bananagl/picking/pickerBVH';

export class Scene {
    readonly objects: Renderable[] = [];
    readonly pickerBVH: PickerBVH = new PickerBVH();
    private onChanges: (() => void)[] = [];
    private dirtyShaderOrder_ = false;

    add(object: Renderable, pickable = false) {
        this.objects.push(object);
        this.onChanges.forEach((callback) => callback());

        if (pickable) this.initTracing(object);
        this.dirtyShaderOrder_ = true;
    }

    private initTracing(object: Renderable) {
        if (object instanceof Pickable) {
            //TODO: make this more generic
            const bvh = new TriangleBVH(object);
            object.BVH = bvh;
            this.pickerBVH.add(object);
        }
    }

    sortByShader() {
        this.objects.sort((a, b) => {
            if (a.shader === b.shader) return 0;
            return a.shader < b.shader ? -1 : 1;
        });
        this.dirtyShaderOrder_ = false;
    }

    get dirtyShaderOrder() {
        return this.dirtyShaderOrder_;
    }

    set onChange(callback: () => void) {
        this.onChanges.push(callback);
    }

    get bytesAllocated() {
        const bufferSet = new Set<Buffer>();
        for (const object of this.objects) {
            for (const buffer of object.attributes.buffers) {
                bufferSet.add(buffer);
            }
        }
        let total = 0;
        for (const buffer of bufferSet) {
            total += buffer.bytesAllocated;
        }

        return total;
    }
}
