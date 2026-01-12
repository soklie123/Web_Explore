'use client'

type SectionHeaderProps = {
  title: string;
  description?: string; // optional if sometimes you don't want a subtitle
};

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
        {title}
      </h1>
      {description && (
        <p className="text-base md:text-lg text-gray-600 mb-4">
          {description}
        </p>
      )}
    </div>
  );
}
