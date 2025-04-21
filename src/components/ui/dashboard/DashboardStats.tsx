import { Activity, Clock, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Role } from '../../../constants';
import { useAuthStore } from '../../../store/authStore';
import { useEntryLogStore } from '../../../store/useEntryLogStore';
import { useUsersStore } from '../../../store/useUsersStore';
import { StatCard } from './StatCard';

export const DashboardStats = () => {
  const [entryTrend, setEntryTrend] = useState({
    value: '0%',
    isPositive: true,
    label: 'sin cambios',
  });

  const [userActiveTrend, setUserActiveTrend] = useState({
    value: '0%',
    isPositive: true,
    label: 'sin cambios',
  });

  const [retentionTrend, setRetentionTrend] = useState({
    value: '0%',
    isPositive: true,
    label: 'sin cambios',
  });

  const [retentionRate, setRetentionRate] = useState(0);

  const { user } = useAuthStore();
  const isAdmin = user?.role?.includes(Role.ADMIN);

  const {
    users,
    userStats,
    fetchUsers,
    isLoading: isLoadingUsers,
  } = useUsersStore();

  const {
    entryLogs,
    todayEntries,
    yesterdayEntries,
    isLoading: isLoadingLogs,
    fetchEntryLogs,
    refreshStats,
  } = useEntryLogStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchUsers(), fetchEntryLogs(isAdmin)]);

        refreshStats();
      } catch (error) {
        console.error('Error al cargar datos para el dashboard:', error);
      }
    };

    loadData();
  }, [fetchUsers, fetchEntryLogs, refreshStats, isAdmin]);

  useEffect(() => {
    if (yesterdayEntries === 0) {
      if (todayEntries > 0) {
        setEntryTrend({
          value: `+${todayEntries}`,
          isPositive: true,
          label: 'nuevas entradas',
        });
      } else {
        setEntryTrend({
          value: '0',
          isPositive: true,
          label: 'sin entradas',
        });
      }
    } else {
      const percentChange = (
        ((todayEntries - yesterdayEntries) / yesterdayEntries) *
        100
      ).toFixed(0);
      setEntryTrend({
        value: `${Math.abs(parseInt(percentChange))}%`,
        isPositive: parseInt(percentChange) >= 0,
        label: 'vs ayer',
      });
    }
  }, [todayEntries, yesterdayEntries]);

  useEffect(() => {
    if (!userStats || isLoadingUsers) return;

    if (userStats.total > 0) {
      const currentRetention = Math.round(
        (userStats.active / userStats.total) * 100
      );
      setRetentionRate(currentRetention);
    }

    if (entryLogs.length > 0 && users.length > 0) {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      const recentActiveUserIds = new Set();
      entryLogs.forEach((log) => {
        const logDate = new Date(log.timestamp);
        if (logDate >= lastWeek) {
          recentActiveUserIds.add(log.userName);
        }
      });

      const recentActiveCount = recentActiveUserIds.size;
      const totalActiveUsers = userStats.active;

      if (totalActiveUsers > 0 && recentActiveCount > 0) {
        const activeChange = (
          (recentActiveCount / totalActiveUsers) *
          100
        ).toFixed(0);

        setUserActiveTrend({
          value: `${activeChange}%`,
          isPositive: true,
          label: 'activos recientes',
        });
      }
    }

    if (entryLogs.length > 0) {
      const today = new Date();
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(today.getDate() - 7);
      const twoWeeksAgo = new Date(today);
      twoWeeksAgo.setDate(today.getDate() - 14);

      const currentPeriodUsers = new Set();
      const previousPeriodUsers = new Set();

      entryLogs.forEach((log) => {
        const logDate = new Date(log.timestamp);
        if (logDate >= oneWeekAgo) {
          currentPeriodUsers.add(log.userName);
        } else if (logDate >= twoWeeksAgo && logDate < oneWeekAgo) {
          previousPeriodUsers.add(log.userName);
        }
      });

      if (previousPeriodUsers.size > 0) {
        let returnedUsers = 0;
        previousPeriodUsers.forEach((userId) => {
          if (currentPeriodUsers.has(userId)) {
            returnedUsers++;
          }
        });

        const previousRetentionRate = Math.round(
          (returnedUsers / previousPeriodUsers.size) * 100
        );
        const retentionChange = retentionRate - previousRetentionRate;

        setRetentionTrend({
          value: `${Math.abs(retentionChange)}%`,
          isPositive: retentionChange >= 0,
          label: 'vs semana anterior',
        });
      }
    }
  }, [userStats, isLoadingUsers, entryLogs, users, retentionRate]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        title="Usuarios activos"
        value={userStats?.active || 0}
        icon={Users}
        iconBgColor="bg-blue-100 dark:bg-blue-900"
        iconColor="text-blue-600 dark:text-blue-400"
        trend={userActiveTrend}
        isLoading={isLoadingUsers}
      />

      <StatCard
        title={isAdmin ? 'Entradas de hoy (total)' : 'Tus entradas de hoy'}
        value={todayEntries}
        icon={Clock}
        iconBgColor="bg-amber-100 dark:bg-amber-900"
        iconColor="text-amber-600 dark:text-amber-400"
        trend={entryTrend}
        isLoading={isLoadingLogs}
      />

      <StatCard
        title="Tasa de retención"
        value={`${retentionRate}%`}
        icon={Activity}
        iconBgColor="bg-green-100 dark:bg-green-900"
        iconColor="text-green-600 dark:text-green-400"
        trend={retentionTrend}
        isLoading={isLoadingUsers}
      />
    </section>
  );
};
