import Link from "next/link";
import Nav from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="mx-auto max-w-5xl px-5 py-24 sm:px-8">
        <p className="specimen text-ink-2"><span className="text-accent">404</span> — not found</p>
        <h1 className="font-display mt-5 max-w-3xl text-5xl leading-[1.02] tracking-[-0.04em] sm:text-7xl">
          Nothing under the microscope here.
        </h1>
        <Link
          href="/"
          className="btn btn-primary mt-10"
        >
          Back to the home page
        </Link>
      </main>
    </>
  );
}
