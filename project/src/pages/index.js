import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex justfiy-center items-center h-[90vh] bg-gradient-to-br from-gray-900 to-black">
        <div className="flex text-gray-100 font-[100] gap-2 text-5xl w-1/2 m-auto items-center justfiy-center tracking-tighter">
          개발자 <span className="font-[500]">이서준</span> 입니다
        </div>
      </div>

      <div className="flex flex-col min-h-[10vh]">
        <div className="w-full min-h-[10vh] bg-gradient-to-tr from-gray-900 to-black">
          <div className="flex min-h-[10vh] text-white w-3/4 mx-auto justify-center gap-10">            
            <div className="flex w-3/4 min-h-[10vh] justify-between text-md font-[400] text-gray-400">
              <Link href="/about">
                <div className="cursor-pointer">About</div>
              </Link>

              <Link href="/portfolio">
                <div className="cursor-pointer">Project</div>
              </Link>

              <Link href="/awards">
                <div className="cursor-pointer">Awards</div>
              </Link>

              <Link href="/stacks">
                <div className="cursor-pointer">Stacks</div>
              </Link>

              <Link href="/notes">
                <div className="cursor-pointer">Notes</div>
              </Link>
            </div>
          </div>
        </div> 
      </div>

      <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black text-white">
        asdf
      </div>
    </>
  );
}
