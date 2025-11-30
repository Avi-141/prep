function setHasOverlap(setA, setB) {
  for (const value of Array.from(setA)) {
    if (setB.has(value)) {
      return true;
    }
  }

  return false;
}

/**
 * Each session has the following fields:
 *
 * user: User ID of the session's user.
 * duration: Duration of the session, in minutes.
 * equipment: Array of equipment used during the sessions, in alphabetical order. There are only 5 different equipments.
 * Implement a method selectData, which is used to return sessions from the data. It has the interface selectData(sessions [, options]). The options available should include:
 *
 * user: Select only sessions with this id. If not specified, include all users (subject to other filters).
 * minDuration: Select only sessions with duration equal to or greater than this value. If not specified, include all sessions regardless of duration (subject to other filters).
 * equipment: Select only sessions where at least one of the specified equipments were used. If not specified, include all sessions regardless of equipment used (subject to other filters).
 * merge: If set to true
 * Sessions from the same user should be merged into one object. When merging:
 * Sum up the duration fields.
 * Combine all the equipment used, de-duplicating the values and sorting alphabetically.
 * The other filter options should be applied to the merged data.
 * Note:
 *
 * The order of the results should always remain unchanged from the original set.
 * In the case of merging user sessions, the row should take the place of the latest occurrence of that user.
 * The input objects should not be modified.
 */

/**
 * @param {Array<{user: number, duration: number, equipment: Array<string>}>} sessions
 * @param {{user?: number, minDuration?: number, equipment?: Array<string>, merge?: boolean}} [options]
 * @return {Array}
 */
export default function selectData(sessions, options = {}) {
  const { user, minDuration, equipment, merge = false } = options;
  const reversedSessions = sessions.slice().reverse();
  const sessionsForUser = new Map();
  const sessionsProcessed = [];

  for (const session of reversedSessions) {
    if (!session) continue;

    if (merge && sessionsForUser.has(session.user)) {
      const userSession = sessionsForUser.get(session.user);
      userSession.duration += session.duration;
      for (const eq of Array.isArray(session.equipment) ? session.equipment : []) {
        userSession.equipmentSet.add(eq);
      }
      continue;
    }

    const clonedSession = {
      user: session.user,
      duration: session.duration,
      equipmentSet: new Set(Array.isArray(session.equipment) ? session.equipment : []),
    };

    if (merge) {
      sessionsForUser.set(session.user, clonedSession);
    }

    sessionsProcessed.push(clonedSession);
  }

  sessionsProcessed.reverse();

  const optionEquipments = Array.isArray(equipment) ? new Set(equipment) : null;
  const results = [];

  for (const session of sessionsProcessed) {
    if (user != null && session.user !== user) {
      continue;
    }

    if (minDuration != null && session.duration < minDuration) {
      continue;
    }

    if (
      optionEquipments &&
      optionEquipments.size > 0 &&
      !setHasOverlap(optionEquipments, session.equipmentSet)
    ) {
      continue;
    }

    results.push({
      user: session.user,
      duration: session.duration,
      equipment: Array.from(session.equipmentSet).sort(),
    });
  }

  return results;
}
