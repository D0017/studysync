import { Link } from 'react-router-dom';

const LandingPage = () => {
  const features = [
    {
      title: 'Module Management',
      description:
        'Organize modules, resources, academic content, and schedules in one streamlined platform.',
    },
    {
      title: 'Student Collaboration',
      description:
        'Support team formation, communication, and academic collaboration with a more structured workflow.',
    },
    {
      title: 'Role-Based Dashboards',
      description:
        'Separate experiences for Admins, Lecturers, and Students with focused tools and clear access.',
    },
    {
      title: 'Leadership Requests',
      description:
        'Handle approvals and leadership requests through an organized and professional process.',
    },
    {
      title: 'Secure Access',
      description:
        'University ID validation and secure authentication provide a more reliable onboarding flow.',
    },
    {
      title: 'Academic Productivity',
      description:
        'Reduce confusion and improve visibility with a centralized LMS built for modern universities.',
    },
  ];

  const stats = [
    { value: '3 Roles', label: 'Admin, Lecturer, Student' },
    { value: '1 Platform', label: 'Unified LMS experience' },
    { value: '24/7', label: 'Accessible academic workflow' },
  ];

  return (
    <main className="bg-[#0A0A0C] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,106,0,0.20),transparent_28%),radial-gradient(circle_at_left,rgba(255,255,255,0.05),transparent_22%)]" />

        <div className="mx-auto grid min-h-[92vh] max-w-7xl items-center gap-16 px-6 py-16 lg:grid-cols-2 lg:px-10">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center rounded-full border border-[#FF6A00]/20 bg-[#FF6A00]/10 px-4 py-2 text-sm font-medium text-[#FF6A00]">
              Modern Learning Management Experience
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
              A modern LMS platform built for
              <span className="block text-[#FF6A00]">smarter academic collaboration.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              StudySync helps universities manage modules, support lecturers, empower students,
              and simplify collaboration through one clean and professional digital workspace.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="rounded-2xl bg-[#FF6A00] px-7 py-4 text-sm font-bold text-white shadow-[0_16px_40px_rgba(255,106,0,0.38)] transition hover:scale-[1.02] hover:bg-[#ff7b22]"
              >
                Start Now
              </Link>

              <Link
                to="/login"
                className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Login to Portal
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                >
                  <h3 className="text-2xl font-extrabold text-white">{stat.value}</h3>
                  <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Replaced right side content */}
          <div className="relative z-10">
            <div className="relative rounded-4xl border border-white/10 bg-linear-to-br from-[#1F1F23] to-[#111114] p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Platform Overview</p>
                  <h3 className="text-2xl font-bold text-white">Built for modern academic workflows</h3>
                </div>
                <div className="rounded-2xl bg-[#FF6A00]/15 px-4 py-2 text-sm font-semibold text-[#FF6A00]">
                  LMS Ready
                </div>
              </div>

              <div className="space-y-4">


                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm font-semibold text-[#FF6A00]">For Students</p>
                    <h4 className="mt-2 text-lg font-bold text-white">Collaborate with clarity</h4>
                    <p className="mt-2 text-sm leading-6 text-gray-300">
                      Access modules, participate in groups, and stay connected with coursework in one place.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm font-semibold text-[#FF6A00]">For Lecturers</p>
                    <h4 className="mt-2 text-lg font-bold text-white">Guide learning effectively</h4>
                    <p className="mt-2 text-sm leading-6 text-gray-300">
                      Manage module activities, support engagement, and maintain academic structure with ease.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <p className="text-sm text-gray-400">What StudySync helps you do</p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[
                      'Manage academic modules',
                      'Streamline group collaboration',
                      'Support role-based access',
                      'Improve course coordination',
                      'Create a professional LMS experience',
                      'Keep learning workflows organized',
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black/10 px-4 py-3"
                      >
                        <div className="h-2.5 w-2.5 rounded-full bg-[#FF6A00]" />
                        <p className="text-sm text-gray-200">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#FF6A00]/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-white/10 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#F4F4F6] py-24 text-[#1F1F23]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6A00]">Core Features</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">
              Everything needed for a modern learning management system
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Built for academic administration, course coordination, and student collaboration with
              a polished and professional experience.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6A00]/10 text-lg font-bold text-[#FF6A00]">
                  0{index + 1}
                </div>
                <h3 className="text-xl font-bold text-[#1F1F23]">{feature.title}</h3>
                <p className="mt-3 leading-7 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="bg-[#0A0A0C] py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6A00]">Why StudySync</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-white">
              Designed to feel professional, modern, and easy to use
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-300">
              StudySync gives your LMS a premium identity with intuitive flows for administration,
              teaching, and student engagement.
            </p>
          </div>

          <div className="grid gap-5">
            {[
              'Professional UI that builds trust with students and lecturers',
              'Centralized academic workflows instead of scattered systems',
              'Clear role-based structure for admins, lecturers, and students',
              'Modern visual identity aligned with university-grade platforms',
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-[#1F1F23] p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#FF6A00] text-sm font-bold text-white">
                    ✓
                  </div>
                  <p className="text-base leading-7 text-gray-200">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="bg-[#F4F4F6] py-24 text-[#1F1F23]">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6A00]">User Roles</p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">Built for every academic stakeholder</h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
              <h3 className="text-2xl font-bold">Admins</h3>
              <p className="mt-4 text-gray-600">
                Manage users, create modules, review requests, and maintain the entire academic structure.
              </p>
            </div>

            <div className="rounded-3xl bg-[#1F1F23] p-8 text-white shadow-xl">
              <div className="mb-4 inline-flex rounded-full bg-[#FF6A00]/15 px-3 py-1 text-xs font-bold text-[#FF6A00]">
                Most Active
              </div>
              <h3 className="text-2xl font-bold">Lecturers</h3>
              <p className="mt-4 text-gray-300">
                Oversee modules, guide learners, and support collaboration with a more structured academic workflow.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
              <h3 className="text-2xl font-bold">Students</h3>
              <p className="mt-4 text-gray-600">
                Access modules, join groups, collaborate with peers, and stay aligned with course activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A0A0C] py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="rounded-4xl border border-white/10 bg-linear-to-r from-[#1F1F23] to-[#111114] p-10 text-center shadow-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6A00]">Get Started</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white">
              Bring a polished LMS experience to your academic environment
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-300">
              Create your account and start managing modules, users, collaboration, and learning workflows with StudySync.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/register"
                className="rounded-2xl bg-[#FF6A00] px-7 py-4 text-sm font-bold text-white shadow-[0_16px_40px_rgba(255,106,0,0.38)] transition hover:scale-[1.02] hover:bg-[#ff7b22]"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;