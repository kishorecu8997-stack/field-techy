import {
  engineerGetEducation,
  engineerGetExperience,
  engineerGetPersonalInfo,
  engineerGetSkillsAndTools,
  engineerGetWorkPreference,
  type EngineerGetEducationResponse,
  type EngineerGetExperienceResponse,
  type EngineerGetPersonalInfoResponse,
  type EngineerGetSkillsAndToolsResponse,
  type EngineerGetWorkPreferenceResponse,
} from "@/api";
import { apiClient } from "../apiClient";

/**
 * Raw API functions for use outside of hooks (e.g. in Zustand stores)
 * Moved to a separate file to avoid circular dependencies with stores.
 */

export async function getPersonalInfo() {
  const response = await engineerGetPersonalInfo({
    client: apiClient,
    throwOnError: true,
  });
  return response.data as EngineerGetPersonalInfoResponse;
}

export async function getEducation() {
  const response = await engineerGetEducation({
    client: apiClient,
    throwOnError: true,
  });
  return response.data as EngineerGetEducationResponse;
}

export async function getExperience() {
  const response = await engineerGetExperience({
    client: apiClient,
    throwOnError: true,
  });
  return response.data as EngineerGetExperienceResponse;
}

export async function getSkillsAndTools() {
  const response = await engineerGetSkillsAndTools({
    client: apiClient,
    throwOnError: true,
  });
  return response.data as EngineerGetSkillsAndToolsResponse;
}

export async function getWorkPreference() {
  const response = await engineerGetWorkPreference({
    client: apiClient,
    throwOnError: true,
  });
  return response.data as EngineerGetWorkPreferenceResponse;
}
