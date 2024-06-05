import { PlusIcon, RotateCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/app/components/ui/button";
import { SimpleTooltip } from "@/app/components/ui/simple-tooltip";
import { usePlaylists } from "@/app/contexts/playlists-context";

export function PlaylistOptionsButtons() {
  const { setPlaylistDialogState, fetchPlaylists } = usePlaylists()
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2">
      <SimpleTooltip text={t('playlist.refresh')}>
        <Button
          size="icon"
          variant="secondary"
          className="w-6 h-6 p-[5px]"
          onClick={() => fetchPlaylists()}
        >
          <RotateCw />
        </Button>
      </SimpleTooltip>

      <SimpleTooltip text={t('playlist.createDialog.title')}>
        <Button
          size="icon"
          variant="default"
          className="w-6 h-6 p-[5px]"
          onClick={() => setPlaylistDialogState(true)}
        >
          <PlusIcon strokeWidth={3} />
        </Button>
      </SimpleTooltip>
    </div>
  )
}