interface TagFilterProps {
  tags: string[];
  activeTag: string;
  onSelect: (tag: string) => void;
}

export default function TagFilter({ tags, activeTag, onSelect }: TagFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect('')}
        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200
          ${activeTag === ''
            ? 'bg-[var(--gold)] text-white shadow-sm'
            : 'border border-[var(--brown)]/10 bg-white text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)]'
          }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(tag)}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200
            ${activeTag === tag
              ? 'bg-[var(--gold)] text-white shadow-sm'
              : 'border border-[var(--brown)]/10 bg-white text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)]'
            }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
