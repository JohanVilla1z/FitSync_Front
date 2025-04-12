import { UserProfile } from '../../store/useUserProfileStore';

interface BasicInfoProps {
  profile: UserProfile;
}

const BasicInfo = ({ profile }: BasicInfoProps) => {
  const fullName = profile.lastName
    ? `${profile.name} ${profile.lastName}`
    : profile.name;

  return (
    <section aria-labelledby="basic-info-header" className="mb-6">
      <h2
        id="basic-info-header"
        className="text-2xl font-semibold text-foreground dark:text-foreground-dark mb-4"
      >
        Información Básica
      </h2>
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
        {fullName}
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoItem label="Teléfono" value={profile.phone ?? 'N/>A'} />
        <InfoItem
          label="Altura"
          value={profile.height ?? null}
          formatter={(val) => `${val} m`}
        />
        <InfoItem
          label="Peso"
          value={profile.weight ?? null}
          formatter={(val) => `${val} kg`}
        />
        <InfoItem
          label="IMC Actual"
          value={profile.currentIMC ?? null}
          formatter={(val) => val.toFixed(2)}
        />
      </ul>
    </section>
  );
};

interface InfoItemProps {
  label: string;
  value: string | number | null;
  formatter?: (value: number) => string;
}

const InfoItem = ({ label, value, formatter }: InfoItemProps) => {
  const formattedValue = value
    ? typeof value === 'number' && formatter
      ? formatter(value)
      : value
    : 'No disponible';

  return (
    <li>
      <p className="text-sm font-medium text-muted dark:text-muted-dark">
        {label}
      </p>
      <p className="text-lg text-foreground dark:text-foreground-dark">
        {formattedValue}
      </p>
    </li>
  );
};

export default BasicInfo;
