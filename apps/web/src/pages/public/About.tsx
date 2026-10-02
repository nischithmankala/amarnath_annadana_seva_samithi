export function About() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary-900 mb-8 text-center">About Us</h1>
      
      <div className="space-y-8 text-lg text-primary-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-serif font-bold text-saffron-500 mb-4">Our Mission</h2>
          <p>
            Amarnath Annadana Seva Samithi is a non-profit organization established with the sole purpose of serving the pilgrims undertaking the holy Amarnath Yatra. Our mission is to provide nutritious and hygienic food (Annadana) to every devotee visiting the sacred shrine, ensuring that no one goes hungry during this arduous journey.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-bold text-saffron-500 mb-4">Our History</h2>
          <p>
            For over 15 years, our Samithi has been at the forefront of providing free meals at various base camps, especially at the Baltal route. What started as a small initiative by a group of devout individuals has now grown into a massive operation, serving millions of meals during the Yatra period. Our dedication stems from the belief that service to humanity is service to God.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-bold text-saffron-500 mb-4">Our Values</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Selfless Service (Nishkama Karma):</strong> Serving without expecting anything in return.</li>
            <li><strong>Devotion (Bhakti):</strong> Every meal prepared and served is an offering to Lord Shiva.</li>
            <li><strong>Equality (Samata):</strong> Serving everyone equally, regardless of their background.</li>
            <li><strong>Purity (Shuddhata):</strong> Maintaining the highest standards of hygiene and spiritual purity in food preparation.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
