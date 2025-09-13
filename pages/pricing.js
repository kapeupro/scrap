import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Pricing() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 'Gratuit',
      description: 'Parfait pour découvrir',
      searches: '100 recherches/semaine',
      features: [
        '100 recherches par semaine',
        'Export CSV & JSON',
        'Support communauté',
        'Données de base'
      ],
      buttonText: 'Commencer gratuitement',
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '29€',
      period: '/mois',
      description: 'Pour les professionnels',
      searches: '1,000 recherches/mois',
      features: [
        '1,000 recherches par mois',
        'Export CSV & JSON',
        'Support prioritaire',
        'Données enrichies',
        'API access'
      ],
      buttonText: 'Essayer Pro',
      popular: true
    },
    {
      id: 'agency',
      name: 'Agency',
      price: '99€',
      period: '/mois',
      description: 'Pour les agences',
      searches: '5,000 recherches/mois',
      features: [
        '5,000 recherches par mois',
        'Export CSV & JSON',
        'Support dédié',
        'Données complètes',
        'API illimitée',
        'White-label'
      ],
      buttonText: 'Contacter',
      popular: false
    }
  ]

  const handlePlanSelect = async (planId) => {
    setLoading(true)
    
    try {
      if (planId === 'starter') {
        // Redirect to signup for free plan
        router.push('/signup')
        return
      }

      if (planId === 'agency') {
        // Redirect to contact for agency plan
        window.open('mailto:contact@mapscraper.com?subject=Demande plan Agency', '_blank')
        return
      }

      // For Pro plan, redirect to checkout
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login?redirect=pricing')
        return
      }

      // Redirect to checkout page with plan parameter
      router.push(`/checkout?plan=${planId}`)
      
    } catch (error) {
      console.error('Erreur lors de la sélection du plan:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-primary-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
              >
                MapScraper
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Se connecter
              </button>
              <button
                onClick={() => router.push('/signup')}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Commencer
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Tarifs simples et transparents
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Choisissez le plan qui correspond à vos besoins
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                plan.popular ? 'ring-2 ring-primary-500 ring-opacity-50' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-primary-500 text-white text-center py-2 text-sm font-medium">
                  Plus populaire
                </div>
              )}
              
              <div className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-600 text-lg">{plan.period}</span>
                    )}
                  </div>
                  
                  <p className="text-primary-600 font-medium">{plan.searches}</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg
                        className="w-5 h-5 text-green-500 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                      : plan.id === 'starter'
                      ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Chargement...' : plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Questions fréquentes
          </h2>
          
          <div className="space-y-8">
            {[
              {
                question: "Puis-je changer de plan à tout moment ?",
                answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement."
              },
              {
                question: "Que se passe-t-il si je dépasse ma limite ?",
                answer: "Votre compte sera temporairement suspendu jusqu'au renouvellement de votre quota. Vous pouvez upgrader votre plan pour continuer."
              },
              {
                question: "Y a-t-il une période d'essai gratuite ?",
                answer: "Le plan Starter est gratuit à vie avec 100 recherches par semaine. Parfait pour tester nos services."
              },
              {
                question: "Comment fonctionne la facturation ?",
                answer: "La facturation est mensuelle et automatique. Vous pouvez annuler à tout moment sans frais cachés."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600">
            © 2024 MapScraper. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
