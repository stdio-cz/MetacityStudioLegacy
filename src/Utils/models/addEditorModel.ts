import { mat4, vec3 } from 'gl-matrix';
import { ModelData } from 'types';
import { IFCLoader } from 'web-ifc-three';

import { alignToCenter, shiftModel } from '@utils/geometry/align';

import * as GL from '@bananagl/bananagl';

import { computeNormals } from '../geometry/normals';
import { EditorModel } from './EditorModel';
import { solidShader, wireframeShader } from './EditorModelShader';

const DEFAULT_UNIFORMS = {
    uZMin: 0,
    uZMax: 10,
};

export enum CoordinateMode {
    Keep,
    Center,
    None,
}

export async function addEditorModels(
    modelData: ModelData[],
    selection: GL.SelectionManager,
    scene: GL.Scene,
    coordMode: CoordinateMode,
    globalShift: vec3 | null,
    position: vec3 = [0, 0, 0],
    rotation: vec3 = [0, 0, 0],
    scale: vec3 = [1, 1, 1],
    uniforms?: { [name: string]: any },
    updateStatus?: (status: string) => void
) {
    let i = 0;
    for (const model of modelData) {
        i++;
        const glmodel = new EditorModel();
        const vertices = model.geometry.position;
        const submodel = model.geometry.submodel;

        const byteSubmodel = new Uint8Array(submodel.buffer);

        if (coordMode === CoordinateMode.Center) alignToCenter(vertices);
        if (coordMode === CoordinateMode.Keep) {
            if (globalShift === null) {
                globalShift = vec3.create();
                alignToCenter(vertices, globalShift);
            } else {
                shiftModel(vertices, globalShift);
            }
        }

        const colors = new Uint8Array(vertices.length).fill(255);
        const selected = new Uint8Array(vertices.length).fill(0);
        const bar = new Uint8Array(vertices.length);
        for (let i = 0; i < vertices.length; i++) bar[i] = i % 3;

        const normals = computeNormals(vertices);
        glmodel.attributes.add(new GL.Attribute('position', new GL.Buffer(vertices), 3));
        glmodel.attributes.add(new GL.Attribute('normal', new GL.Buffer(normals), 3));
        glmodel.attributes.add(new GL.Attribute('color', new GL.Buffer(colors), 3, true));
        glmodel.attributes.add(new GL.Attribute('selected', new GL.Buffer(selected), 1, true));
        glmodel.attributes.add(new GL.Attribute('submodel', new GL.Buffer(byteSubmodel), 4));
        glmodel.attributes.add(new GL.Attribute('barCoord', new GL.Buffer(bar), 1));
        glmodel.shader = solidShader;
        glmodel.solidShader = solidShader;
        glmodel.wireframeShader = wireframeShader;
        glmodel.data = model.metadata.data;
        glmodel.name = model.metadata.name;

        //glmodel.uniforms = uniforms || DEFAULT_UNIFORMS; //TODO fix this, needs deep copy of the uniforms
        glmodel.uniforms = DEFAULT_UNIFORMS;

        glmodel.position = position.slice() as vec3;
        glmodel.rotation = rotation.slice() as vec3;
        glmodel.scale = scale.slice() as vec3;

        glmodel.onPick = (object, idx, ray, t, addToSelection) => {
            const submodel = object.attributes.getAttribute('submodel') as GL.Attribute;
            const submodelBuffer = submodel.buffer.getView(Uint32Array);
            if (!submodel) return;
            const id = submodelBuffer[idx * 3];

            if (!addToSelection) selection.clearSelection();
            selection.toggleSelection(id, object as EditorModel);
        };

        if (updateStatus) updateStatus(`Building BVH for ${i}/${modelData.length}...`);

        await glmodel.initTrianglePicking();
        scene.add(glmodel);
    }

    return globalShift;
}