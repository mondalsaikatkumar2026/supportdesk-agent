import { useId } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label: string };

export default function TextField({ label, ...props }: Props) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        {...props}
      />
    </div>
  );
}