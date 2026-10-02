export function Gallery() {
  const images = [
    { id: 1, title: "Serving Meals", category: "Seva" },
    { id: 2, title: "Camp Preparation", category: "Behind the Scenes" },
    { id: 3, title: "Devotees at Camp", category: "Yatra" },
    { id: 4, title: "Kitchen Staff", category: "Volunteers" },
    { id: 5, title: "Morning Aarti", category: "Spiritual" },
    { id: 6, title: "Food Distribution", category: "Seva" },
    { id: 7, title: "Medical Camp", category: "Support" },
    { id: 8, title: "Group Photo", category: "Volunteers" },
    { id: 9, title: "Night View of Camp", category: "Yatra" },
  ]

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-900 mb-4">Photo Gallery</h1>
        <p className="text-lg text-primary-700">Glimpses of our seva and dedication over the years.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {images.map(image => (
          <div key={image.id} className="group relative overflow-hidden rounded-xl bg-sand-200 aspect-[4/3]">
            {/* Placeholder for actual image */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="w-12 h-12 rounded-full bg-sand-300 mb-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-primary-900/40 font-serif font-medium text-center">{image.title}</span>
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-primary-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
              <span className="text-saffron-400 text-sm font-semibold tracking-wider uppercase mb-2">{image.category}</span>
              <h3 className="text-white text-xl font-serif font-bold">{image.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
