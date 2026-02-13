import SettingsSectionShell from './SettingsSectionShell';
import { PaintBrushIcon, MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export default function ThemeSettings({ data, setData, submit, processing, errors }) {
    const tabClass = (isActive) =>
        'inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[12px] font-semibold transition ' +
        (isActive
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50');

    const Field = ({ label, error, children }) => (
        <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
            <div className="mt-2">{children}</div>
            {error ? <div className="mt-1 text-[12px] text-red-600">{error}</div> : null}
        </div>
    );

    const inputClass =
        'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20';

    return (
        <SettingsSectionShell title="" description="">
            <div className="-m-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-6">
                        <div className="my-3 inline-flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                            <PaintBrushIcon className="h-5 w-5" />
                            Theme
                        </div>

                        <button
                            type="button"
                            onClick={submit}
                            disabled={processing}
                            className="my-3 inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-[12px] font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
                        >
                            Save
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <div className="text-sm font-semibold text-slate-900">Appearance</div>
                                <div className="mt-1 text-[12px] text-slate-500">Set layout direction, mode, and background.</div>

                                <div className="mt-5 grid gap-5">
                                    <Field label="Direction" error={errors.theme_direction}>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setData('theme_direction', 'ltr')}
                                                className={tabClass((data.theme_direction || 'ltr') === 'ltr')}
                                            >
                                                LTR
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('theme_direction', 'rtl')}
                                                className={tabClass((data.theme_direction || 'ltr') === 'rtl')}
                                            >
                                                RTL
                                            </button>
                                        </div>
                                    </Field>

                                    <Field label="Mode" error={errors.theme_mode}>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setData('theme_mode', 'light')}
                                                className={tabClass((data.theme_mode || 'light') === 'light')}
                                            >
                                                <SunIcon className="h-4 w-4" />
                                                Light
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('theme_mode', 'dark')}
                                                className={tabClass((data.theme_mode || 'light') === 'dark')}
                                            >
                                                <MoonIcon className="h-4 w-4" />
                                                Dark
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('theme_mode', 'system')}
                                                className={tabClass((data.theme_mode || 'light') === 'system')}
                                            >
                                                <ComputerDesktopIcon className="h-4 w-4" />
                                                System
                                            </button>
                                        </div>
                                    </Field>

                                    <div className="grid gap-5 md:grid-cols-2">
                                        <Field label="Background color" error={errors.theme_bg}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="color"
                                                    value={data.theme_bg || '#f7f5f0'}
                                                    onChange={(e) => setData('theme_bg', e.target.value)}
                                                    className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white"
                                                />
                                                <input
                                                    value={data.theme_bg || ''}
                                                    onChange={(e) => setData('theme_bg', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="#f7f5f0"
                                                />
                                            </div>
                                        </Field>

                                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Preview</div>
                                            <div
                                                className="mt-3 h-16 rounded-xl border border-slate-200"
                                                style={{ background: data.theme_bg || '#f7f5f0' }}
                                            />
                                            <div className="mt-2 text-[11px] text-slate-500">Applied globally after save.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <div className="text-sm font-semibold text-slate-900">Notes</div>
                                <div className="mt-2 text-[12px] text-slate-600">
                                    Direction uses the <span className="font-semibold text-slate-900">dir</span> attribute on html.
                                </div>
                                <div className="mt-2 text-[12px] text-slate-600">
                                    Dark mode is applied using Tailwind's <span className="font-semibold text-slate-900">dark</span> class.
                                </div>
                                <div className="mt-2 text-[12px] text-slate-600">
                                    Background color is applied as a CSS variable.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsSectionShell>
    );
}
