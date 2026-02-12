import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout
            subtitle="GET STARTED"
            title="Create your account"
            description="Create an account to access your Fortco ERP workspace."
            footer={
                <div className="text-sm text-slate-600">
                    Already registered?{' '}
                    <Link
                        href={route('login')}
                        className="font-medium text-brand-green-700 hover:text-brand-green-600"
                    >
                        Sign in
                    </Link>
                </div>
            }
        >
            <Head title="Register" />

            <form onSubmit={submit}>
                <div className="space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Name" className="text-[10px] font-bold uppercase tracking-wide text-slate-700" />

                        <div className="relative mt-1.5">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="block w-full rounded-xl border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm transition focus:border-brand-green-500 focus:bg-white focus:ring-brand-green-500/10"
                                autoComplete="name"
                                isFocused={true}
                                placeholder="Full Name"
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                        </div>

                        <InputError message={errors.name} className="mt-1.5" />
                    </div>

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
                                placeholder="name@company.com"
                                onChange={(e) => setData('email', e.target.value)}
                                required
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
                                autoComplete="new-password"
                                placeholder="••••••••"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                        </div>

                        <InputError message={errors.password} className="mt-1.5" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                            className="text-[10px] font-bold uppercase tracking-wide text-slate-700"
                        />

                        <div className="relative mt-1.5">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="block w-full rounded-xl border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm transition focus:border-brand-green-500 focus:bg-white focus:ring-brand-green-500/10"
                                autoComplete="new-password"
                                placeholder="••••••••"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                required
                            />
                        </div>

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-1.5"
                        />
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/20 disabled:opacity-50"
                    >
                        CREATE YOUR ACCOUNT
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
