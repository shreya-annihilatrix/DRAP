const mongoose = require("mongoose");

const TransportationTaskSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    shelter: { type: mongoose.Schema.Types.ObjectId, ref: "Shelter" },
    resourceType: { type: mongoose.Schema.Types.ObjectId, ref: "ResourceType" },
    deliveryDateTime: String
});

module.exports = mongoose.model("TransportationTask", TransportationTaskSchema);
