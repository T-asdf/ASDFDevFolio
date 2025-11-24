import Link from 'next/link';

export default function Header() {
  return (
    <div className="flex w-[1000px] font-[500] justify-between mx-auto p-8 text-lg tracking-tight">
      <Link href="/">
        <div className="cursor-pointer">ASDFDevFolio</div>
      </Link>
      
      <div className="flex gap-12 ">
        <Link href="/about">
          <div className="cursor-pointer">About</div>
        </Link>

        <Link href="/portfolio">
          <div className="cursor-pointer">PortFolio</div>
        </Link>

        <Link href="/notes">
          <div className="cursor-pointer">Notes</div>
        </Link>
      </div>
    </div>
  )
}