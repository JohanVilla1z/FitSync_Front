import { Activity, Clock, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEntryLogStore } from '../../../store/useEntryLogStore';
import { useTrainersStore } from '../../../store/useTrainersStore';
import { useUsersStore } from '../../../store/useUsersStore';
import { StatCard } from './StatCard';

export const DashboardStats = () => {
  const [entryTrend, setEntryTrend] = useState({
    value: 'N/A',
    isPositive: true,
    label: 'sin datos previos',
  });
  const [retentionRate, setRetentionRate] = useState(0);

  const isAdmin = true;

  const { userStats, fetchUsers, isLoading: isLoadingUsers } = useUsersStore();
  const { fetchTrainers } = useTrainersStore();
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
        await Promise.all([
          fetchUsers(),
          fetchTrainers(),
          fetchEntryLogs(isAdmin),
        ]);

        refreshStats();
      } catch (error) {
        console.error('Error al cargar datos para el dashboard:', error);
      }
    };

    loadData();
  }, [fetchUsers, fetchTrainers, fetchEntryLogs, refreshStats, isAdmin]);

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

    if (userStats.total === 0) {
      setRetentionRate(0);
    } else {
      setRetentionRate(Math.round((userStats.active / userStats.total) * 100));
    }
  }, [userStats, isLoadingUsers]);

  const userActiveTrend = {
    value: '12%',
    isPositive: true,
    label: 'vs mes anterior',
  };

  const retentionTrend = {
    value: '3%',
    isPositive: true,
    label: 'vs mes anterior',
  };

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
