export const predictQueueLoad = async ({ department }) => {
  const base = { Emergency: 5, Cardiology: 18, Neurology: 22, Orthopedics: 15, "General Medicine": 20, Pediatrics: 12, Gynecology: 16, ENT: 10 };
  const wait = base[department] ?? 20;
  return { estimatedWaitMinutes: wait, queueLevel: wait > 18 ? "HIGH" : "MODERATE" };
};
