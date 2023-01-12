import { redis } from "@/config/redis-database";
import { ActivityDate, Activity, ActivityRegister, ActivityLocal } from "@prisma/client";

async function setActivityDates(activityDates: ActivityDate[]) {
  return redis.set("activityDates", JSON.stringify(activityDates));
}

async function getActivityDates() {
  return redis.get("activityDates");
}

async function getActivityById(activity: string) {
  return redis.get(activity);
}

async function setActivityById(activities: Activity[], activityDateId: number) {
  return redis.set(`activities${activityDateId}`, JSON.stringify(activities));
}

async function getRegisters(activityId: number) {
  return redis.get(`registers${activityId}`);
}

async function setRegisters(registers: ActivityRegister[], activityId: number) {
  return redis.set(`registers${activityId}`, JSON.stringify(registers));
}

async function deleteRegisters(activityId: number) {
  return redis.del(`registers${activityId}`);
}

async function getLocals() {
  return redis.get("locals");
}

async function setLocals(locals: ActivityLocal[]) {
  return redis.set("locals", JSON.stringify(locals));
}

export const activityCache = {
  setActivityDates,
  getActivityDates,
  getActivityById,
  setActivityById,
  getRegisters,
  setRegisters,
  deleteRegisters,
  getLocals,
  setLocals
};
