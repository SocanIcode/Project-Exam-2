type ProfileTabsProps<T extends string> = {
  tabs: { id: T; label: string }[];
  active: T;
  onChange: (next: T) => void;
};

export function ProfileTabs<T extends string>({
  tabs,
  active,
  onChange,
}: ProfileTabsProps<T>) {
  return (
    <div className="flex gap-2">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`rounded-xl border px-3 py-2 text-sm ${
            active === t.id ? "bg-[#E56BA8] text-white" : "bg-white"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
