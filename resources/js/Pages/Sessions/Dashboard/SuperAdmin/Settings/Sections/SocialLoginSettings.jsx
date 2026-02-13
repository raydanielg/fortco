import SettingsSectionShell from './SettingsSectionShell';
import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useEffect, useMemo, useState } from 'react';

export default function SocialLoginSettings({ data, setData, submit, processing, errors }) {
    const provider = data.social_provider || 'google';
    const redirectUrl = useMemo(() => {
        if (typeof window === 'undefined') return '';
        return `${window.location.origin}/auth/${provider}/callback`;
    }, [provider]);

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const t = setTimeout(() => setCopied(false), 1200);
        return () => clearTimeout(t);
    }, [copied]);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(redirectUrl);
            setCopied(true);
        } catch (e) {
            try {
                const el = document.createElement('textarea');
                el.value = redirectUrl;
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                setCopied(true);
            } catch (e2) {
                // ignore
            }
        }
    };

    const tabs = [
        { key: 'google', label: 'Google' },
        { key: 'apple', label: 'Apple' },
        { key: 'facebook', label: 'Facebook' },
    ];

    const tabClass = (isActive) =>
        'inline-flex items-center border-b-2 px-4 py-3 text-[12px] font-semibold transition ' +
        (isActive ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-900');

    const inputClass =
        'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20';

    const Field = ({ label, error, children }) => (
        <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
            <div className="mt-2">{children}</div>
            {error ? <div className="mt-1 text-[12px] text-red-600">{error}</div> : null}
        </div>
    );

    const enabledKey = `social_${provider}_enabled`;
    const clientIdKey = `social_${provider}_client_id`;
    const clientSecretKey = `social_${provider}_client_secret`;

    return (
        <SettingsSectionShell title="" description="">
            <div className="-m-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="border-b border-slate-200 bg-white">
                    <div className="flex flex-wrap items-center justify-between gap-3 px-6">
                        <div className="flex items-center">
                            {tabs.map((t) => (
                                <button
                                    key={t.key}
                                    type="button"
                                    onClick={() => setData('social_provider', t.key)}
                                    className={tabClass(provider === t.key)}
                                >
                                    {t.label}
                                </button>
                            ))}
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
                                <div className="text-sm font-semibold text-slate-900">Provider</div>
                                <div className="mt-1 text-[12px] text-slate-500">Enable and configure {provider} login.</div>

                                <div className="mt-5 grid gap-5 md:grid-cols-2">
                                    <Field label="Enabled" error={errors[enabledKey]}>
                                        <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-700">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                                checked={!!data[enabledKey]}
                                                onChange={(e) => setData(enabledKey, e.target.checked)}
                                            />
                                            <span>Allow users to sign in with {provider}</span>
                                        </label>
                                    </Field>

                                    <div />

                                    <Field label="Client ID" error={errors[clientIdKey]}>
                                        <input
                                            value={data[clientIdKey] || ''}
                                            onChange={(e) => setData(clientIdKey, e.target.value)}
                                            className={inputClass}
                                            placeholder="Client ID"
                                        />
                                    </Field>

                                    <Field label="Client Secret" error={errors[clientSecretKey]}>
                                        <input
                                            type="password"
                                            value={data[clientSecretKey] || ''}
                                            onChange={(e) => setData(clientSecretKey, e.target.value)}
                                            className={inputClass}
                                            placeholder="Client Secret"
                                        />
                                    </Field>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <div className="text-sm font-semibold text-slate-900">Redirect URL</div>
                                <div className="mt-1 text-[12px] text-slate-500">Use this redirect URL in the provider console.</div>

                                <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <div className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-700 break-all">
                                                {redirectUrl}
                                            </div>
                                            <div className="mt-2 text-[11px] text-slate-500">
                                                Callback path is based on the selected provider.
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={copy}
                                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                            title="Copy"
                                        >
                                            {copied ? <CheckIcon className="h-5 w-5" /> : <ClipboardIcon className="h-5 w-5" />}
                                        </button>
                                    </div>

                                    {copied ? (
                                        <div className="mt-3 text-[12px] font-semibold text-slate-900">Copied</div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsSectionShell>
    );
}
