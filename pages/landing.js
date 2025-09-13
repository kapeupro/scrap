import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Landing() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const pricingRef = useRef(null)

  const handleGetStarted = async (e) => {
    e.preventDefault()
    if (email) {
      router.push(`/signup?email=${encodeURIComponent(email)}`)
    } else {
      router.push('/signup')
    }
  }

  const handleLogin = () => {
    router.push('/login')
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(heroRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      )

      // Features animation on scroll
      gsap.fromTo(featuresRef.current?.children || [], 
        { opacity: 0, y: 30, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
          }
        }
      )

      // Pricing cards animation
      gsap.fromTo(pricingRef.current?.children || [], 
        { opacity: 0, x: -50, rotationY: -15 },
        { 
          opacity: 1, 
          x: 0, 
          rotationY: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: pricingRef.current,
            start: "top 70%",
          }
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary-200 to-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-primary-300 to-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-32 left-20 w-72 h-72 bg-gradient-to-r from-primary-100 to-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
          
          {/* Particules flottantes avec mouvement */}
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary-400 rounded-full opacity-60 animate-drift" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-primary-500 rounded-full opacity-50 animate-float" style={{animationDelay: '2.5s'}}></div>
          <div className="absolute bottom-1/4 left-1/2 w-5 h-5 bg-primary-300 rounded-full opacity-40 animate-drift" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-primary-600 rounded-full opacity-70 animate-float" style={{animationDelay: '3s'}}></div>
          
          {/* Éléments géométriques animés */}
          <div className="absolute top-1/2 left-10 w-8 h-8 border-2 border-primary-300 rotate-45 animate-wave opacity-30"></div>
          <div className="absolute bottom-1/3 right-20 w-6 h-6 bg-primary-200 transform rotate-12 animate-drift opacity-50"></div>
          <div className="absolute top-20 right-1/2 w-3 h-12 bg-gradient-to-b from-primary-200 to-transparent animate-wave opacity-40"></div>
          
          {/* Lignes ondulantes */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary-200 to-transparent opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-300 to-transparent opacity-40 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        </div>
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center animate-slide-down">
              <div className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer">
                🗺️ MapScraper
              </div>
            </div>
            <div className="flex items-center space-x-4 animate-slide-down" style={{animationDelay: '0.2s'}}>
              <button
                onClick={handleLogin}
                className="text-secondary-600 hover:text-primary-600 font-medium transition-all duration-300 hover:scale-105"
              >
                Se connecter
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-2 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-glow"
              >
                Commencer
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8 animate-bounce-in">
            <span className="bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg border border-primary-300 animate-pulse-slow">
              ✨ Nouveau : Export CSV & JSON
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-secondary-900 mb-6 leading-tight animate-slide-up">
            Trouvez tous les
            <span className="relative block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-primary-600 to-primary-800 animate-gradient-shift animate-text-glow" 
                    style={{backgroundSize: '200% 200%'}}>
                établissements
              </span>
              <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-500 blur-sm opacity-50 animate-pulse-slow">
                établissements
              </span>
            </span>
            en un clic
          </h1>
          
          <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.3s'}}>
            Extrayez facilement les données de restaurants, hôtels, pharmacies et plus encore. 
            Export CSV instantané, interface moderne, données fiables.
          </p>

          {/* Email Signup */}
          <form onSubmit={handleGetStarted} className="max-w-md mx-auto mb-8 animate-scale-in" style={{animationDelay: '0.5s'}}>
            <div className="flex gap-3 group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                className="flex-1 px-4 py-3 border-2 border-primary-200 rounded-xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-semibold whitespace-nowrap transform hover:scale-105 hover:shadow-xl animate-glow"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Chargement...
                  </div>
                ) : (
                  'Commencer gratuitement'
                )}
              </button>
            </div>
          </form>

          <p className="text-sm text-secondary-500 mb-12 animate-fade-in" style={{animationDelay: '0.7s'}}>
            <span className="inline-flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              100 recherches gratuites
            </span>
            <span className="mx-2">•</span>
            <span className="inline-flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              Aucune carte bancaire requise
            </span>
          </p>

          {/* Demo Preview */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto border border-primary-100 animate-scale-in" style={{animationDelay: '0.9s'}}>
            <div className="bg-gradient-to-r from-primary-50 to-red-50 rounded-2xl p-6 mb-6 border border-primary-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-xl shadow-lg animate-pulse">
                  <span className="text-white font-medium text-lg">🔍</span>
                </div>
                <div className="flex-1 bg-white rounded-xl p-4 border-2 border-primary-200 shadow-inner">
                  <span className="text-secondary-600 font-medium">restaurant à Paris</span>
                </div>
                <button className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg animate-glow">
                  Rechercher
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { name: "Le Bistrot Parisien", category: "Restaurant français", rating: "4.5", address: "15 Rue de la Paix, Paris" },
                { name: "Sushi Sakura", category: "Restaurant japonais", rating: "4.6", address: "67 Boulevard Haussmann, Paris" },
                { name: "Pizza Roma", category: "Restaurant italien", rating: "4.3", address: "28 Avenue Victor Hugo, Paris" }
              ].map((place, i) => (
                <div key={i} className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-2xl border border-primary-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slide-up" style={{animationDelay: `${1.1 + i * 0.1}s`}}>
                  <h4 className="font-bold text-secondary-900 text-lg mb-2">{place.name}</h4>
                  <p className="text-sm text-primary-600 font-medium mb-2">{place.category}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-yellow-400 text-lg animate-pulse">⭐</span>
                    <span className="text-sm text-secondary-700 font-semibold bg-yellow-100 px-2 py-1 rounded-full">{place.rating}</span>
                  </div>
                  <p className="text-xs text-secondary-500 bg-secondary-100 p-2 rounded-lg">{place.address}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-white via-primary-50 to-red-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float" style={{animationDelay: '3s'}}></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 animate-slide-up">
              Pourquoi choisir 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700"> MapScraper</span> ?
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.2s'}}>
              L'outil le plus simple et efficace pour extraire des données d'établissements
            </p>
          </div>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Ultra rapide",
                description: "Résultats en quelques secondes. Interface optimisée pour la vitesse.",
                gradient: "from-yellow-400 to-orange-500"
              },
              {
                icon: "📊",
                title: "Export facile",
                description: "CSV et JSON en un clic. Compatible avec Excel, Google Sheets, etc.",
                gradient: "from-primary-400 to-primary-600"
              },
              {
                icon: "🎯",
                title: "Données précises",
                description: "Informations fiables : nom, adresse, téléphone, horaires, notes.",
                gradient: "from-primary-300 to-primary-500"
              },
              {
                icon: "🔒",
                title: "100% sécurisé",
                description: "Vos données sont protégées. Conformité RGPD garantie.",
                gradient: "from-primary-400 to-pink-500"
              },
              {
                icon: "💰",
                title: "Prix transparent",
                description: "Pas de frais cachés. Commencez gratuitement, payez selon vos besoins.",
                gradient: "from-emerald-400 to-teal-500"
              },
              {
                icon: "🚀",
                title: "Toujours à jour",
                description: "Nouvelles fonctionnalités ajoutées régulièrement. Support réactif.",
                gradient: "from-purple-400 to-primary-500"
              }
            ].map((feature, i) => (
              <div key={i} className="group text-center p-8 rounded-3xl bg-white/80 backdrop-blur-lg border border-primary-200 hover:border-primary-300 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl cursor-pointer">
                <div className={`text-5xl mb-6 p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white inline-block shadow-lg group-hover:animate-bounce`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-secondary-600 leading-relaxed group-hover:text-secondary-700 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tarifs simples et transparents
            </h2>
            <p className="text-xl text-gray-600">
              Choisissez le plan qui correspond à vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "Gratuit",
                period: "",
                description: "Parfait pour découvrir",
                features: ["100 recherches/mois", "Export CSV & JSON", "Support communauté", "Données de base"],
                cta: "Commencer gratuitement",
                popular: false
              },
              {
                name: "Pro",
                price: "29€",
                period: "/mois",
                description: "Pour les professionnels",
                features: ["1,000 recherches/mois", "Export CSV & JSON", "Support prioritaire", "Données enrichies", "API access"],
                cta: "Essayer Pro",
                popular: true
              },
              {
                name: "Agency",
                price: "99€",
                period: "/mois",
                description: "Pour les agences",
                features: ["5,000 recherches/mois", "Export CSV & JSON", "Support dédié", "Données complètes", "API illimitée", "White-label"],
                cta: "Contacter",
                popular: false
              }
            ].map((plan, i) => (
              <div key={i} className={`bg-white rounded-2xl p-8 ${plan.popular ? 'ring-2 ring-primary-600 relative' : 'border border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Plus populaire
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center">
                      <span className="text-green-500 mr-3">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => router.push('/signup')}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Rejoignez des milliers d'utilisateurs qui font confiance à MapScraper
          </p>
          <button
            onClick={() => router.push('/signup')}
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Commencer gratuitement
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">🗺️ MapScraper</div>
              <p className="text-gray-400">
                L'outil de référence pour extraire des données d'établissements.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white">Tarifs</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white">CGU</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MapScraper. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
