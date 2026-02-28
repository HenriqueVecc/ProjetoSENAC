import Image from 'next/image';


export function Logo() {

  return (
    <div className="flex items-center ">
      <Image
        src="/img/arteLogo.png"
        alt="ReCiclo Logo"
        width={200}
        height={200}
        priority
      />
     
    </div>
  );
}

