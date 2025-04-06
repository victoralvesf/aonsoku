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
  useStateInfo?: boolean
}

export function CollapsibleInfo({
  title,
  bio,
  lastFmUrl,
  musicBrainzId,
  useStateInfo = true,
}: CollapsibleInfoProps) {
  const { showInfoPanel } = useAppPages()

  return (
    <Collapsible open={useStateInfo ? showInfoPanel : true}>
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
