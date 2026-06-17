const baseClasses =
  'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'

export default function FormField({ as = 'input', label, options = [], ...props }) {
  const Field = as

  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      {as === 'select' ? (
        <select className={baseClasses} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <Field className={baseClasses} {...props} />
      )}
    </label>
  )
}
