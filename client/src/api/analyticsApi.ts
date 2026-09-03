import api from './api';
import type { StreakDto, WeeklyVolumeDto, SummaryDto, TypeBreakdownDto } from './types';
import { AxiosResponse } from 'axios';

const analyticsApi = {
  getStreaks: (userId: string): Promise<AxiosResponse<StreakDto>> =>
    api.get(`/activities/analytics/${userId}/streaks`),

  getWeeklyVolume: (
    userId: string,
    from: string,
    to: string
  ): Promise<AxiosResponse<WeeklyVolumeDto[]>> =>
    api.get(`/activities/analytics/${userId}/weekly-volume`, { params: { from, to } }),

  getSummary: (userId: string): Promise<AxiosResponse<SummaryDto>> =>
    api.get(`/activities/analytics/${userId}/summary`),

  getTypeBreakdown: (userId: string): Promise<AxiosResponse<TypeBreakdownDto[]>> =>
    api.get(`/activities/analytics/${userId}/type-breakdown`),
};

export default analyticsApi;
