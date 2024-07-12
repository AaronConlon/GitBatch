import Description from "@@/components/Description";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Basic Info */}
      <div className="bg-gray-50 group">
        <div className="md:w-[1200px] max-w-[100vw] p-16 md:p-4 grid grid-cols-1 sm:grid-cols-[auto_420px] mx-auto items-center">
          <div className="">
            <h1 className="text-2xl md:text-4xl xl:text-5xl font-bold animate-flip-up fancy-text">
              Delete & Archive Github Repo
            </h1>
            <p className="text-xl pt-4 text-gray-500 my-12 md:my-0">
              The <span className="text-black font-semibold">easy</span> way to{" "}
              <span className="font-semibold text-black underline underline-offset-2 decoration-blue-400">
                archive
              </span>{" "}
              or{" "}
              <span className="font-semibold text-black underline underline-offset-2 decoration-indigo-400">
                delete
              </span>{" "}
              multiple GitHub repos.
            </p>
            <div className="flex mt-8 gap-6 items-center">
              <button className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
                Get Started
              </button>
              <button>Learn More</button>
            </div>
          </div>

          {/* icon */}
          <div className="flex justify-center animate-fade-up animate-delay-[400ms]">
            <Image
              className="object-cover group-hover:hidden"
              src="/delete.svg"
              alt="archive"
              width={420}
              height={420}
            />
            <Image
              className="object-cover hidden group-hover:inline-block group-hover::animate-fade-right"
              src="/archive.svg"
              alt="archive"
              width={420}
              height={420}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <Description />
    </main>
  );
}