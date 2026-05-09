import { recommendDepartment } from "../agents/departmentAgent.js";
import { detectEmergency } from "../agents/priorityAgent.js";
import { predictQueueLoad } from "../agents/queuePredictionAgent.js";

export const runPatientIntakeWorkflow = async ({ symptoms }) => {
  const department = await recommendDepartment(symptoms);
  const priorityLevel = await detectEmergency(symptoms);
  const queue = await predictQueueLoad({ department });
  return { department, priorityLevel, estimatedWaitMinutes: queue.estimatedWaitMinutes, queueLevel: queue.queueLevel };
};
