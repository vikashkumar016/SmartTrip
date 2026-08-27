export const calculateBudgetAnalysis = (
  budget,
  itinerary
) => {

  if (
    budget === undefined ||
    budget === null
  ) {
    throw new Error(
      "Budget is required for budget analysis"
    );
  }


  if (!itinerary) {
    throw new Error(
      "Itinerary is required for budget analysis"
    );
  }


  let calculatedActivityCost = 0;


  // -------------------------
  // Loop through days
  // -------------------------

  if (
    Array.isArray(
      itinerary.days
    )
  ) {

    itinerary.days.forEach(
      (day) => {

        if (
          Array.isArray(
            day.activities
          )
        ) {

          day.activities.forEach(
            (activity) => {

              const cost =
                Number(
                  activity.estimatedCost
                );

              // Only add valid positive/zero numbers
              if (
                Number.isFinite(cost) &&
                cost >= 0
              ) {
                calculatedActivityCost +=
                  cost;
              }
            }
          );
        }
      }
    );
  }


  // -------------------------
  // Calculate remaining budget
  // -------------------------

  const remainingBudget =
    Math.max(
      budget -
        calculatedActivityCost,
      0
    );


  // -------------------------
  // Check over budget
  // -------------------------

  const overBudget =
    calculatedActivityCost >
    budget;


  const overBy =
    overBudget
      ? calculatedActivityCost -
        budget
      : 0;


  // -------------------------
  // Budget utilization %
  // -------------------------

  let budgetUtilization = 0;

  if (budget > 0) {

    budgetUtilization =
      (
        calculatedActivityCost /
        budget
      ) * 100;

  } else if (
    calculatedActivityCost > 0
  ) {

    budgetUtilization = 100;
  }


  budgetUtilization =
    Number(
      budgetUtilization.toFixed(
        2
      )
    );


  // -------------------------
  // Return analysis
  // -------------------------

  return {
    calculatedActivityCost,

    remainingBudget,

    overBudget,

    overBy,

    budgetUtilization,
  };
};