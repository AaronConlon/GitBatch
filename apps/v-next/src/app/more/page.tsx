import BuyMeCoffee from '@@/components/BuyMeCoffee';
import { ArrowLeftSquare } from 'lucide-react';
import Link from 'next/link';

export default function MorePage() {
  return (
    <div className="bg-gray-50 min-h-[30vw] border-b border-b-gray-100">
      <div className="md:w-[1200px] max-w-full p-16 md:p-4 grid grid-cols-1 sm:grid-cols-[auto_640px] mx-auto items-center text-sm font-thin gap-4 gap-x-24">
        <h1 className="text-5xl font-semibold py-12">MORE</h1>
        <p>
          I am tired of repetitive manual tasks, so I try to automate as much as possible. This project is an
          example of one of my projects on GitHub. I wanted to delete some projects that I no longer use, but
          I did not want to delete them one by one. So, I wrote this project which can help me find those
          unused projects and then I can choose to delete them.
        </p>
        <p>
          In addition to deleting, you can also archive the repository or restore a deleted repository to
          avoid accidental deletion. (Repositories that have already been officially deleted by GitHub cannot
          be recovered.)
        </p>
        <p>
          You only need to log in with your GitHub account, and we will obtain some permissions to display
          data and complete batch operations.
        </p>

        <div>
          This site not liable for any damages or losses arising from your use or inability to use the
          service.
        </div>
      </div>
      <div className="bg-white py-12">
        <div className="md:w-[1200px] max-w-full mx-auto">
          <div className="text-md grid grid-cols-1 sm:grid-cols-[auto_200px] gap-4">
            <p>Rest assured, the code is open source and will not produce any harmful behavior.</p>
          </div>
          <div className="flex justify-between items-center mt-8">
            <Link
              href="/"
              className="flex items-center gap-2 px-2 py-1 rounded-md bg-blue-500 text-white w-max mt-4"
            >
              <ArrowLeftSquare />
              <span>GO BACK</span>
            </Link>
            <BuyMeCoffee />
          </div>
        </div>
      </div>
    </div>
  );
}
