import User from "../models/User.js";
import DemoSnapshot from "../models/DemoSnapshot.js";
import resetDemoData from "./resetDemoData.js";

const RESET_HOUR = 5;
const RESET_MINUTE = 30;
const CHECK_INTERVAL = 60 * 1000;

let schedulerStarted = false;
let isChecking = false;

const getISTDateTime = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  );

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
};

const checkAndResetDemo = async () => {
  if (isChecking) return;

  isChecking = true;

  try {
    const { date, minutes } = getISTDateTime();
    const scheduledMinutes = RESET_HOUR * 60 + RESET_MINUTE;

    // Wait until 5:30 AM IST.
    if (minutes < scheduledMinutes) return;

    const demoUser = await User.findOne({ isDemo: true }).select("_id");

    if (!demoUser) {
      console.error("Demo reset skipped: demo account not found.");
      return;
    }

    const snapshot = await DemoSnapshot.findOne({
      user: demoUser._id,
    }).select("lastResetDate");

    if (!snapshot) {
      console.error("Demo reset skipped: snapshot not found.");
      return;
    }

    // Avoid resetting more than once on the same day.
    if (snapshot.lastResetDate === date) return;

    await resetDemoData(date);
  } catch (error) {
    console.error("Scheduled demo reset failed:", error.message);
  } finally {
    isChecking = false;
  }
};

const startDemoResetScheduler = () => {
  if (schedulerStarted) return;

  schedulerStarted = true;

  // Check immediately when the backend starts.
  checkAndResetDemo();

  // Continue checking every minute while the backend is awake.
  setInterval(checkAndResetDemo, CHECK_INTERVAL);

  console.log("Demo reset scheduler started (5:30 AM IST).");
};

export default startDemoResetScheduler;
