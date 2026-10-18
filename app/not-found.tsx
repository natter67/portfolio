import Link from "next/link";
import Nav from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-5xl px-4 py-24 sm:px-8">
        <p className="specimen text-ink-2">Specimen 404 — not found</p>
        <h1 className="font-display mt-4 text-5xl font-semibold sm:text-7xl">
          Nothing under the microscope here.
        </h1>
        <Link
          href="/"
          className="mt-8 inline-block bg-accent-fill px-6 py-3 text-sm font-semibold text-accent-on"
        >
          Back to the home page
        </Link>
      </main>
    </>
  );
}
