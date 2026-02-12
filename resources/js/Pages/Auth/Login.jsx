import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout
            subtitle="WELCOME"
            title="Sign in to your account"
            description="Access your Fortco ERP workspace to manage operations and logistics."
            footer={
                <div className="text-sm text-slate-500">
                    Don&apos;t have an account?{' '}
                    <Link
                        href={route('register')}
                        className="font-bold text-brand-green-600 hover:text-brand-green-700"
                    >
                        Sign up
                    </Link>
                </div>
            }
        >
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                    >
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Google
                    </button>
                    <button
                        type="button"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-green-500/20"
                    >
                        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M17.05 20.28c-.96.95-2.06 1.92-3.4 1.92s-1.74-.92-3.37-.92-2.13.91-3.37.91-2.21-.86-3.35-1.99c-2.33-2.32-4.05-6.56-4.05-10.45 0-3.9 1.97-6.13 4.19-6.13 1.15 0 2.24.81 2.94.81.71 0 2.02-.95 3.42-.95 1.48 0 2.65.54 3.45 1.25-1.63 1.23-2.73 3.44-2.73 5.48 0 2.62 1.48 4.79 3.29 5.98-.36 1.03-1.01 2.14-1.01 3.09zm-3.07-16.14c.66-.81 1.11-1.93 1.11-3.04 0-.17-.02-.34-.05-.5-.99.04-2.19.67-2.9 1.51-.63.74-1.19 1.89-1.19 3 0 .18.03.35.06.44.11.01.21.02.32.02 1 0 2.05-.6 2.65-1.43z"/>
                        </svg>
                        Apple
                    </button>
                </div>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-100" />
                    <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                        OR SIGN IN WITH EMAIL
                    </div>
                    <div className="h-px flex-1 bg-slate-100" />
                </div>

                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="email" value="Email" className="text-[10px] font-bold uppercase tracking-wide text-slate-700" />

                        <div className="relative mt-1.5">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                                </svg>
                            </div>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full rounded-xl border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm transition focus:border-brand-green-500 focus:bg-white focus:ring-brand-green-500/10"
                                autoComplete="username"
                                isFocused={true}
                                placeholder="name@company.com"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                        </div>

                        <InputError message={errors.email} className="mt-1.5" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Password" className="text-[10px] font-bold uppercase tracking-wide text-slate-700" />

                        <div className="relative mt-1.5">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="block w-full rounded-xl border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm transition focus:border-brand-green-500 focus:bg-white focus:ring-brand-green-500/10"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                        </div>

                        <InputError message={errors.password} className="mt-1.5" />
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                    <label className="flex items-center gap-2">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="h-3.5 w-3.5 rounded border-slate-300 text-brand-green-600 focus:ring-brand-green-500"
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="text-xs font-medium text-slate-600">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs font-bold text-brand-green-600 hover:text-brand-green-700"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 disabled:opacity-50"
                    >
                        SIGN IN TO YOUR ACCOUNT
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
