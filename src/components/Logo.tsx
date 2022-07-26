import Image from "next/image";

export default function Logo({
  size
}: {
  size: number
}) {
  return (
    <Image
      src="/logo.png"
      alt="shopswap logo"
      height={Math.round(170 / size)}
      width={Math.round(796 / size)}
    />
  );
}
