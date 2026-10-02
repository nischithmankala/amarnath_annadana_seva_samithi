export interface ReceiptItem {
  description: string
  subtitle?: string
  qty: string | number
  rate: number
  amount: number
}

export interface DonationReceiptProps {
  receiptNumber?: string
  date?: string
  donorName?: string
  donorAddress?: string
  donorPhone?: string
  donorEmail?: string
  donorPan?: string
  paymentMethod?: string
  transactionId?: string
  items?: ReceiptItem[]
  subtotal?: number
  total?: number
  onPrint?: () => void
  onClose?: () => void
  isModal?: boolean
}

export const DonationReceipt: React.FC<DonationReceiptProps> = ({
  receiptNumber = 'AASS-SDPT-2026-001',
  date = 'September 28, 2026',
  donorName = 'Sri Ramesh Kumar',
  donorAddress = 'Door No. 12-34, Housing Board Colony\nSiddipet, Telangana - 502103',
  donorPhone = '+91 91234 56789',
  donorEmail = '',
  donorPan = '',
  paymentMethod = 'UPI / Online Transfer',
  transactionId = 'UPI/625983710294',
  items = [
    {
      description: 'Amarnath Yatra Annadanam Seva Contribution',
      subtitle: '(Mahaprasadam)',
      qty: '1',
      rate: 5000,
      amount: 5000,
    },
    {
      description: 'Special Meal Sponsorship (Nitya Annadanam)',
      qty: '1 Day',
      rate: 2500,
      amount: 2500,
    },
  ],
  subtotal,
  total,
  onPrint,
  onClose,
  isModal = false,
}: DonationReceiptProps) => {
  const calculatedTotal = total ?? items.reduce((sum, item) => sum + item.amount, 0)
  const calculatedSubtotal = subtotal ?? calculatedTotal

  const formatCurrency = (val: number) => {
    return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      window.print()
    }
  }

  return (
    <div className={`donation-receipt-outer ${isModal ? 'fixed inset-0 z-50 flex flex-col items-center bg-black/80 p-4 md:p-8 overflow-y-auto' : 'flex flex-col items-center'}`}>
      
      {/* Top Floating Actions if in modal or standalone */}
      <div className="no-print mb-4 flex flex-wrap items-center justify-between w-full max-w-[210mm] bg-white p-3 rounded-lg shadow-md border border-amber-300 gap-3 shrink-0">
        <div className="flex items-center gap-2 font-serif font-bold text-emerald-900 text-sm">
          <span>🔱</span>
          <span>Amarnath Annadana Seva Samithi — Donation Receipt</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handlePrint}
            className="cursor-pointer px-4 py-1.5 bg-gradient-to-r from-emerald-800 to-emerald-700 text-white rounded text-sm font-semibold shadow hover:from-emerald-900 hover:to-emerald-800 transition-all flex items-center gap-1.5"
          >
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/><path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"/></svg>
            Print / Save PDF
          </button>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="cursor-pointer px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-sm font-medium transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Responsive wrapper for scrolling on small screens */}
      <div className="w-full overflow-x-auto flex justify-center pb-8 shrink-0">
        {/* Main A4 Printable Document Container */}
        <div 
          id="receipt-print-area"
          className="receipt-a4-sheet shrink-0 relative w-[210mm] h-[297mm] max-h-[297mm] bg-[#fffdf5] text-[#173d2b] shadow-2xl p-[7mm_8mm_6mm_8mm] flex flex-col justify-between overflow-hidden select-text"
        style={{
          fontFamily: "'Lora', Georgia, serif",
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255, 250, 235, 0.8) 0%, transparent 75%), linear-gradient(to bottom, #fdfbf5 0%, #fffdf8 40%, #fefcf3 100%)'
        }}
      >
        {/* Large Faded Logo Watermark */}
        <div 
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: 'url(/logo.png)',
            backgroundPosition: 'center 52%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '140mm',
            opacity: 0.085,
          }}
        />

        {/* Triple Gold Ornamental Border */}
        <div 
          className="absolute pointer-events-none z-20"
          style={{
            top: '3.5mm',
            left: '3.5mm',
            right: '3.5mm',
            bottom: '3.5mm',
            border: '2px solid #b77b15',
            boxShadow: 'inset 0 0 0 1.5px #fbf0d0, inset 0 0 0 3.8px #cf972d, inset 0 0 0 5.2px #fbf0d0',
          }}
        />

        {/* Corner Ornaments */}
        <div className="absolute text-[#b77b15] text-[24px] z-30 pointer-events-none select-none" style={{ top: '4.8mm', left: '5.2mm' }}>❖</div>
        <div className="absolute text-[#b77b15] text-[24px] z-30 pointer-events-none select-none" style={{ top: '4.8mm', right: '5.2mm' }}>❖</div>
        <div className="absolute text-[#b77b15] text-[24px] z-30 pointer-events-none select-none" style={{ bottom: '4.8mm', left: '5.2mm' }}>❖</div>
        <div className="absolute text-[#b77b15] text-[24px] z-30 pointer-events-none select-none" style={{ bottom: '4.8mm', right: '5.2mm' }}>❖</div>

        {/* Content Structure */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          
          {/* Top Block: Header, Slogan, Title, Info, Table, Totals */}
          <div>
            
            {/* 1. Header Banner */}
            <div 
              className="relative rounded-[6px] overflow-hidden border-[1.5px] border-[#c79633] shadow-sm mb-[2mm]"
              style={{
                backgroundImage: 'url(/header-bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
              }}
            >
              {/* Background mountain overlay */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.72) 45%, rgba(255, 255, 255, 0.55) 100%)'
                }}
              />
              
              <div className="relative p-[2.8mm_3mm_2.8mm_3mm] grid grid-cols-[36mm_1fr_28mm] items-center gap-[2mm] bg-transparent">
                {/* Left Logo */}
                <div className="flex justify-center items-center bg-transparent">
                  <img src="/logo.png" alt="Amarnath Annadana Seva Samithi" className="w-[35mm] h-[35mm] object-contain drop-shadow mix-blend-multiply" />
                </div>

                {/* Center Title & Address */}
                <div className="text-center">
                  <h1 className="text-[20px] font-extrabold text-[#065132] tracking-wide leading-tight" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                    AMARNATH ANNADANA SEVA SAMITHI
                  </h1>
                  <div className="mt-[1mm] text-[13px] font-bold text-[#173d2b] tracking-tight">
                    <span>Siddipet Unit</span> &nbsp;|&nbsp; <span className="text-[#7b4b12]">Reg. No: 1234/2020</span>
                  </div>
                  <div className="mt-[1mm] text-[11px] leading-tight text-[#244133] font-medium">
                    <div>Main Road, Siddipet, Telangana - 502103</div>
                    <div className="mt-[0.5mm] font-semibold text-[#0b5735]">
                      Phone: +91 98765 43210 &nbsp;|&nbsp; Email: contact@amarnathannadana.org
                    </div>
                  </div>
                </div>

                {/* Right Trishul & Damru Graphic */}
                <div className="flex justify-center items-center">
                  <svg className="w-[26mm] h-[30mm]" viewBox="0 0 100 120" fill="none">
                    <path d="M50 5 L50 115" stroke="#b77b15" strokeWidth="4.5" strokeLinecap="round"/>
                    <path d="M50 5 L42 22 C45 20 55 20 58 22 Z" fill="#b77b15"/>
                    <path d="M30 35 C20 45 15 25 22 15 C28 28 42 35 50 35 C58 35 72 28 78 15 C85 25 80 45 70 35 C62 48 55 48 50 48 C45 48 38 48 30 35 Z" fill="#cf972d" stroke="#b77b15" strokeWidth="1.5"/>
                    <circle cx="50" cy="55" r="4" fill="#b77b15"/>
                    <path d="M38 60 L62 72 L38 72 L62 60 Z" fill="#dca433" stroke="#b77b15" strokeWidth="1.5"/>
                    <circle cx="50" cy="66" r="2.5" fill="#9d261b"/>
                    <path d="M50 68 C62 70 75 64 85 68 C78 78 65 74 50 82 Z" fill="#e65100"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* 2. Devotional Slogan */}
            <div className="flex items-center justify-center gap-3 my-[1.5mm]">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#c79633]" />
              <div className="text-[#c79633] text-sm">❖</div>
              <div className="text-[17.5px] font-bold text-[#9d261b] tracking-widest" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                ॥ अन्नदानं महादानम् ॥
              </div>
              <div className="text-[#c79633] text-sm">❖</div>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#c79633]" />
            </div>

            {/* 3. Receipt Title Ribbon */}
            <div className="flex justify-center mb-[2.5mm]">
              <div 
                className="w-[68%] py-[2.5mm] px-6 text-center text-white rounded-full flex items-center justify-center gap-3 shadow-md"
                style={{
                  background: 'linear-gradient(135deg, #075b36 0%, #0e7345 50%, #075b36 100%)',
                  border: '2px solid #dca433',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.2), inset 0 0 0 1.2px #fde7a8',
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: '18px',
                  fontWeight: 800,
                  letterSpacing: '2px',
                }}
              >
                <span className="text-[#f7d572] text-sm">❖</span>
                <span>DONATION RECEIPT</span>
                <span className="text-[#f7d572] text-sm">❖</span>
              </div>
            </div>

            {/* 4. Donor Info & Metadata Grid */}
            <div className="grid grid-cols-2 gap-[5mm] mb-[2.5mm]">
              {/* Left Column: Donor */}
              <div>
                <div className="mb-[1.5mm]">
                  <span 
                    className="inline-block py-[1.5mm] px-4 rounded-full text-[#0c3e23] font-bold text-[12px] tracking-wide border border-[#b77b15] shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #dca433 0%, #f8db7b 50%, #c99321 100%)',
                      fontFamily: "'Cinzel', serif",
                    }}
                  >
                    PAYMENT RECEIVED
                  </span>
                </div>

                <div>
                  <div className="inline-block py-[1.4mm] px-3.5 mb-[1.5mm] bg-gradient-to-r from-[#075b36] to-[#09683e] text-white rounded-xl text-[11.5px] font-bold border border-[#c99a38]">
                    Donor Details:
                  </div>
                  <div className="bg-white/80 border border-[#d8b868] rounded p-[2.2mm_3.2mm] text-[12px] leading-relaxed">
                    <div className="font-bold text-[#064b2d] text-[14px]">{donorName}</div>
                    <div className="text-[#213a2c] whitespace-pre-line text-[11.5px] mt-0.5">{donorAddress}</div>
                    {donorPhone && <div className="text-[#173d2b] font-semibold text-[11.5px] mt-1">Phone: {donorPhone}</div>}
                    {donorEmail && <div className="text-[#173d2b] font-semibold text-[11.5px]">Email: {donorEmail}</div>}
                    {donorPan && <div className="text-[#173d2b] font-semibold text-[11.5px]">PAN: {donorPan}</div>}
                  </div>
                </div>
              </div>

              {/* Right Column: Receipt Metadata */}
              <div className="flex flex-col justify-end">
                <table className="w-full text-[12px] border-separate border-spacing-y-[1.8mm]">
                  <tbody>
                    <tr>
                      <td className="w-[38%] font-bold text-[#075b36]">Receipt No</td>
                      <td className="w-[6%] font-bold text-neutral-600">:</td>
                      <td className="w-[56%] font-bold text-[#064b2d]">{receiptNumber}</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[#075b36]">Date</td>
                      <td className="font-bold text-neutral-600">:</td>
                      <td className="font-semibold text-[#172f24]">{date}</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[#075b36]">Payment Method</td>
                      <td className="font-bold text-neutral-600">:</td>
                      <td className="font-semibold text-[#172f24]">{paymentMethod}</td>
                    </tr>
                    <tr>
                      <td className="font-bold text-[#075b36]">Transaction ID</td>
                      <td className="font-bold text-neutral-600">:</td>
                      <td className="font-semibold text-[#172f24]">{transactionId}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Donation Items Table */}
            <div className="mb-[2mm]">
              <table className="w-full border-collapse bg-white/90 border-2 border-[#b77b15] text-[12px]">
                <thead>
                  <tr 
                    className="text-white text-[11px] font-bold tracking-wider"
                    style={{
                      background: 'linear-gradient(to bottom, #075b36 0%, #05482b 100%)',
                      fontFamily: "'Cinzel', serif"
                    }}
                  >
                    <th className="py-[2.8mm] px-3 border border-[#c99a38] text-left w-[52%]">SEVA / DONATION DESCRIPTION</th>
                    <th className="py-[2.8mm] px-2 border border-[#c99a38] text-center w-[14%]">QTY / DAYS</th>
                    <th className="py-[2.8mm] px-3 border border-[#c99a38] text-right w-[16%]">RATE</th>
                    <th className="py-[2.8mm] px-3 border border-[#c99a38] text-right w-[18%]">AMOUNT (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? 'bg-[#f9f4e2]/70' : 'bg-transparent'}>
                      <td className="py-[2.8mm] px-3 border border-[#d8bb72] text-[#1b3528]">
                        <div className="font-semibold text-[#0e3d23]">{item.description}</div>
                        {item.subtitle && <div className="text-[11px] text-neutral-600 italic">{item.subtitle}</div>}
                      </td>
                      <td className="py-[2.8mm] px-2 border border-[#d8bb72] text-center font-semibold text-[#1b3528]">{item.qty}</td>
                      <td className="py-[2.8mm] px-3 border border-[#d8bb72] text-right font-bold text-[#173d2b]">{formatCurrency(item.rate)}</td>
                      <td className="py-[2.8mm] px-3 border border-[#d8bb72] text-right font-bold text-[#173d2b]">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 6. Totals Box */}
            <div className="flex justify-end mb-[2mm]">
              <div className="w-[46%] rounded overflow-hidden shadow-sm">
                <div className="flex justify-between items-center py-[2.2mm] px-3.5 bg-[#fdf5df] border border-[#d4a946] border-b-0 text-[13px] text-[#173d2b]">
                  <strong>Subtotal:</strong>
                  <strong>{formatCurrency(calculatedSubtotal)}</strong>
                </div>
                <div 
                  className="flex justify-between items-center py-[2.6mm] px-3.5 text-white border-2 border-[#b77b15]"
                  style={{
                    background: 'linear-gradient(to right, #075b36 0%, #0a6b3e 100%)',
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 800,
                  }}
                >
                  <span className="text-[#ffea9f] text-[14.5px]">TOTAL RECEIVED:</span>
                  <span className="text-white text-[16px]" style={{ fontFamily: "'Lora', serif" }}>
                    {formatCurrency(calculatedTotal)}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section: Blessing, 80G Tax Exemption, and Pooja Diya & Prasad Decoration */}
          <div>
            <div className="text-center text-[15px] font-bold italic text-[#075b36] leading-tight mb-[1.2mm]">
              May Lord Shiva Bless You &amp; Your Family<br />
              with Health &amp; Happiness!
            </div>

            <div className="flex items-center justify-center gap-2.5 mb-[1.2mm]">
              <div className="w-[50px] h-[1px] bg-gradient-to-r from-transparent to-[#c79633]" />
              <div className="text-[#b77b15] text-[16px]">🔱</div>
              <div className="w-[50px] h-[1px] bg-gradient-to-l from-transparent to-[#c79633]" />
            </div>

            <div className="text-center text-[10.5px] leading-tight text-[#264132] font-medium mb-[1.5mm]">
              <strong className="text-[#075b36]">Thank you for your generous contribution towards Annadana Seva.</strong><br />
              <span className="font-semibold text-[#5a3508]">All donations are exempt under 80G of Income Tax Act.</span>
            </div>


          </div>

        </div>
      </div>
      </div>
    </div>
  )
}
export default DonationReceipt
