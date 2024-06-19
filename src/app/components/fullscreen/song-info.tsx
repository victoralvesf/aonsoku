interface SongInfoProps {
  imageUrl: string
  songTitle: string
  artist: string
}

export function SongInfo({ imageUrl, songTitle, artist }: SongInfoProps) {
  const backgroundImage = `url(${imageUrl})`

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-[50%] 2xl:w-[80%] max-w-[550px] bg-contain bg-center aspect-square rounded-2xl shadow-lg shadows-4 shadow-opacity-5 shadow-y-[3px] shadows-scale-3"
        style={{ backgroundImage }}
      />

      <h2 className="scroll-m-20 text-xl 2xl:text-4xl mt-4 font-bold tracking-tight text-center">
        {songTitle}
      </h2>
      <p className="leading-7 2xl:mt-2 text-base 2xl:text-lg text-foreground/70 text-center">
        {artist}
      </p>
    </div>
  )
}
