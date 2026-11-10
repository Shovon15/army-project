import React from "react";

const Page = () => {
  return (
    <main className="min-h-screen bg-white px-5 py-20 text-gray-900">
      <div className="mx-auto max-w-3xl text-center flex flex-col justify-center items-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-red-600">
          Upcoming Event
        </p>

        <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
          Join Us for Something Special
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-base leading-8 text-gray-500 md:text-lg">
          Be part of an exciting event filled with inspiration, innovation,
          networking, and unforgettable experiences. We look forward to
          welcoming you!
        </p>

        <div className="flex flex-col items-center gap-4 text-sm text-gray-600 sm:flex-row sm:justify-center sm:gap-8">
          <p>📅 November 25, 2026</p>
          <p>🕒 10:00 AM – 5:00 PM</p>
          <p>📍 Dhaka, Bangladesh</p>
        </div>

        <div className="mt-10">
          <button className="rounded-full bg-red-600 px-8 py-3 font-semibold text-white transition hover:bg-red-700">
            Register Now
          </button>
        </div>
      </div>
    </main>
  );
};

export default Page;
