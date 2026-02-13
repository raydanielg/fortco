import SettingsSectionShell from './SettingsSectionShell';

export default function PaymentCredentials({ data, setData, submit, processing, errors }) {
    const provider = data.payment_provider || 'pesapal';

    const ProviderTabs = () => {
        const tabs = [
            { key: 'pesapal', label: 'Pesapal' },
            { key: 'selcom', label: 'Selcom' },
            { key: 'zenopay', label: 'Zenopay' },
        ];

        const tabClass = (isActive) =>
            'inline-flex items-center border-b-2 px-4 py-3 text-[12px] font-semibold transition ' +
            (isActive
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900');

        return (
            <div className="border-b border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 px-6">
                    <div className="flex items-center">
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                type="button"
                                onClick={() => setData('payment_provider', t.key)}
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
        );
    };

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
        <SettingsSectionShell
            title=""
            description=""
        >
            <div className="-m-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <ProviderTabs />

                <div className="p-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <div className="text-sm font-semibold text-slate-900">Configuration</div>
                                <div className="mt-1 text-[12px] text-slate-500">
                                    Update credentials for <span className="font-semibold text-slate-900">{provider}</span>.
                                </div>

                                {provider === 'pesapal' ? (
                                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                                        <Field label="Environment" error={errors.pesapal_environment}>
                                            <select
                                                value={data.pesapal_environment || 'sandbox'}
                                                onChange={(e) => setData('pesapal_environment', e.target.value)}
                                                className={inputClass}
                                            >
                                                <option value="sandbox">Sandbox</option>
                                                <option value="live">Live</option>
                                            </select>
                                        </Field>

                                        <div />

                                        <Field label="Consumer Key" error={errors.pesapal_consumer_key}>
                                            <input
                                                value={data.pesapal_consumer_key || ''}
                                                onChange={(e) => setData('pesapal_consumer_key', e.target.value)}
                                                className={inputClass}
                                                placeholder="Pesapal consumer key"
                                            />
                                        </Field>

                                        <Field label="Consumer Secret" error={errors.pesapal_consumer_secret}>
                                            <input
                                                type="password"
                                                value={data.pesapal_consumer_secret || ''}
                                                onChange={(e) => setData('pesapal_consumer_secret', e.target.value)}
                                                className={inputClass}
                                                placeholder="Pesapal consumer secret"
                                            />
                                        </Field>
                                    </div>
                                ) : provider === 'selcom' ? (
                                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                                        <Field label="Environment" error={errors.selcom_environment}>
                                            <select
                                                value={data.selcom_environment || 'sandbox'}
                                                onChange={(e) => setData('selcom_environment', e.target.value)}
                                                className={inputClass}
                                            >
                                                <option value="sandbox">Sandbox</option>
                                                <option value="live">Live</option>
                                            </select>
                                        </Field>

                                        <Field label="Vendor ID" error={errors.selcom_vendor_id}>
                                            <input
                                                value={data.selcom_vendor_id || ''}
                                                onChange={(e) => setData('selcom_vendor_id', e.target.value)}
                                                className={inputClass}
                                                placeholder="Selcom vendor id"
                                            />
                                        </Field>

                                        <Field label="API Key" error={errors.selcom_api_key}>
                                            <input
                                                value={data.selcom_api_key || ''}
                                                onChange={(e) => setData('selcom_api_key', e.target.value)}
                                                className={inputClass}
                                                placeholder="Selcom api key"
                                            />
                                        </Field>

                                        <Field label="API Secret" error={errors.selcom_api_secret}>
                                            <input
                                                type="password"
                                                value={data.selcom_api_secret || ''}
                                                onChange={(e) => setData('selcom_api_secret', e.target.value)}
                                                className={inputClass}
                                                placeholder="Selcom api secret"
                                            />
                                        </Field>
                                    </div>
                                ) : (
                                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                                        <Field label="Environment" error={errors.zenopay_environment}>
                                            <select
                                                value={data.zenopay_environment || 'sandbox'}
                                                onChange={(e) => setData('zenopay_environment', e.target.value)}
                                                className={inputClass}
                                            >
                                                <option value="sandbox">Sandbox</option>
                                                <option value="live">Live</option>
                                            </select>
                                        </Field>

                                        <Field label="Account ID" error={errors.zenopay_account_id}>
                                            <input
                                                value={data.zenopay_account_id || ''}
                                                onChange={(e) => setData('zenopay_account_id', e.target.value)}
                                                className={inputClass}
                                                placeholder="Zenopay account id"
                                            />
                                        </Field>

                                        <Field label="API Key" error={errors.zenopay_api_key}>
                                            <input
                                                value={data.zenopay_api_key || ''}
                                                onChange={(e) => setData('zenopay_api_key', e.target.value)}
                                                className={inputClass}
                                                placeholder="Zenopay api key"
                                            />
                                        </Field>

                                        <Field label="API Secret" error={errors.zenopay_api_secret}>
                                            <input
                                                type="password"
                                                value={data.zenopay_api_secret || ''}
                                                onChange={(e) => setData('zenopay_api_secret', e.target.value)}
                                                className={inputClass}
                                                placeholder="Zenopay api secret"
                                            />
                                        </Field>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <div className="text-sm font-semibold text-slate-900">Webhooks</div>
                                <div className="mt-1 text-[12px] text-slate-500">
                                    Set a secret and use these URLs in the provider dashboard.
                                </div>

                                <div className="mt-5">
                                    <Field label="Webhook Secret" error={errors.payment_webhook_secret}>
                                        <input
                                            value={data.payment_webhook_secret || ''}
                                            onChange={(e) => setData('payment_webhook_secret', e.target.value)}
                                            className={inputClass}
                                            placeholder="Optional secret"
                                        />
                                    </Field>
                                </div>

                                <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Webhook URLs</div>
                                    <div className="mt-3 grid gap-2 text-[12px] text-slate-700">
                                        <div>
                                            <div className="text-[11px] font-semibold text-slate-900">Pesapal</div>
                                            <div className="mt-1 rounded-lg bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-700">
                                                {route('webhooks.payment.pesapal')}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-semibold text-slate-900">Selcom</div>
                                            <div className="mt-1 rounded-lg bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-700">
                                                {route('webhooks.payment.selcom')}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-semibold text-slate-900">Zenopay</div>
                                            <div className="mt-1 rounded-lg bg-slate-50 px-3 py-2 font-mono text-[11px] text-slate-700">
                                                {route('webhooks.payment.zenopay')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-[11px] text-slate-500">
                                        If you set a secret, send it as header <span className="font-mono">X-Webhook-Secret</span> or payload field <span className="font-mono">secret</span>.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SettingsSectionShell>
    );
}
