export default function mergeData(sessions) {
  const mp = new Map();
  for (let i = 0; i < sessions.length; i++) {
    const s = sessions[i] || {};
    const user = s.user;
    if (user == null) continue;
    const duration = s.duration || 0;
    const equipmentArr = Array.isArray(s.equipment) ? s.equipment : [];

    const existing = mp.get(user);
    const existingDuration = existing?.duration || 0;
    const existingSet = new Set(existing?.equipment || []);

    for (const eq of equipmentArr) existingSet.add(eq);

    mp.set(user, {
      duration: existingDuration + duration,
      equipment: Array.from(existingSet)
    });
  }

  const result = [];
  for (const [user, data] of mp) {
    result.push({ user, duration: data.duration, equipment: data.equipment.sort() });
  }
  return result;
}