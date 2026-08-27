import {
  describe,
  test,
  expect,
} from "vitest";

import {
  calculateBudgetAnalysis,
} from "../src/services/budgetService.js";


describe(
  "Budget Service",
  () => {

    // ===================================
    // WITHIN BUDGET
    // ===================================

    test(
      "should calculate activity cost and remaining budget",
      () => {

        const itinerary = {
          days: [
            {
              day: 1,

              activities: [
                {
                  estimatedCost: 500,
                },

                {
                  estimatedCost: 1000,
                },
              ],
            },

            {
              day: 2,

              activities: [
                {
                  estimatedCost: 1500,
                },
              ],
            },
          ],
        };

        const result =
          calculateBudgetAnalysis(
            5000,
            itinerary
          );

        expect(
          result.calculatedActivityCost
        ).toBe(3000);

        expect(
          result.remainingBudget
        ).toBe(2000);

        expect(
          result.overBudget
        ).toBe(false);

        expect(
          result.overBy
        ).toBe(0);

        expect(
          result.budgetUtilization
        ).toBe(60);
      }
    );


    // ===================================
    // OVER BUDGET
    // ===================================

    test(
      "should detect when itinerary exceeds budget",
      () => {

        const itinerary = {
          days: [
            {
              activities: [
                {
                  estimatedCost: 3000,
                },

                {
                  estimatedCost: 2500,
                },
              ],
            },
          ],
        };

        const result =
          calculateBudgetAnalysis(
            5000,
            itinerary
          );

        expect(
          result.calculatedActivityCost
        ).toBe(5500);

        expect(
          result.overBudget
        ).toBe(true);

        expect(
          result.overBy
        ).toBe(500);

        expect(
          result.remainingBudget
        ).toBe(0);

        expect(
          result.budgetUtilization
        ).toBe(110);
      }
    );


    // ===================================
    // EMPTY ITINERARY
    // ===================================

    test(
      "should handle empty itinerary",
      () => {

        const result =
          calculateBudgetAnalysis(
            10000,
            {
              days: [],
            }
          );

        expect(
          result.calculatedActivityCost
        ).toBe(0);

        expect(
          result.remainingBudget
        ).toBe(10000);

        expect(
          result.overBudget
        ).toBe(false);

        expect(
          result.budgetUtilization
        ).toBe(0);
      }
    );


    // ===================================
    // INVALID COST
    // ===================================

    test(
      "should ignore invalid activity cost values",
      () => {

        const itinerary = {
          days: [
            {
              activities: [
                {
                  estimatedCost: 500,
                },

                {
                  estimatedCost:
                    undefined,
                },

                {
                  estimatedCost:
                    "1000",
                },
              ],
            },
          ],
        };

        const result =
          calculateBudgetAnalysis(
            5000,
            itinerary
          );

        expect(
          result.calculatedActivityCost
        ).toBe(1500);
      }
    );
  }
);