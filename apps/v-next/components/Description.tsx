import { Filter, LucideTextSelection, Search, Undo2 } from 'lucide-react';

export default function Description() {
  return (
    <div className="text-black font-semibold">
      <div className="flex flex-col md:w-[1200px] max-w-full mx-auto py-16 px-8 md:px-4 gap-4 xl:gap-8">
        <h1 className="text-3xl lg:text-5xl">See It In Action!</h1>
        <p className="w-[90%] xl:w-[60%] font-thin">
          Have unmaintained or forgotten repos lying around? We can help you find them, quickly and easily.
        </p>
        <div className="grid grid-cols-1 xl:grid-cols-[690px_auto] gap-4">
          {/* reference a youtube video */}
          <iframe
            className="max-w-full mx-auto"
            width="690"
            height="315"
            src="https://www.youtube.com/embed/LJG-CJ00xrU"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="flex sm:flex-col gap-4 p-4 md:p-8 flex-wrap">
            <div className="flex gap-2 items-center hover:bg-sky-500 hover:text-white rounded-md p-3 group transition-all">
              <Filter className="group-hover:text-white text-blue-400" />
              <h2>Dynamic Filter</h2>
            </div>

            {/* Search */}
            <div className="flex gap-2 items-center hover:bg-sky-500 hover:text-white rounded-md p-3 group transition-all">
              <Search className="group-hover:text-white text-blue-400" />
              <h2>Fuzzy Search</h2>
            </div>

            {/* Select */}
            <div className="flex gap-2 items-center hover:bg-sky-500 hover:text-white rounded-md p-3 group transition-all">
              <LucideTextSelection className="group-hover:text-white text-blue-400" />
              <h2>Batch Select</h2>
            </div>

            {/* Recover */}
            <div className="flex gap-2 items-center hover:bg-sky-500 hover:text-white rounded-md p-3 group transition-all">
              <Undo2 className="group-hover:text-white text-blue-400" />
              <h2>Recover Deleted Repos</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
