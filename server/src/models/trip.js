import mongoose from "mongoose";


const activitySchema = new mongoose.Schema(
  {
    time: {
      type: String,
      default: "",
    },

    place: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    estimatedCost: {
      type: Number,
      default: 0,
      min: 0,
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },
  },
  {
    _id: false,
  }
);

const daySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      default: "",
    },

    activities: {
      type: [activitySchema],
      default: [],
    },
  },
  {
    _id: false,
  }
);

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    budget: {
      type: Number,
      required: true,
      min: 0,
    },

    travelers: {
      type: Number,
      required: true,
      min: 1,
    },

    interests: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["draft", "generated", "completed"],
      default: "draft",
    },

    itinerary: {
      summary: {
        type: String,
        default: "",
      },

      totalEstimatedCost: {
        type: Number,
        default: 0,
      },

      days: {
        type: [daySchema],
        default: [],
      },
    },

    budgetAnalysis: {
      calculatedActivityCost: {
        type: Number,
        default: 0,
      },

      remainingBudget: {
        type: Number,
        default: 0,
      },

      overBudget: {
        type: Boolean,
        default: false,
      },

      overBy: {
        type: Number,
        default: 0,
      },

      budgetUtilization: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;