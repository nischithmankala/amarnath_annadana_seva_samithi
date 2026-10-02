import { ShieldAlert } from 'lucide-react'

interface DigitalMemberCardProps {
  profile: {
    name: string
    memberId: string
    category?: string
    status: string
    joiningDate?: string
  }
  isRevoked?: boolean
  className?: string
}

export function DigitalMemberCard({ profile, isRevoked, className = '' }: DigitalMemberCardProps) {
  return (
    <div className={`w-full relative ${className}`}>
      {isRevoked && (
        <div className="absolute inset-0 z-20 bg-red-900/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-white p-6 text-center border-4 border-red-500">
          <ShieldAlert className="w-16 h-16 mb-4 text-red-400" />
          <h3 className="text-2xl font-bold mb-2">CARD REVOKED</h3>
          <p className="text-sm">This membership card has been revoked and is no longer valid.</p>
        </div>
      )}

      <div 
        className="w-full rounded-2xl p-6 text-sand-50 shadow-2xl relative overflow-hidden border border-saffron-500/30 bg-cover bg-center"
        style={{ backgroundImage: 'url("/card-bg.jpg")' }}
      >
        {/* Dark gradient overlay to ensure text is readable over the beautiful devotional background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-950/95 via-primary-900/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-transparent to-transparent"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex justify-between items-start mb-8 border-b border-saffron-500/20 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner overflow-hidden border-2 border-saffron-500/50 p-1">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-saffron-400 leading-tight">AMARNATH ANNADANA<br/>SEVA SAMITHI</h4>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-1">
              <p className="text-xs text-saffron-300 uppercase tracking-wider font-semibold mb-2">Member Details</p>
              <p className="font-bold text-2xl tracking-wide">{profile.name}</p>
              <p className="text-sm text-sand-100/90 font-mono tracking-widest">{profile.memberId}</p>
              <div className="inline-block mt-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
                <p className="text-xs font-bold text-saffron-300">{profile.category || 'Life Member'}</p>
              </div>
            </div>
            <div className="w-24 h-32 bg-white/10 rounded-lg flex items-center justify-center font-bold text-4xl border-2 border-white/20 shadow-lg backdrop-blur-sm relative overflow-hidden">
              {profile.name.charAt(0)}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end pt-4 border-t border-white/10">
            <div>
              <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Status</p>
              <p className="text-sm font-bold text-green-400">ACTIVE</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Validity</p>
              <p className="text-sm font-bold text-white">LIFETIME</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
