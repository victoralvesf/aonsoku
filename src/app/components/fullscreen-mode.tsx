import { ReactNode, useEffect, useState } from "react"
import { ChevronDown, Moon, Sun } from "lucide-react"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/app/components/ui/drawer"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/app/components/ui/table"

import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Card } from "@/app/components/ui/card"
import { usePlayer } from "@/app/contexts/player-context"
import { useTheme } from "@/app/contexts/theme-context"
import { getCoverArtUrl } from "@/api/httpClient"
import Image from "@/app/components/image"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { convertSecondsToTime } from "@/utils/convertSecondsToTime"
import { cn } from "@/lib/utils"
import { subsonic } from "@/service/subsonic"

interface FullscreenModeProps {
  children: ReactNode
}

export default function FullscreenMode({ children }: FullscreenModeProps) {
  const noLyricsFound = 'No lyrics found'

  const [currentLyrics, setCurrentLyrics] = useState(noLyricsFound)
  const {
    currentSongList,
    currentSongIndex
  } = usePlayer()
  const { theme, setTheme } = useTheme()

  const song = currentSongList[currentSongIndex]

  useEffect(() => {
    if (song) getLyrics()
  }, [song])

  async function getLyrics() {
    const response = await subsonic.songs.getLyrics(song.artist, song.title)

    if (response) {
      response.value ? setCurrentLyrics(response.value) : setCurrentLyrics(noLyricsFound)
    }
  }

  const songCoverArtUrl = song ? getCoverArtUrl(song.coverArt, '1000') : ''

  if (!song) return <></>

  return (
    <Drawer
      fixed
      dismissible={false}
      modal={true}
      handleOnly={false}
      disablePreventScroll={true}
    >
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="h-screen w-screen rounded-t-none border-none select-none cursor-default" showHandle={false}>
        <div
          className="w-full h-full bg-cover bg-center backdrop-blur shadow-inner"
          style={{
            backgroundImage: `url(${songCoverArtUrl})`
          }}
        >
          <div className="w-full flex-1 h-full inset-0 bg-background/30 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/30">
            <div className="px-8 pt-12 pb-36 w-full h-full">
              <div className="flex justify-between items-center">
                <DrawerClose asChild>
                  <Button
                    variant="outline"
                    className="w-10 h-10 p-2 rounded-full bg-slate-100/20 dark:bg-slate-800/20 border-slate-100/20 hover:bg-slate-100/40 dark:hover:bg-slate-800/40 shadow-lg"
                  >
                    <ChevronDown className="w-8 h-8 text-slate-800/80 hover:text-slate-800 dark:text-slate-100/80 dark:hover:text-slate-100" strokeWidth={3} />
                  </Button>
                </DrawerClose>

                <Button
                  variant="outline"
                  className="w-10 h-10 p-2 rounded-full bg-slate-100/20 dark:bg-slate-800/20 border-slate-100/20 hover:bg-slate-100/40 dark:hover:bg-slate-800/40 shadow-lg"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="w-8 h-8 text-slate-800/80 hover:text-slate-800 dark:text-slate-100/80 dark:hover:text-slate-100" />
                  ) : (
                    <Moon className="w-8 h-8 text-slate-800/80 hover:text-slate-800 dark:text-slate-100/80 dark:hover:text-slate-100" />
                  )}
                </Button>
              </div>
              <div className="mx-auto w-full h-full flex justify-center items-center">
                <div className="flex gap-12">
                  <div className="flex flex-col gap-4 max-w-[500px]">
                    <Image
                      src={songCoverArtUrl}
                      width={500}
                      height={500}
                      alt={song.title}
                      className="aspect-square rounded-2xl shadow-lg shadows-4 shadow-opacity-5 shadow-y-[3px] shadows-scale-3"
                    />

                    <h2 className="scroll-m-20 text-3xl font-bold tracking-tight text-center">
                      {song.title}
                    </h2>
                    <p className="leading-7 -mt-2 text-lg text-foreground/70 text-center">
                      {song.artist}
                    </p>
                  </div>

                  <Card className="w-[800px] h-[600px] rounded-2xl p-6 shadow-lg shadows-4 shadow-opacity-5 shadow-y-[3px] shadows-scale-3">
                    <Tabs defaultValue="queue" className="w-full h-full">
                      <TabsList className="w-full">
                        <TabsTrigger value="queue" className="w-full">Queue</TabsTrigger>
                        <TabsTrigger value="lyrics" className="w-full">Lyrics</TabsTrigger>
                      </TabsList>
                      <ScrollArea className="mt-4 h-[90%]">
                        <TabsContent value="queue" className="mt-0 pr-3">
                          <Table className="h-full mb-1">
                            <TableBody className="rounded-md">
                              {currentSongList.map((entry, index) => (
                                <TableRow
                                  key={entry.id}
                                  className={cn("hover:bg-muted-foreground/15 border-0", index === currentSongIndex && "bg-primary/15")}
                                >
                                  <TableCell className="w-[30px] text-center font-medium">{index + 1}</TableCell>
                                  <TableCell>
                                    <span className="font-semibold">{entry.title}</span>
                                    <p className="font-light text-sm text-foreground/70">{entry.artist}</p>
                                  </TableCell>
                                  <TableCell>{convertSecondsToTime(entry.duration)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TabsContent>
                        <TabsContent value="lyrics" className="mt-0 pr-3">
                          {currentLyrics && (
                            <div className="text-center font-bold text-xl">
                              <TextWithBreaks text={currentLyrics} />
                            </div>
                          )}
                        </TabsContent>
                      </ScrollArea>
                    </Tabs>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

const TextWithBreaks = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  return (
    <div>
      {lines.map((line, index) => (
        <p key={index} className="leading-10">{line}</p>
      ))}
    </div>
  );
};
