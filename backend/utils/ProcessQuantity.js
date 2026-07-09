import { CalenderModel } from "../models/Process/CalenderModel.js";
import { CuttingModel } from "../models/Process/CuttingModel.js";
import { EmbroideryModel } from "../models/Process/EmbroideryModel.js";
import { StitchingModel } from "../models/Process/StitchingModel.js";
import { StoneModel } from "../models/Process/StoneModel.js";
import { SuitsModel } from "../models/Stock/Suits.Model.js";

export const ProcessStep = {
  EMBROIDERY: "Embroidery",
  CALENDER: "Calender",
  CUTTING: "Cutting",
  STONE: "Stone",
  STITCHING: "Stitching",
  PACKING: "Packing",
};

export const toProcessNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

export const sumStoneQuantity = (items = []) =>
  items.reduce((total, item) => total + toProcessNumber(item?.quantity), 0);

export const sumPackingQuantity = (items = []) =>
  items.reduce((total, item) => total + toProcessNumber(item?.return_quantity), 0);

const isLegacyEmbroiderySource = (sourceStep) => sourceStep === ProcessStep.EMBROIDERY;

const sourceQuery = ({ sourceStep, sourceId, targetStep }) => {
  const query = [{ source_step: sourceStep, source_id: sourceId }];

  if (sourceStep === ProcessStep.CUTTING && targetStep === ProcessStep.STONE) {
    query.push({ cuttingId: String(sourceId) });
  }

  if (isLegacyEmbroiderySource(sourceStep)) {
    query.push({
      embroidery_Id: sourceId,
      $or: [{ source_id: null }, { source_id: { $exists: false } }],
    });
  }

  return { $or: query };
};

const getSourceRecord = async ({ sourceStep, sourceId, session }) => {
  if (!sourceStep || !sourceId) {
    throw new Error("Previous step reference is required");
  }

  if (sourceStep === ProcessStep.EMBROIDERY) {
    const source = await EmbroideryModel.findById(sourceId).session(session);
    if (!source) throw new Error("Previous embroidery record not found");
    return source;
  }

  if (sourceStep === ProcessStep.CALENDER) {
    const source = await CalenderModel.findById(sourceId).session(session);
    if (!source) throw new Error("Previous calender record not found");
    return source;
  }

  if (sourceStep === ProcessStep.CUTTING) {
    const source = await CuttingModel.findById(sourceId).session(session);
    if (!source) throw new Error("Previous cutting record not found");
    return source;
  }

  if (sourceStep === ProcessStep.STONE) {
    const source = await StoneModel.findById(sourceId).session(session);
    if (!source) throw new Error("Previous stone record not found");
    return source;
  }

  if (sourceStep === ProcessStep.STITCHING) {
    const source = await StitchingModel.findById(sourceId).session(session);
    if (!source) throw new Error("Previous stitching record not found");
    return source;
  }

  throw new Error("Invalid previous process step");
};

export const getSourceCapacity = async ({
  sourceStep,
  sourceId,
  session,
}) => {
  const source = await getSourceRecord({ sourceStep, sourceId, session });

  if (sourceStep === ProcessStep.EMBROIDERY) {
    return toProcessNumber(source.T_Recieved_Suit);
  }

  if (sourceStep === ProcessStep.CALENDER) {
    return toProcessNumber(source.r_quantity);
  }

  if (sourceStep === ProcessStep.CUTTING) {
    return toProcessNumber(source.r_quantity);
  }

  if (sourceStep === ProcessStep.STONE) {
    return (
      toProcessNumber(source.r_quantity) ||
      source.category_quantity?.reduce(
        (total, item) => total + toProcessNumber(item?.recieved_Data?.r_total),
        0
      )
    );
  }

  if (sourceStep === ProcessStep.STITCHING) {
    return toProcessNumber(source.r_quantity);
  }

  return 0;
};

export const getAllocatedQuantity = async ({
  sourceStep,
  sourceId,
  targetStep,
  session,
}) => {
  if (!sourceStep || !sourceId || !targetStep) return 0;

  if (targetStep === ProcessStep.CUTTING) {
    const docs = await CuttingModel.find(
      sourceQuery({ sourceStep, sourceId, targetStep })
    ).session(session);

    return docs.reduce((total, doc) => total + toProcessNumber(doc.T_Quantity), 0);
  }

  if (targetStep === ProcessStep.STONE) {
    const docs = await StoneModel.find(
      sourceQuery({ sourceStep, sourceId, targetStep })
    ).session(session);

    return docs.reduce(
      (total, doc) => total + sumStoneQuantity(doc.category_quantity),
      0
    );
  }

  if (targetStep === ProcessStep.STITCHING) {
    const docs = await StitchingModel.find(
      sourceQuery({ sourceStep, sourceId, targetStep })
    ).session(session);

    return docs.reduce((total, doc) => total + toProcessNumber(doc.Quantity), 0);
  }

  return 0;
};

const getPackingAllocatedQuantity = async ({ sourceStep, sourceId, session }) => {
  const docs = await SuitsModel.find({
    all_records: {
      $elemMatch: {
        source_step: sourceStep,
        source_id: sourceId,
        is_stock_source_packing: true,
      },
    },
  }).session(session);

  return docs.reduce(
    (total, doc) =>
      total +
      doc.all_records.reduce((recordTotal, record) => {
        if (
          record?.is_stock_source_packing &&
          record?.source_step === sourceStep &&
          String(record?.source_id) === String(sourceId)
        ) {
          return recordTotal + toProcessNumber(record.quantity);
        }

        return recordTotal;
      }, 0),
    0
  );
};

export const getAllocatedFromSource = async ({ sourceStep, sourceId, session }) => {
  const [cutting, stone, stitching, packing] = await Promise.all([
    getAllocatedQuantity({
      sourceStep,
      sourceId,
      targetStep: ProcessStep.CUTTING,
      session,
    }),
    getAllocatedQuantity({
      sourceStep,
      sourceId,
      targetStep: ProcessStep.STONE,
      session,
    }),
    getAllocatedQuantity({
      sourceStep,
      sourceId,
      targetStep: ProcessStep.STITCHING,
      session,
    }),
    getPackingAllocatedQuantity({ sourceStep, sourceId, session }),
  ]);

  return cutting + stone + stitching + packing;
};

export const getProcessAvailability = async ({
  sourceStep,
  sourceId,
  targetStep,
  payload,
  session,
}) => {
  const capacity = await getSourceCapacity({
    sourceStep,
    sourceId,
    targetStep,
    payload,
    session,
  });
  const allocated = await getAllocatedFromSource({ sourceStep, sourceId, session });

  return { capacity, allocated, available: capacity - allocated };
};

export const assertSourceCanCreateNextStep = async ({
  sourceStep,
  sourceId,
  targetStep,
  requestedQuantity,
  payload,
  session,
}) => {
  const source = await getSourceRecord({ sourceStep, sourceId, session });
  if (source.project_status !== "Completed") {
    throw new Error("Previous step must be completed before creating next step");
  }

  const availability = await getProcessAvailability({
    sourceStep,
    sourceId,
    targetStep,
    payload,
    session,
  });

  if (availability.capacity <= 0) {
    throw new Error("No received quantity found in previous step");
  }

  const requested = toProcessNumber(requestedQuantity);
  if (requested <= 0) throw new Error("Invalid quantity for next step");

  if (requested > availability.available) {
    throw new Error(
      `Invalid quantity. Available quantity from previous step is ${availability.available}`
    );
  }

  return availability;
};

export const buildProcessAvailability = async ({
  sourceStep,
  sourceId,
  session,
}) => {
  return await getProcessAvailability({
    sourceStep,
    sourceId,
    session,
  });
};
