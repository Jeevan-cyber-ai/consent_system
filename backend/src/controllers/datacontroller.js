const DataRecord = require("../models/dataRecordModel");
const auditService = require("../services/auditservice");

exports.createData = async (req, res) => {
  const record = await DataRecord.create({
    owner: req.user.id,
    dataType: req.body.dataType,
    data: req.body.data
  });

  res.status(201).json(record);
};

exports.getData = async (req, res) => {
  const record = await DataRecord.findOne({
    owner: req.params.ownerId,
    dataType: req.params.type
  });

  await auditService.logAction(
    req.user.id,
    "DATA_ACCESSED",
    req.params.type
  );

  res.json(record);
};
