import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarCheck,
  FileText,
  MessageSquare,
  PlayCircle,
  ShieldCheck,
  Users,
} from 'lucide-react';

import landingImg from '../assets/landing2.jpg';
import videoLessonsImg from '../assets/features/video-lessons.jpg';
import groupDiscussionsImg from '../assets/features/group-discussions.jpg';
import pdfResourcesImg from '../assets/features/pdf-resources.jpg';

const featureCards = [
  {
    icon: PlayCircle,
    image: videoLessonsImg,
    title: 'Video lessons',
    description:
      'Watch guided lessons, walkthroughs, and short academic explainers whenever your group needs support.',
    badge: 'Learn faster',
  },
  {
    icon: MessageSquare,
    image: groupDiscussionsImg,
    title: 'Group discussions',
    description:
      'Keep questions, updates, and team conversations in one clear place without losing important context.',
    badge: 'Stay connected',
  },
  {
    icon: FileText,
    image: pdfResourcesImg,
    title: 'PDF resources',
    description:
      'Access notes, documents, guides, and academic materials in a simple shared resource space.',
    badge: 'Ready to use',
  },
];

const benefitCards = [
  {
    title: 'Clear group coordination',
    description:
      'Create and manage teams with less confusion, better structure, and smoother collaboration.',
  },
  {
    title: 'Better project visibility',
    description:
      'Track tasks, deadlines, and progress so everyone knows what is happening next.',
  },
  {
    title: 'Stronger lecturer support',
    description:
      'Make notices, evaluation steps, and academic communication easier to follow.',
  },
  {
    title: 'Centralized learning tools',
    description:
      'Keep discussions, resources, and study materials in one place for easier access.',
  },
];

const roleCards = [
  {
    icon: ShieldCheck,
    title: 'Admin',
    description:
      'Manage accounts, create groups, and keep the system structured and secure.',
  },
  {
    icon: CalendarCheck,
    title: 'Lecturer',
    description:
      'Share notices, monitor activity, schedule vivas, and evaluate student work.',
  },
  {
    icon: Users,
    title: 'Student',
    description:
      'Join groups, manage project tasks, access learning tools, and stay connected.',
  },
];

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-[#FAFAFC] font-sans text-[#1F1F23] selection:bg-[#FF6A00]/20 selection:text-[#FF6A00]">
      <div className="relative bg-[#FAFAFC]">
        <section className="relative flex min-h-[calc(100vh-84px)] flex-col justify-center overflow-hidden bg-[#FAFAFC]">
          <div className="absolute inset-0">
            <img
              src={landingImg}
              alt="Landing background"
              className="h-full w-full scale-[1.02] object-cover object-center"
            />
          </div>

          <div className="absolute inset-0 bg-white/42" />
          <div className="absolute inset-0 bg-linear-to-b from-[rgba(250,250,252,0.20)] via-[rgba(250,250,252,0.52)] to-[rgba(250,250,252,0.86)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.08),transparent_32%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#FAFAFC] to-transparent" />

          <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">

            <h1 className="max-w-5xl text-5xl font-extrabold tracking-tight text-[#1F1F23] sm:text-7xl lg:text-[5.6rem] lg:leading-[1.02]">
              Master your academic
              <br className="hidden sm:block" /> workflow with{' '}
              <span className="bg-linear-to-r from-[#FF6A00] to-[#FF9B4A] bg-clip-text text-transparent">
                StudySync
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#1F1F23]/68 sm:text-xl sm:leading-9">
              Create groups, manage projects, share resources, and stay in sync
              with lecturers — all in one simple place.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/register"
                className="group inline-flex h-12 items-center justify-center rounded-full bg-[#FF6A00] px-8 text-base font-semibold text-white shadow-[0_10px_24px_rgba(255,106,0,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E65F00] hover:shadow-[0_14px_28px_rgba(255,106,0,0.30)]"
              >
                Get started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <a
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#1F1F23]/10 bg-white/88 px-8 text-base font-semibold text-[#1F1F23] backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-sm"
              >
                Explore features
              </a>
            </div>

          </div>
        </section>

        <section
          id="features"
          className="relative z-10 scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white px-6 py-16 shadow-[0_20px_60px_rgba(31,31,35,0.03)] sm:px-10 lg:px-16 lg:py-20">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FF6A00]/5 blur-[80px]" />

              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6A00]">
                  Features
                </p>
                <h2 className="mt-4 text-3xl font-bold leading-tight text-[#1F1F23] sm:text-5xl">
                  A better way to learn,
                  <span className="mt-2 block text-[#1F1F23]/60">
                    collaborate, and stay on track
                  </span>
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#1F1F23]  sm:text-lg">
                  StudySync brings lessons, discussions, and academic resources
                  into one modern learning space that feels effortless to use.
                </p>
              </div>

              <div className="mt-16 grid gap-8 lg:grid-cols-3">
                {featureCards.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article
                      key={item.title}
                      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-[#FAFAFC] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />

                        <div className="absolute bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/92 text-[#FF6A00] shadow-sm backdrop-blur-md">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="absolute right-5 top-5 rounded-full bg-black/42 px-3 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-md">
                          {item.badge}
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-6 lg:p-8">
                        <h3 className="text-xl font-bold text-[#1F1F23]">
                          {item.title}
                        </h3>

                        <p className="mt-3 flex-1 text-sm leading-relaxed text-[#1F1F23]/60">
                          {item.description}
                        </p>

                        <a
                          href="#benefits"
                          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#FF6A00] transition-colors duration-300 hover:text-[#E65F00]"
                        >
                          Read More
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-14 flex justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-[#1F1F23] shadow-sm transition-all duration-300 hover:bg-slate-50 hover:shadow"
                >
                  Explore All Features
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="benefits"
          className="relative z-10 scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6A00]">
                Our Benefits
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight text-[#1F1F23] sm:text-4xl lg:text-5xl">
                A smoother way to manage
                <span className="mt-1 block text-[#1F1F23]/60">
                  academic work together
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#1F1F23] sm:text-lg">
                StudySync helps students, lecturers, and academic teams work
                more clearly, stay aligned, and reduce the friction that
                usually comes with group-based learning.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {benefitCards.map((item, index) => (
                <article
                  key={item.title}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6A00]/30 hover:shadow-md"
                >
                  <div className="absolute left-0 top-0 h-1 w-full bg-linear-to-r from-[#FF6A00] to-[#FF9B4A] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6A00]/10 text-[#FF6A00]">
                    <span className="text-base font-bold">0{index + 1}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#1F1F23]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[#1F1F23]/60">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="roles"
          className="relative z-10 scroll-mt-28 px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#FF6A00]">
                Roles
              </p>
              <h2 className="mt-4 text-3xl font-bold text-[#1F1F23] sm:text-4xl lg:text-5xl">
                Built for every part of the academic team
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-[#1F1F23]/60">
                Everyone gets the tools they need without making the system feel
                heavy or complicated.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {roleCards.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6A00]/20 hover:shadow-md"
                  >
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF6A00]/10 text-[#FF6A00]">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-2xl font-bold text-[#1F1F23]">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-base leading-relaxed text-[#1F1F23]/60">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative z-10 px-4 pb-24 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1F1F23] px-8 py-16 shadow-2xl sm:px-16 sm:py-20 lg:py-24">
              <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#FF6A00]/20 blur-[100px]" />
              <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/5 blur-[100px]" />

              <div className="relative z-10 max-w-3xl">
                <h2 className="text-3xl font-bold leading-tight text-white sm:text-5xl">
                  Ready to make academic teamwork feel easier?
                </h2>

                <p className="mt-6 text-lg leading-relaxed text-white/70 sm:text-xl">
                  Bring group management, project coordination, and collaborative
                  learning into one place with StudySync.
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link
                    to="/register"
                    className="inline-flex h-14 items-center justify-center rounded-full bg-[#FF6A00] px-8 text-base font-semibold text-white shadow-[0_8px_20px_rgba(255,106,0,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E65F00]"
                  >
                    Start with StudySync
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex h-14 items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20"
                  >
                    Go to sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LandingPage;