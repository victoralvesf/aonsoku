import InfoPanel from '@/app/components/info/info-panel'
import {
  Collapsible,
  CollapsibleContent,
} from '@/app/components/ui/collapsible'
import { useAppPages } from '@/store/app.store'

interface CollapsibleInfoProps {
  title: string
  bio?: string
  lastFmUrl?: string
  musicBrainzId?: string
}

export function CollapsibleInfo({
  title,
  bio,
  lastFmUrl,
  musicBrainzId,
}: CollapsibleInfoProps) {
  const { showInfoPanel } = useAppPages()

  return (
    <Collapsible open={showInfoPanel}>
      <CollapsibleContent>
        <div className="mb-6">
          {bio && (
            <InfoPanel
              title={title}
              bio={bio}
              lastFmUrl={lastFmUrl}
              musicBrainzId={musicBrainzId}
            />
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
