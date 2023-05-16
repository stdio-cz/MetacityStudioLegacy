import { mat4, quat, vec3 } from 'gl-matrix';
import { GLTFMesh, GLTFNode, GLTFParsedData } from 'types';

export function unindexGeometry(gltf: GLTFParsedData) {
    const vertexCount = countVertices(gltf);

    const position = new Float32Array(vertexCount * 3);
    const submodel = new Uint32Array(vertexCount);
    let positionIdx = 0;
    let submodelIdx = 0;
    let submodelCounter = 0;
    let metadata: { [submodel: number]: any } = {};
    const mat = mat4.create();

    for (let i = 0; i < gltf.nodes.length; i++) {
        const node = gltf.nodes[i];
        const mesh = node.mesh;

        getTransformation(node, mat);

        metadata[submodelCounter] = {
            name: node.name,
            id: node.id,
            ...node.extras
        };

        if (mesh) {
            ({ positionIdx, submodelIdx } = processPrimitives(
                mesh,
                position,
                positionIdx,
                submodel,
                submodelIdx,
                submodelCounter,
                mat
            ));
        }
        submodelCounter++;
    }

    return { position, submodel, metadata };
}

function processPrimitives(
    mesh: GLTFMesh,
    position: Float32Array,
    positionIdx: number,
    submodel: Uint32Array,
    submodelIdx: number,
    submodelCounter: number,
    mat: mat4
) {
    for (let j = 0; j < mesh.primitives.length; j++) {
        const primitive = mesh.primitives[j];
        const mposition = primitive.attributes.POSITION.value;
        const indices = primitive.indices?.value ?? undefined;

        if (indices !== undefined) {
            for (let k = 0; k < indices.length; k++) {
                const bindex = indices[k] * 3;
                position[positionIdx++] = mposition[bindex];
                position[positionIdx++] = mposition[bindex + 1];
                position[positionIdx++] = mposition[bindex + 2];
                submodel[submodelIdx++] = submodelCounter;
                const subarr = position.subarray(positionIdx - 3, positionIdx);
                vec3.transformMat4(subarr, subarr, mat);
            }
        } else {
            for (let k = 0; k < mposition.length; k += 3) {
                position[positionIdx++] = mposition[k];
                position[positionIdx++] = mposition[k + 1];
                position[positionIdx++] = mposition[k + 2];
                submodel[submodelIdx++] = submodelCounter;
                const subarr = position.subarray(positionIdx - 3, positionIdx);
                vec3.transformMat4(subarr, subarr, mat);
            }
        }
    }
    return { positionIdx, submodelIdx };
}

function countVertices(gltf: GLTFParsedData) {
    return gltf.nodes
        .map((node) => {
            const mesh = node.mesh;
            if (mesh) {
                const primitives = mesh.primitives.map((primitive) => {
                    if (primitive.indices) {
                        return primitive.indices.value.length;
                    } else {
                        return primitive.attributes.POSITION.value.length / 3;
                    }
                });
                return primitives.reduce((a, b) => a + b, 0);
            }
            return 0;
        })
        .reduce((a, b) => a + b, 0);
}

function getTransformation(node: GLTFNode, mat: mat4) {
    if (node.matrix) return mat4.copy(mat, node.matrix as mat4);
    else {
        mat4.identity(mat);
        if (node.translation) mat4.translate(mat, mat, node.translation);
        if (node.rotation) mat4.multiply(mat, mat, mat4.fromQuat(mat4.create(), node.rotation));
        if (node.scale) mat4.scale(mat, mat, node.scale);
        return mat;
    }
}