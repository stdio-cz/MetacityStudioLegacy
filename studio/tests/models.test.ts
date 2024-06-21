import { Model } from "@features/db/entities/model";
import { injectRepository } from "@features/db/helpers";
import { createOwnModel } from "@features/models/mutations/createOwnModel";
import { deleteOwnModel } from "@features/models/mutations/deleteOwnModel";
import { getOwnModel } from "@features/models/queries/getOwnModel";
import { expect } from "vitest";
import { testWithFixtures } from "./helpers";

const modelMetadata: Pick<Model, "name" | "coordinateSystem"> = {
  name: "My best model",
  coordinateSystem: "WGS84",
};

testWithFixtures("create model", async ({ file }) => {
  const response = await createOwnModel(modelMetadata, [file]);
  expect(response).toMatchObject(modelMetadata);

  const modelRepository = await injectRepository(Model);
  await modelRepository.delete({
    id: response.id,
  });
});

testWithFixtures("get model", async ({ model, file }) => {
  const response = await getOwnModel(model.id);
  expect(response).toMatchObject(model);
  expect(response?.files).toHaveLength(1);
  expect(response?.files?.[0]).toBe(file.name);
});

testWithFixtures("delete model", async ({ model }) => {
  const modelRepository = await injectRepository(Model);

  await deleteOwnModel(model!.id);

  const response = await modelRepository.findOne({ where: { id: model!.id } });
  expect(response).toBe(null);
});
